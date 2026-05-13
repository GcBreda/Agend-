 const { Router } = require('express')
const { authMiddleware } = require('../middleware/auth.middleware')
const { prisma } = require('../prisma/client')

const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res, next) => {
  try {
    const paciente = await prisma.paciente.findUnique({ where: { usuarioId: req.user.id } })
    const pagamentos = await prisma.pagamento.findMany({
      where: { pacienteId: paciente?.id },
      orderBy: { criadoEm: 'desc' }
    })
    res.json({ pagamentos })
  } catch (err) { next(err) }
})

module.exports = router
