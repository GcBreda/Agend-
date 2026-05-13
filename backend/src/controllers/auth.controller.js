// backend/src/controllers/auth.controller.js
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { prisma } = require('../prisma/client')

// ── Helpers ─────────────────────────────────────────────────
function gerarAccessToken(usuario) {
  return jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )
}

async function gerarRefreshToken(usuarioId) {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

  await prisma.refreshToken.create({
    data: { token, usuarioId, expiresAt }
  })

  return token
}

// ── POST /api/auth/cadastro ──────────────────────────────────
async function cadastro(req, res, next) {
  try {
    const { nome, email, cpf, senha, telefone, perfil,
            dataNascimento, planoSaude, crp, especialidade } = req.body

    const existe = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] }
    })
    if (existe) {
      return res.status(409).json({ error: 'E-mail ou CPF já cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(senha, 12)

    const usuario = await prisma.usuario.create({
      data: {
        nome, email, cpf, senhaHash, telefone,
        perfil: perfil.toUpperCase(),
        // Cria o perfil específico junto com o usuário
        ...(perfil === 'PACIENTE' && {
          paciente: {
            create: {
              dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
              planoSaude: planoSaude || null
            }
          }
        }),
        ...(perfil === 'PROFISSIONAL' && {
          profissional: {
            create: {
              crp,
              especialidade: especialidade.toUpperCase(),
              valorSessao: 180
            }
          }
        })
      },
      select: { id: true, nome: true, email: true, perfil: true }
    })

    const accessToken  = gerarAccessToken(usuario)
    const refreshToken = await gerarRefreshToken(usuario.id)

    res.status(201).json({ usuario, accessToken, refreshToken })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/login ─────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, senha } = req.body

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const payload    = { id: usuario.id, perfil: usuario.perfil }
    const accessToken  = gerarAccessToken(payload)
    const refreshToken = await gerarRefreshToken(usuario.id)

    res.json({
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
      accessToken,
      refreshToken
    })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/refresh ───────────────────────────────────
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token não fornecido.' })
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { usuario: true }
    })

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado.' })
    }

    // Rotação de token: invalida o atual e gera um novo
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } })

    const novoAccess  = gerarAccessToken(tokenRecord.usuario)
    const novoRefresh = await gerarRefreshToken(tokenRecord.usuarioId)

    res.json({ accessToken: novoAccess, refreshToken: novoRefresh })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/logout ────────────────────────────────────
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ message: 'Logout realizado com sucesso.' })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/recuperar-senha ───────────────────────────
async function solicitarRecuperacao(req, res, next) {
  try {
    const { email } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    // Retorna 200 mesmo se não encontrar (não vaza se o e-mail existe)
    if (!usuario) {
      return res.json({ message: 'Se o e-mail existir, você receberá o código.' })
    }

    // Em produção: gerar OTP, salvar no Redis com TTL de 10min e enviar por e-mail
    // Exemplo simplificado para o projeto acadêmico:
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`[DEV] OTP para ${email}: ${otp}`)

    res.json({ message: 'Se o e-mail existir, você receberá o código.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { cadastro, login, refresh, logout, solicitarRecuperacao }
