// backend/src/jobs/notificacao.job.js
// BullMQ: agenda lembretes automáticos quando um agendamento é criado

const { Queue, Worker } = require('bullmq')
const { prisma } = require('../prisma/client')

const redisConnection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : { host: 'localhost', port: 6379 }

const notificacaoQueue = new Queue('notificacoes', { connection: redisConnection })

// ── Agenda os 3 lembretes para um agendamento ────────────────
async function agendarNotificacoes(agendamento) {
  const dataConsulta = new Date(agendamento.dataHora)

  const lembretes = [
    { antecedencia: 3 * 24 * 60 * 60 * 1000, tipo: '3_DIAS_ANTES'  },
    { antecedencia: 1 * 24 * 60 * 60 * 1000, tipo: '1_DIA_ANTES'   },
    { antecedencia: 2 * 60 * 60 * 1000,       tipo: '2_HORAS_ANTES' }
  ]

  for (const lembrete of lembretes) {
    const dispararEm = new Date(dataConsulta.getTime() - lembrete.antecedencia)
    const delay = dispararEm.getTime() - Date.now()

    // Só agenda se ainda está no futuro
    if (delay > 0) {
      await notificacaoQueue.add(
        'enviar-lembrete',
        {
          agendamentoId:  agendamento.id,
          pacienteId:     agendamento.pacienteId,
          profissionalId: agendamento.profissionalId,
          dataHora:       agendamento.dataHora,
          tipo:           lembrete.tipo
        },
        { delay }
      )
    }
  }
}

// ── Worker: processa os jobs da fila ─────────────────────────
const worker = new Worker(
  'notificacoes',
  async job => {
    const { agendamentoId, tipo } = job.data

    // Verifica se o agendamento ainda está ativo
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
      include: {
        paciente:     { include: { usuario: true } },
        profissional: { include: { usuario: true } }
      }
    })

    if (!agendamento || agendamento.status === 'CANCELADO') return

    const emailPaciente = agendamento.paciente.usuario.email
    const nomeProfissional = agendamento.profissional.usuario.nome
    const dataFormatada = new Date(agendamento.dataHora).toLocaleString('pt-BR')

    const mensagens = {
      '3_DIAS_ANTES':  `Lembrete: sua consulta com ${nomeProfissional} está em 3 dias — ${dataFormatada}.`,
      '1_DIA_ANTES':   `Sua sessão é amanhã! ${nomeProfissional} às ${dataFormatada}. Confirme sua presença.`,
      '2_HORAS_ANTES': `Sua consulta começa em 2 horas. ${nomeProfissional} — ${dataFormatada}.`
    }

    console.log(`[Job] Enviando ${tipo} para ${emailPaciente}: ${mensagens[tipo]}`)
    // Em produção: chamar nodemailer/SendGrid aqui

    await prisma.notificacao.create({
      data: {
        usuarioId:     agendamento.paciente.usuarioId,
        agendamentoId: agendamento.id,
        tipo,
        canal:         'EMAIL',
        status:        'ENVIADA',
        agendadoPara:  new Date(),
        enviadoEm:     new Date()
      }
    })
  },
  { connection: redisConnection }
)

worker.on('failed', (job, err) => {
  console.error(`[Job falhou] ${job.id}:`, err.message)
})

module.exports = { agendarNotificacoes }
