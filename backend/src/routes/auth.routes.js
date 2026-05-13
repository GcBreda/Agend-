// backend/src/routes/auth.routes.js
const { Router } = require('express')
const { body }   = require('express-validator')
const { validate } = require('../middleware/validate.middleware')
const {
  cadastro, login, refresh, logout, solicitarRecuperacao
} = require('../controllers/auth.controller')

const router = Router()

router.post('/cadastro',
  [
    body('nome').trim().notEmpty().withMessage('Nome obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('cpf').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).withMessage('CPF inválido'),
    body('senha').isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres'),
    body('perfil').isIn(['PACIENTE', 'PROFISSIONAL']).withMessage('Perfil inválido')
  ],
  validate,
  cadastro
)

router.post('/login',
  [
    body('email').isEmail(),
    body('senha').notEmpty()
  ],
  validate,
  login
)

router.post('/refresh', refresh)
router.post('/logout',  logout)

router.post('/recuperar-senha',
  [body('email').isEmail()],
  validate,
  solicitarRecuperacao
)

module.exports = router
