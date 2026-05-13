// frontend/src/services/api.js
// Instância Axios configurada com interceptors de autenticação

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
})

// ── Interceptor de REQUEST: injeta o access token ────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('agendo_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Interceptor de RESPONSE: trata token expirado ───────────
let isRefreshing = false
let failedQueue  = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  )
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Se for 401 e ainda não tentou renovar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Coloca na fila se já está renovando
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('agendo_refresh_token')
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        )

        localStorage.setItem('agendo_access_token',  data.accessToken)
        localStorage.setItem('agendo_refresh_token', data.refreshToken)

        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
        originalRequest.headers.Authorization     = `Bearer ${data.accessToken}`

        processQueue(null, data.accessToken)
        return api(originalRequest)
} catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ── Serviços específicos ─────────────────────────────────────
export const authService = {
  login:      (dados) => api.post('/auth/login', dados),
  cadastro:   (dados) => api.post('/auth/cadastro', dados),
  logout:     (refreshToken) => api.post('/auth/logout', { refreshToken }),
  recuperar:  (email) => api.post('/auth/recuperar-senha', { email })
}

export const agendamentoService = {
  listar:               ()       => api.get('/agendamentos'),
  disponiveis:          (params) => api.get('/agendamentos/disponiveis', { params }),
  criar:                (dados)  => api.post('/agendamentos', dados),
  cancelar:             (id)     => api.patch(`/agendamentos/${id}/cancelar`)
}

export const prontuarioService = {
  listarPorPaciente: (pacienteId) => api.get(`/prontuarios/paciente/${pacienteId}`),
  criar:             (dados)      => api.post('/prontuarios', dados),
  atualizar:         (id, dados)  => api.put(`/prontuarios/${id}`, dados)
}

export const profissionalService = {
  listar:       (filtros) => api.get('/profissionais', { params: filtros }),
  buscarPorId:  (id)      => api.get(`/profissionais/${id}`)
}
