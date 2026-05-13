import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ESPECIALIDADES = [
  { value: 'PSICOLOGIA_CLINICA', label: 'Psicologia clínica' },
  { value: 'PSIQUIATRIA',        label: 'Psiquiatria' },
  { value: 'TCC',                label: 'Terapia cognitivo-comportamental' },
  { value: 'PSICANALISE',        label: 'Psicanálise' },
  { value: 'FAMILIAR',           label: 'Terapia familiar' },
  { value: 'INFANTIL',           label: 'Psicologia infantil' },
]

function BarraForca({ senha }) {
  let forca = 0
  if (senha.length >= 8) forca++
  if (/[A-Z]/.test(senha)) forca++
  if (/[0-9]/.test(senha)) forca++
  if (/[^A-Za-z0-9]/.test(senha)) forca++

  const cores  = ['bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-green-500']
  const labels = ['Muito fraca', 'Fraca', 'Boa', 'Forte']

  if (!senha) return null
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i <= forca ? cores[forca-1] : 'bg-gray-200'}`}/>
        ))}
      </div>
      <p className={`text-xs ${forca > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
        {forca > 0 ? labels[forca-1] : ''}
      </p>
    </div>
  )
}

export default function CadastroPage() {
  const { cadastro } = useAuth()
  const navigate     = useNavigate()

  const [etapa,   setEtapa]   = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  const [form, setForm] = useState({
    perfil:        'PACIENTE',
    nome:          '',
    email:         '',
    cpf:           '',
    telefone:      '',
    dataNascimento:'',
    planoSaude:    '',
    crp:           '',
    especialidade: 'PSICOLOGIA_CLINICA',
    senha:         '',
    confirmar:     '',
    termos:        false,
  })

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setErro('')
  }

  function validarEtapa1() {
    if (!form.perfil) { setErro('Selecione um perfil.'); return false }
    return true
  }

  function validarEtapa2() {
    if (!form.nome.trim())  { setErro('Nome é obrigatório.'); return false }
    if (!form.email.trim()) { setErro('E-mail é obrigatório.'); return false }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setErro('E-mail inválido.'); return false }
    if (!form.cpf.trim())   { setErro('CPF é obrigatório.'); return false }
    if (form.perfil === 'PROFISSIONAL' && !form.crp.trim()) { setErro('CRP é obrigatório.'); return false }
    return true
  }

  function validarEtapa3() {
    if (form.senha.length < 8)        { setErro('Senha deve ter pelo menos 8 caracteres.'); return false }
    if (form.senha !== form.confirmar) { setErro('As senhas não coincidem.'); return false }
    if (!form.termos)                  { setErro('Aceite os termos para continuar.'); return false }
    return true
  }

  function avancar() {
    setErro('')
    if (etapa === 1 && !validarEtapa1()) return
    if (etapa === 2 && !validarEtapa2()) return
    setEtapa(e => e + 1)
  }

  async function handleSubmit() {
    if (!validarEtapa3()) return
    setLoading(true)
    setErro('')
    try {
      const usuario = await cadastro({
        nome:           form.nome,
        email:          form.email,
        cpf:            form.cpf,
        telefone:       form.telefone,
        senha:          form.senha,
        perfil:         form.perfil,
        dataNascimento: form.dataNascimento || undefined,
        planoSaude:     form.planoSaude    || undefined,
        crp:            form.crp           || undefined,
        especialidade:  form.especialidade || undefined,
      })
      navigate(usuario.perfil === 'PACIENTE' ? '/paciente' : '/profissional')
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const progresso = etapa === 1 ? 33 : etapa === 2 ? 66 : 100

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md">

        {/* Logo */}
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

        {/* Título e progresso */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-gray-900 text-center mb-1">Criar conta</h1>
          <p className="text-xs text-center text-gray-400 mb-4">
            Passo {etapa} de 3 —{' '}
            {etapa === 1 ? 'Tipo de conta' : etapa === 2 ? 'Dados pessoais' : 'Senha'}
          </p>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}/>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
            {erro}
          </div>
        )}

        {/* ── Etapa 1: Perfil ── */}
        {etapa === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-4">Você é...</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'PACIENTE',      label: 'Paciente',      sub: 'Quero agendar consultas', icon: '👤' },
                { value: 'PROFISSIONAL',  label: 'Profissional',  sub: 'Psicólogo ou psiquiatra',  icon: '📋' },
              ].map(op => (
                <button key={op.value} type="button"
                  onClick={() => setForm(f => ({ ...f, perfil: op.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.perfil === op.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="text-2xl mb-2">{op.icon}</div>
                  <p className={`text-sm font-medium ${form.perfil === op.value ? 'text-indigo-700' : 'text-gray-900'}`}>
                    {op.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{op.sub}</p>
                </button>
              ))}
            </div>
            <button onClick={avancar}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 mt-2">
              Continuar →
            </button>
          </div>
        )}

        {/* ── Etapa 2: Dados pessoais ── */}
        {etapa === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nome *</label>
                <input name="nome" value={form.nome} onChange={handle}
                  placeholder="Ana" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sobrenome</label>
                <input name="sobrenome" placeholder="Melo"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">E-mail *</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="ana@email.com" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">CPF *</label>
                <input name="cpf" value={form.cpf} onChange={handle}
                  placeholder="000.000.000-00" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handle}
                  placeholder="(11) 99999-0000" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              </div>
            </div>

            {form.perfil === 'PACIENTE' && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Plano de saúde (opcional)</label>
                <input name="planoSaude" value={form.planoSaude} onChange={handle}
                  placeholder="Bradesco, Unimed, Particular..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              </div>
            )}

            {form.perfil === 'PROFISSIONAL' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CRP *</label>
                  <input name="crp" value={form.crp} onChange={handle}
                    placeholder="06/12345" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Especialidade</label>
                  <select name="especialidade" value={form.especialidade} onChange={handle}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500">
                    {ESPECIALIDADES.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setEtapa(1)}
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                ← Voltar
              </button>
              <button onClick={avancar}
                className="flex-[2] py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── Etapa 3: Senha ── */}
        {etapa === 3 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Criar senha *</label>
              <input name="senha" type="password" value={form.senha} onChange={handle}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"/>
              <BarraForca senha={form.senha}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Confirmar senha *</label>
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
            <div className="flex items-start gap-2.5 py-1">
              <input type="checkbox" name="termos" id="termos" checked={form.termos} onChange={handle}
                className="mt-0.5 flex-shrink-0"/>
              <label htmlFor="termos" className="text-xs text-gray-500 leading-relaxed">
                Li e concordo com os{' '}
                <a href="#" className="text-indigo-600 hover:underline">Termos de Uso</a>
                {' '}e a{' '}
                <a href="#" className="text-indigo-600 hover:underline">Política de Privacidade</a>
              </label>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setEtapa(2)}
                className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                ← Voltar
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-[2] py-2.5 bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                {loading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          Já tem conta?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}