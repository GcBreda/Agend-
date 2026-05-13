const { Router } = require('express')
const { body, query } = require('express-validator')
const { authMiddleware, requireRole } = require('../middleware/auth.middleware')
const { validate } = require('../middleware/validate.middleware')
const {
  horariosDisponiveis, criar, listar, cancelar
} = require('../controllers/agendamento.controller')

const router = Router()

router.use(authMiddleware)

router.get('/disponiveis',
  [
    query('profissionalId').notEmpty(),
    query('data').isDate()
  ],
  validate,
  horariosDisponiveis
)

router.get('/', listar)

router.post('/',
  requireRole('PACIENTE'),
  [
    body('profissionalId').isUUID(),
    body('dataHora').isISO8601(),
    body('tipoSessao').isIn(['AVALIACAO_INICIAL','ACOMPANHAMENTO','TCC','PSICANALISE'])
  ],
  validate,
  criar
)

router.patch('/:id/cancelar', cancelar)

module.exports = router