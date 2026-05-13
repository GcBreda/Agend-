// backend/src/controllers/prontuario.controller.js
const { prisma } = require('../prisma/client')

// ── GET /api/prontuarios/paciente/:pacienteId ────────────────
// Só o profissional que atendeu pode ver
async function listarPorPaciente(req, res, next) {
  try {
    const { pacienteId } = req.params

    const profissional = await prisma.profissional.findUnique({
      where: { usuarioId: req.user.id }
    })
    if (!profissional) return res.status(403).json({ error: 'Acesso negado.' })

    // Só retorna prontuários que este profissional criou
    const prontuarios = await prisma.prontuario.findMany({
      where: { pacienteId, profissionalId: profissional.id },
      include: {
        agendamento: { select: { dataHora: true, tipoSessao: true, status: true } }
      },
      orderBy: { criadoEm: 'desc' }
    })

    res.json({ prontuarios })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/prontuarios ────────────────────────────────────
async function criar(req, res, next) {
  try {
    const { agendamentoId, anotacoes, cid, lembretes } = req.body

    const profissional = await prisma.profissional.findUnique({
      where: { usuarioId: req.user.id }
    })
    if (!profissional) return res.status(403).json({ error: 'Apenas profissionais podem criar prontuários.' })

    // Verifica que o agendamento pertence a este profissional
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId }
    })
    if (!agendamento || agendamento.profissionalId !== profissional.id) {
      return res.status(403).json({ error: 'Agendamento não pertence a este profissional.' })
    }

    const prontuario = await prisma.prontuario.create({
      data: {
        agendamentoId,
        profissionalId: profissional.id,
        pacienteId:     agendamento.pacienteId,
        anotacoes,
        cid,
        lembretes
      }
    })

    // Atualiza o status do agendamento para REALIZADO
    await prisma.agendamento.update({
      where: { id: agendamentoId },
      data:  { status: 'REALIZADO' }
    })

    res.status(201).json({ prontuario })
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/prontuarios/:id ─────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const { id } = req.params
    const { anotacoes, cid, lembretes } = req.body

    const profissional = await prisma.profissional.findUnique({
      where: { usuarioId: req.user.id }
    })

    // Garante que só o autor pode editar
    const existente = await prisma.prontuario.findUnique({ where: { id } })
    if (!existente || existente.profissionalId !== profissional?.id) {
      return res.status(403).json({ error: 'Sem permissão para editar este prontuário.' })
    }

    const atualizado = await prisma.prontuario.update({
      where: { id },
      data: { anotacoes, cid, lembretes }
    })

    res.json({ prontuario: atualizado })
  } catch (err) {
    next(err)
  }
}

module.exports = { listarPorPaciente, criar, atualizar };