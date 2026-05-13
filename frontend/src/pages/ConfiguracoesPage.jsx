import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/layout/DashboardLayout'

const MENU = [
  { id: 'perfil',     label: 'Perfil',         icon: '👤' },
  { id: 'seguranca',  label: 'Segurança',       icon: '🔒' },
  { id: 'notif',      label: 'Notificações',    icon: '🔔' },
  { id: 'pagamento',  label: 'Pagamento',       icon: '💳' },
  { id: 'danger',     label: 'Zona de perigo',  icon: '⚠️' },
]

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${on ? 'bg-indigo-600' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${on ? 'left-5' : 'left-1'}`}/>
    </button>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4 pb-3 border-b border-gray-100">{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input {...props}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white"/>
    </div>
  )
}

// ── Painéis ──────────────────────────────────────────────────

function PainelPerfil({ usuario }) {
  const [form, setForm] = useState({
    nome:      usuario?.nome || '',
    email:     usuario?.email || '',
    telefone:  '',
    planoSaude: ''
  })
  const [salvo, setSalvo] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setSalvo(false)
  }

  function handleSalvar() {
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  const iniciais = usuario?.nome?.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()

  return (
    <>
      <SectionCard title="Foto e informações básicas">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 text-xl font-medium flex items-center justify-center flex-shrink-0">
            {iniciais}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{usuario?.nome}</p>
            <p className="text-xs text-gray-400 mb-2">{usuario?.perfil === 'PACIENTE' ? 'Paciente' : 'Profissional'}</p>
            <button className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
              Trocar foto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome completo" name="nome" value={form.nome} onChange={handleChange}/>
          <Field label="E-mail" name="email" type="email" value={form.email} onChange={handleChange}/>
          <Field label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-0000"/>
          <Field label="Plano de saúde" name="planoSaude" value={form.planoSaude} onChange={handleChange} placeholder="Bradesco, Unimed..."/>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          {salvo && <span className="text-xs text-green-600 self-center">✓ Salvo com sucesso!</span>}
          <button onClick={handleSalvar}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Salvar alterações
          </button>
        </div>
      </SectionCard>
    </>
  )
}

function PainelSeguranca() {
  const [form, setForm] = useState({ atual: '', nova: '', confirmar: '' })
  const [forca, setForca] = useState(0)
  const [erro, setErro]   = useState('')
  const [salvo, setSalvo] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  function checkForca(v) {
    let s = 0
    if (v.length >= 8) s++
    if (/[A-Z]/.test(v)) s++
    if (/[0-9]/.test(v)) s++
    if (/[^A-Za-z0-9]/.test(v)) s++
    setForca(s)
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'nova') checkForca(e.target.value)
    setErro('')
  }

  function handleSalvar() {
    if (form.nova !== form.confirmar) { setErro('As senhas não coincidem.'); return }
    if (form.nova.length < 8) { setErro('A nova senha deve ter pelo menos 8 caracteres.'); return }
    setSalvo(true)
    setForm({ atual: '', nova: '', confirmar: '' })
    setForca(0)
    setTimeout(() => setSalvo(false), 2500)
  }

  const forcaCores  = ['bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-green-500']
  const forcaLabels = ['Muito fraca', 'Fraca', 'Boa', 'Forte']

  return (
    <>
      <SectionCard title="Alterar senha">
        <Field label="Senha atual" name="atual" type="password" value={form.atual} onChange={handleChange} placeholder="••••••••"/>
        <Field label="Nova senha"  name="nova"  type="password" value={form.nova}  onChange={handleChange} placeholder="Mínimo 8 caracteres"/>
        {form.nova && (
          <div className="mb-4 -mt-2">
            <div className="flex gap-1 mb-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full ${i <= forca ? forcaCores[forca-1] : 'bg-gray-200'}`}/>
              ))}
            </div>
            <p className={`text-xs ${forca > 0 ? 'text-gray-500' : 'text-gray-400'}`}>
              {forca > 0 ? forcaLabels[forca-1] : ''}
            </p>
          </div>
        )}
        <Field label="Confirmar nova senha" name="confirmar" type="password" value={form.confirmar} onChange={handleChange} placeholder="Repita a nova senha"/>
        {erro && <p className="text-xs text-red-600 mb-3">{erro}</p>}
        <div className="flex justify-end gap-2">
          {salvo && <span className="text-xs text-green-600 self-center">✓ Senha atualizada!</span>}
          <button onClick={handleSalvar}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Atualizar senha
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Autenticação em dois fatores">
        <Row label="Autenticação por SMS" sub="Receba um código ao fazer login">
          <Toggle on={twoFactor} onChange={setTwoFactor}/>
        </Row>
        <Row label="App autenticador" sub="Google Authenticator ou similar">
          <button className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">Configurar</button>
        </Row>
      </SectionCard>
    </>
  )
}

function PainelNotificacoes() {
  const [notif, setNotif] = useState({
    tres_dias: true, um_dia: true, duas_horas: true,
    email: true, sms: false, push: false,
    pagamento: true, novidades: false
  })

  function toggle(key) { setNotif(n => ({ ...n, [key]: !n[key] })) }

  return (
    <>
      <SectionCard title="Lembretes de consulta">
        <Row label="3 dias antes"  sub="Lembrete por e-mail"><Toggle on={notif.tres_dias}   onChange={() => toggle('tres_dias')}/></Row>
        <Row label="1 dia antes"   sub="E-mail com botão de confirmar"><Toggle on={notif.um_dia}      onChange={() => toggle('um_dia')}/></Row>
        <Row label="2 horas antes" sub="SMS com endereço"><Toggle on={notif.duas_horas} onChange={() => toggle('duas_horas')}/></Row>
      </SectionCard>
      <SectionCard title="Canais de notificação">
        <Row label="E-mail" sub="seu@email.com"><Toggle on={notif.email} onChange={() => toggle('email')}/></Row>
        <Row label="SMS"    sub="(11) 99999-0000"><Toggle on={notif.sms}   onChange={() => toggle('sms')}/></Row>
        <Row label="Push"   sub="Notificações no navegador"><Toggle on={notif.push}  onChange={() => toggle('push')}/></Row>
      </SectionCard>
      <SectionCard title="Outras notificações">
        <Row label="Confirmação de pagamento"><Toggle on={notif.pagamento}  onChange={() => toggle('pagamento')}/></Row>
        <Row label="Novidades do Agendô"><Toggle on={notif.novidades} onChange={() => toggle('novidades')}/></Row>
      </SectionCard>
    </>
  )
}

function PainelPagamento() {
  return (
    <>
      <SectionCard title="Métodos de pagamento">
        <Row label="Visa •••• 4821" sub="Vence 09/28 · Principal">
          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">Principal</span>
        </Row>
        <Row label="PIX" sub="Chave: CPF cadastrado">
          <button className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50">Remover</button>
        </Row>
        <button className="mt-3 w-full py-2.5 border border-dashed border-gray-300 text-sm text-gray-500 rounded-lg hover:bg-gray-50">
          + Adicionar método de pagamento
        </button>
      </SectionCard>
    </>
  )
}

function PainelPerigo({ logout }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
      <h3 className="text-sm font-medium text-red-700 mb-4">Zona de perigo</h3>
      <Row label="Exportar meus dados" sub="Baixar todos os seus dados em formato JSON">
        <button className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100">Exportar</button>
      </Row>
      <Row label="Desativar conta" sub="Sua conta ficará oculta mas os dados serão mantidos">
        <button className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100">Desativar</button>
      </Row>
      <Row label="Excluir conta permanentemente" sub="Todos os dados serão apagados. Ação irreversível.">
        <button onClick={() => { if(window.confirm('Tem certeza? Esta ação é irreversível.')) logout() }}
          className="text-xs text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700">
          Excluir conta
        </button>
      </Row>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────
export default function ConfiguracoesPage() {
  const { usuario, logout } = useAuth()
  const [aba, setAba] = useState('perfil')

  const paineis = {
    perfil:    <PainelPerfil usuario={usuario}/>,
    seguranca: <PainelSeguranca/>,
    notif:     <PainelNotificacoes/>,
    pagamento: <PainelPagamento/>,
    danger:    <PainelPerigo logout={logout}/>,
  }

  return (
    <DashboardLayout titulo="Configurações">
      <div className="flex gap-5">

        {/* Menu lateral */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {MENU.map(m => (
              <button key={m.id} onClick={() => setAba(m.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm border-l-2 transition-colors
                  ${aba === m.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                  } ${m.id === 'danger' ? 'text-red-600' : ''}`}>
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {paineis[aba]}
        </div>

      </div>
    </DashboardLayout>
  )
}