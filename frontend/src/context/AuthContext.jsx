// frontend/src/context/AuthContext.jsx
import React from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null)
  const [loading, setLoading]   = useState(true)

  // Lê o usuário do localStorage ao iniciar
useEffect(() => {
  try {
    const salvo = localStorage.getItem('agendo_usuario')
    const token = localStorage.getItem('agendo_access_token')
    if (salvo && token) {
      setUsuario(JSON.parse(salvo))
    } else {
      localStorage.removeItem('agendo_usuario')
      localStorage.removeItem('agendo_access_token')
      localStorage.removeItem('agendo_refresh_token')
    }
  } catch {
    localStorage.clear()
  } finally {
    setLoading(false)
  }
}, [])

  const login = useCallback(async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha })

    localStorage.setItem('agendo_access_token',  data.accessToken)
    localStorage.setItem('agendo_refresh_token', data.refreshToken)
    localStorage.setItem('agendo_usuario',       JSON.stringify(data.usuario))

    setUsuario(data.usuario)
    return data.usuario
  }, [])

  const cadastro = useCallback(async (dados) => {
    const { data } = await api.post('/auth/cadastro', dados)

    localStorage.setItem('agendo_access_token',  data.accessToken)
    localStorage.setItem('agendo_refresh_token', data.refreshToken)
    localStorage.setItem('agendo_usuario',       JSON.stringify(data.usuario))

    setUsuario(data.usuario)
    return data.usuario
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('agendo_refresh_token')
    try { await api.post('/auth/logout', { refreshToken }) } catch (_) {}

    localStorage.removeItem('agendo_access_token')
    localStorage.removeItem('agendo_refresh_token')
    localStorage.removeItem('agendo_usuario')
    setUsuario(null)
  }, [])

  const isPaciente     = usuario?.perfil === 'PACIENTE'
  const isProfissional = usuario?.perfil === 'PROFISSIONAL'

  return (
    <AuthContext.Provider value={{ usuario, loading, login, cadastro, logout, isPaciente, isProfissional }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto em qualquer componente
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
