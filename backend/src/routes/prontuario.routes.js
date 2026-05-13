 const { Router } = require('express')
const { body } = require('express-validator')
const { authMiddleware, requireRole } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const { listarPorPaciente, criar, atualizar } = require('../controllers/prontuario.controller')

const router = Router()

router.use(authMiddleware)

router.get('/paciente/:pacienteId',
  requireRole('PROFISSIONAL'),
  listarPorPaciente
)

router.post('/',
  requireRole('PROFISSIONAL'),
  [
    body('agendamentoId').isUUID(),
    body('anotacoes').optional().isString()
  ],
  validate,
  criar
)

router.put('/:id',
  requireRole('PROFISSIONAL'),
  atualizar
)

module.exports = router
