 const { Router } = require('express')
const { authMiddleware } = require('../middleware/auth.middleware')
const { prisma } = require('../prisma/client')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const profissionais = await prisma.profissional.findMany({
      where: { ativo: true },
      include: { usuario: { select: { nome: true, email: true } } }
    })
    res.json({ profissionais })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const profissional = await prisma.profissional.findUnique({
      where: { id: req.params.id },
      include: { usuario: { select: { nome: true, email: true } }, disponibilidades: true }
    })
    if (!profissional) return res.status(404).json({ error: 'Profissional não encontrado.' })
    res.json({ profissional })
  } catch (err) { next(err) }
})

module.exports = router
