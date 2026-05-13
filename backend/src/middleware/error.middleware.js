 function errorHandler(err, req, res, next) {
  console.error('[Erro]', err.message)

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Registro duplicado.' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro não encontrado.' })
  }

  const status = err.status || 500
  res.status(status).json({
    error: status === 500 ? 'Erro interno do servidor.' : err.message
  })
}

module.exports = { errorHandler }
