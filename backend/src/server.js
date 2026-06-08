require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes         = require('./routes/auth.routes')
const agendamentoRoutes  = require('./routes/agendamento.routes')
const prontuarioRoutes   = require('./routes/prontuario.routes')
const pagamentoRoutes    = require('./routes/pagamento.routes')
const profissionalRoutes = require('./routes/profissional.routes')
const pacienteRoutes     = require('./routes/paciente.routes')
const { errorHandler }   = require('./middleware/error.middleware')


const app = express()

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'https://agendo-psi.vercel.app'
    ]
    if (!origin || allowed.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' }
}))

app.use('/api/auth',         authRoutes)
app.use('/api/agendamentos', agendamentoRoutes)
app.use('/api/prontuarios',  prontuarioRoutes)
app.use('/api/pagamentos',   pagamentoRoutes)
app.use('/api/profissionais',profissionalRoutes)
app.use('/api/pacientes',    pacienteRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Agendô API rodando na porta ${PORT}`))

module.exports = app