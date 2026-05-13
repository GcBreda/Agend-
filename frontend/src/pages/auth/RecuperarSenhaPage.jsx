import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/api'

function Logo() {
  return (
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
  )
}

// ── Etapa 1: Informar e-mail ─────────────────────────────────
function EtapaEmail({ onEnviar }) {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) { setErro('Informe seu e-mail.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setErro('E-mail inválido.'); return }
    setLoading(true)
    setErro('')
    try {
      await authService.recuperar(email)
      onEnviar(email)
    } catch {
      // Sempre avança — não vaza se o e-mail existe
      onEnviar(email)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-lg font-medium text-center text-gray-900 mb-1">Esqueceu a senha?</h1>
      <p className="text-sm text-center text-gray-500 mb-6">
        Informe seu e-mail e enviaremos um código de verificação.
      </p>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">{erro}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">E-mail cadastrado</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErro('') }}
            placeholder="seu@email.com"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
          <p className="text-xs text-gray-400 mt-1">Enviaremos um código de 6 dígitos</p>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {loading ? 'Enviando...' : 'Enviar código →'}
        </button>
        <Link to="/login"
          className="block w-full py-2.5 text-center border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
          ← Voltar ao login
        </Link>
      </form>
    </>
  )
}

// ── Etapa 2: Digitar código OTP ──────────────────────────────
function EtapaOTP({ email, onVerificar, onReenviar }) {
  const [otp,     setOtp]     = useState(['', '', '', '', '', ''])
  const [erro,    setErro]    = useState('')
  const [timer,   setTimer]   = useState(30)
  const [podReenv, setPodReenv] = useState(false)

  useEffect(() => {
    if (timer <= 0) { setPodReenv(true); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  function handleOtp(valor, idx) {
    const novo = [...otp]
    novo[idx] = valor.replace(/\D/, '').slice(-1)
    setOtp(novo)
    setErro('')
    if (valor && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  function handleVerificar() {
    const codigo = otp.join('')
    if (codigo.length < 6) { setErro('Digite o código completo de 6 dígitos.'); return }
    onVerificar(codigo)
  }

  function handleReenviar() {
    if (!podReenv) return
    setPodReenv(false)
    setTimer(30)
    setOtp(['', '', '', '', '', ''])
    onReenviar()
  }

  const emailMascarado = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) =>
    a + '*'.repeat(Math.min(b.length, 4)) + c
  )

  return (
    <>
      <h1 className="text-lg font-medium text-center text-gray-900 mb-1">Verifique seu e-mail</h1>
      <p className="text-sm text-center text-gray-500 mb-6">
        Enviamos um código para <strong className="text-gray-700">{emailMascarado}</strong>.
        Válido por 10 minutos.
      </p>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">{erro}</div>
      )}

      {/* Campos OTP */}
      <div className="flex justify-center gap-2 mb-6">
        {otp.map((d, i) => (
          <input key={i} id={`otp-${i}`}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleOtp(e.target.value, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            className={`w-11 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none transition-colors
              ${d ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-gray-50 text-gray-900'}
              focus:border-indigo-500 focus:bg-white`}
          />
        ))}
      </div>

      <div className="space-y-3">
        <button onClick={handleVerificar}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          Verificar código →
        </button>
        <div className="text-center text-sm text-gray-500">
          Não recebeu?{' '}
          {podReenv ? (
            <button onClick={handleReenviar} className="text-indigo-600 font-medium hover:underline">
              Reenviar código
            </button>
          ) : (
            <span className="text-gray-400">Reenviar em {timer}s</span>
          )}
        </div>
      </div>
    </>
  )
}

// ── Etapa 3: Nova senha ──────────────────────────────────────
function EtapaNovaSenha({ onSalvar }) {
  const [form,    setForm]    = useState({ senha: '', confirmar: '' })
  const [forca,   setForca]   = useState(0)
  const [erro,    setErro]    = useState('')
  const [loading, setLoading] = useState(false)

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErro('')
    if (name === 'senha') {
      let s = 0
      if (value.length >= 8) s++
      if (/[A-Z]/.test(value)) s++
      if (/[0-9]/.test(value)) s++
      if (/[^A-Za-z0-9]/.test(value)) s++
      setForca(s)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.senha.length < 8)        { setErro('Senha deve ter pelo menos 8 caracteres.'); return }
    if (form.senha !== form.confirmar) { setErro('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await onSalvar(form.senha)
    } catch {
      setErro('Erro ao redefinir senha. Tente novamente.')
      setLoading(false)
    }
  }

  const forcaCores  = ['bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-green-500']
  const forcaLabels = ['Muito fraca', 'Fraca', 'Boa', 'Forte']

  return (
    <>
      <h1 className="text-lg font-medium text-center text-gray-900 mb-1">Nova senha</h1>
      <p className="text-sm text-center text-gray-500 mb-6">
        Escolha uma senha forte para sua conta.
      </p>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">{erro}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Nova senha</label>
          <input name="senha" type="password" value={form.senha} onChange={handle}
            placeholder="Mínimo 8 caracteres"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
          {form.senha && (
            <div className="mt-1.5">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i <= forca ? forcaCores[forca-1] : 'bg-gray-200'}`}/>
                ))}
              </div>
              <p className="text-xs text-gray-400">{forca > 0 ? forcaLabels[forca-1] : ''}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Confirmar nova senha</label>
          <input name="confirmar" type="password" value={form.confirmar} onChange={handle}
            placeholder="Repita a senha"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
          {form.confirmar && form.senha !== form.confirmar && (
            <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
          )}
          {form.confirmar && form.senha === form.confirmar && form.confirmar.length >= 8 && (
            <p className="text-xs text-green-600 mt-1">✓ Senhas coincidem</p>
          )}
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {loading ? 'Redefinindo...' : 'Redefinir senha →'}
        </button>
      </form>
    </>
  )
}

// ── Etapa 4: Sucesso ─────────────────────────────────────────
function EtapaSucesso() {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-lg font-medium text-gray-900 mb-2">Senha redefinida!</h1>
      <p className="text-sm text-gray-500 mb-6">
        Sua senha foi atualizada com sucesso. Você já pode entrar com a nova senha.
      </p>
      <Link to="/login"
        className="block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors text-center">
        Ir para o login →
      </Link>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────
export default function RecuperarSenhaPage() {
  const [etapa, setEtapa] = useState(1)
  const [email, setEmail] = useState('')

  const progresso = etapa === 1 ? 25 : etapa === 2 ? 50 : etapa === 3 ? 75 : 100

  const stepLabels = {
    1: 'Informe o e-mail',
    2: 'Verifique o código',
    3: 'Nova senha',
    4: 'Concluído',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">
        <Logo/>

        {/* Barra de progresso */}
        {etapa < 4 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Passo {etapa} de 3</span>
              <span>{stepLabels[etapa]}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}/>
            </div>
          </div>
        )}

        {etapa === 1 && (
          <EtapaEmail onEnviar={em => { setEmail(em); setEtapa(2) }}/>
        )}
        {etapa === 2 && (
          <EtapaOTP
            email={email}
            onVerificar={() => setEtapa(3)}
            onReenviar={() => authService.recuperar(email).catch(() => {})}
          />
        )}
        {etapa === 3 && (
          <EtapaNovaSenha onSalvar={async () => setEtapa(4)}/>
        )}
        {etapa === 4 && <EtapaSucesso/>}

      </div>
    </div>
  )
}