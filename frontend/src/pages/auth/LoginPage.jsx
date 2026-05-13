import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]     = useState({ email: '', senha: '' })
  const [erro, setErro]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErro('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      const usuario = await login(form.email, form.senha)
      navigate(usuario.perfil === 'PACIENTE' ? '/paciente' : '/profissional')
    } catch (err) {
      setErro(err.response?.data?.error || 'E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-9 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.2" opacity=".4"/>
              <path d="M8 5v3l2 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-lg font-medium text-gray-900">
            Agend<span className="text-indigo-600">ô</span>
          </span>
        </div>
        <h1 className="text-lg font-medium text-center text-gray-900 mb-1">Bem-vindo de volta</h1>
        <p className="text-sm text-center text-gray-500 mb-6">Entre com sua conta para continuar</p>
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">{erro}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Senha</label>
            <input name="senha" type="password" required value={form.senha} onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
            <div className="text-right mt-1">
              <Link to="/recuperar-senha" className="text-xs text-indigo-600 hover:underline">Esqueci minha senha</Link>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Não tem conta?{' '}
          <Link to="/cadastro" className="text-indigo-600 font-medium hover:underline">Criar conta grátis</Link>
        </p>
      </div>
    </div>
  )
}
