// backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken')
const { prisma } = require('../prisma/client')

// ── Verifica se o token JWT é válido e injeta req.user ──────
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Garante que o usuário ainda existe no banco
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, perfil: true, email: true, nome: true }
    })

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' })
    }

    req.user = usuario
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' })
    }
    return res.status(401).json({ error: 'Token inválido.' })
  }
}

// ── Garante que o usuário tem o perfil exigido ──────────────
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.perfil)) {
      return res.status(403).json({
        error: `Acesso negado. Requer perfil: ${roles.join(' ou ')}.`
      })
    }
    next()
  }
}

module.exports = { authMiddleware, requireRole }
