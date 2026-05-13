// backend/src/controllers/agendamento.controller.js
const { prisma }  = require('../prisma/client')
const { agendarNotificacoes } = require('../jobs/notificacao.job')

// ── GET /api/agendamentos/disponiveis ────────────────────────
// Query: profissionalId, data (YYYY-MM-DD)
async function horariosDisponiveis(req, res, next) {
  try {
    const { profissionalId, data } = req.query
    if (!profissionalId || !data) {
      return res.status(400).json({ error: 'profissionalId e data são obrigatórios.' })
    }

    const profissional = await prisma.profissional.findUnique({
      where: { id: profissionalId },
      include: { disponibilidades: true }
    })
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado.' })

    const dataObj   = new Date(data)
    const diaSemana = ['DOMINGO','SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO'][dataObj.getDay()]

    const disponibilidade = profissional.disponibilidades.find(
      d => d.diaSemana === diaSemana && d.ativo
    )
    if (!disponibilidade) return res.json({ horarios: [] })

    // Gera slots de 50 min dentro do intervalo disponível
    const slots     = gerarSlots(disponibilidade.horaInicio, disponibilidade.horaFim, profissional.duracaoPadrao)
    const ocupados  = await prisma.agendamento.findMany({
      where: {
        profissionalId,
        dataHora: {
          gte: new Date(`${data}T00:00:00`),
          lte: new Date(`${data}T23:59:59`)
        },
        status: { in: ['PENDENTE', 'CONFIRMADO'] }
      },
      select: { dataHora: true }
    })

    const horariosOcupados = new Set(
      ocupados.map(a => a.dataHora.toISOString().slice(11, 16))
    )

    const horarios = slots.map(slot => ({
      hora: slot,
      disponivel: !horariosOcupados.has(slot)
    }))

    res.json({ horarios })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/agendamentos ───────────────────────────────────
async function criar(req, res, next) {
  try {
    const { profissionalId, dataHora, tipoSessao, observacoes, pagamentoId } = req.body
    const pacienteId = req.user.id // vem do JWT — nunca do body

    // Busca o paciente pelo usuário autenticado
    const paciente = await prisma.paciente.findUnique({
      where: { usuarioId: pacienteId }
    })
    if (!paciente) return res.status(403).json({ error: 'Apenas pacientes podem agendar.' })

    // Verifica conflito de horário (lock pelo banco)
    const conflito = await prisma.agendamento.findFirst({
      where: {
        profissionalId,
        dataHora: new Date(dataHora),
        status: { in: ['PENDENTE', 'CONFIRMADO'] }
      }
    })
    if (conflito) return res.status(409).json({ error: 'Horário já ocupado.' })

    const agendamento = await prisma.agendamento.create({
      data: {
        pacienteId:    paciente.id,
        profissionalId,
        pagamentoId:   pagamentoId || null,
        dataHora:      new Date(dataHora),
        tipoSessao:    tipoSessao.toUpperCase(),
        observacoes,
        status:        pagamentoId ? 'CONFIRMADO' : 'PENDENTE'
      },
      include: {
        profissional: { include: { usuario: { select: { nome: true } } } },
        paciente:     { include: { usuario: { select: { nome: true } } } }
      }
    })

    // Dispara jobs de lembrete assíncronos
    await agendarNotificacoes(agendamento)

    res.status(201).json({ agendamento })
  } catch (err) {
    next(err)
  }
}

// ── GET /api/agendamentos ────────────────────────────────────
async function listar(req, res, next) {
  try {
    const usuario = req.user

    // Monta o filtro baseado no perfil — nunca confia em ID da query
    let where = {}
    if (usuario.perfil === 'PACIENTE') {
      const paciente = await prisma.paciente.findUnique({ where: { usuarioId: usuario.id } })
      where = { pacienteId: paciente.id }
    } else {
      const profissional = await prisma.profissional.findUnique({ where: { usuarioId: usuario.id } })
      where = { profissionalId: profissional.id }
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        profissional: { include: { usuario: { select: { nome: true, email: true } } } },
        paciente:     { include: { usuario: { select: { nome: true } } } },
        pagamento:    { select: { valor: true, status: true, metodo: true } }
      },
      orderBy: { dataHora: 'desc' }
    })

    res.json({ agendamentos })
  } catch (err) {
    next(err)
  }
}

// ── PATCH /api/agendamentos/:id/cancelar ─────────────────────
async function cancelar(req, res, next) {
  try {
    const { id } = req.params
    const usuario = req.user

    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
      include: { paciente: true, profissional: true }
    })
    if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado.' })

    // Só o próprio paciente ou profissional podem cancelar
    const autorizado =
      agendamento.paciente.usuarioId     === usuario.id ||
      agendamento.profissional.usuarioId === usuario.id

    if (!autorizado) return res.status(403).json({ error: 'Sem permissão para cancelar.' })

    const atualizado = await prisma.agendamento.update({
      where: { id },
      data:  { status: 'CANCELADO' }
    })

    res.json({ agendamento: atualizado })
  } catch (err) {
    next(err)
  }
}

// ── Helpers ──────────────────────────────────────────────────
function gerarSlots(inicio, fim, duracaoMin) {
  const slots  = []
  let [h, m]   = inicio.split(':').map(Number)
  const [fh, fm] = fim.split(':').map(Number)
  const fimMin = fh * 60 + fm

  while (h * 60 + m + duracaoMin <= fimMin) {
    slots.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
    m += duracaoMin
    if (m >= 60) { h += Math.floor(m / 60); m = m % 60 }
  }

  return slots
}

module.exports = { horariosDisponiveis, criar, listar, cancelar }
