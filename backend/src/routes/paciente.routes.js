const { Router } = require('express')
const { authMiddleware } = require('../middleware/auth.middleware')
const { prisma } = require('../prisma/client')

const router = Router()

router.use(authMiddleware)

router.get('/me', async (req, res, next) => {
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { usuarioId: req.user.id },
      include: { usuario: { select: { nome: true, email: true, telefone: true } } }
    })
    res.json({ paciente })
  } catch (err) { next(err) }
})

module.exports = router 