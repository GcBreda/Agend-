import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navPaciente = [
  { path: '/paciente',           label: 'Início',           icon: GridIcon },
  { path: '/paciente/consultas', label: 'Minhas consultas', icon: CalIcon },
  { path: '/paciente/agendar',   label: 'Agendar consulta', icon: PlusIcon },
  { path: '/paciente/historico', label: 'Histórico',        icon: ClockIcon },
  { path: '/paciente/noticias', label: 'Notícias', icon: NewsIcon }
]

const navProfissional = [
  { path: '/profissional',              label: 'Visão geral',    icon: GridIcon },
  { path: '/profissional/agenda',       label: 'Agenda',         icon: CalIcon },
  { path: '/profissional/pacientes',    label: 'Pacientes',      icon: UsersIcon },
  { path: '/profissional/prontuarios',  label: 'Prontuários',    icon: DocIcon },
  { path: '/profissional/financeiro',   label: 'Financeiro',     icon: CardIcon },
  { path: '/profissional/codigo-etica', label: 'Código de Ética', icon: BookIcon },
  { path: '/profissional/dsm5', label: 'DSM-5', icon: BrainIcon },
  { path: '/profissional/documentos-cfp', label: 'Documentos CFP', icon: FileIcon },
  { path: '/profissional/noticias', label: 'Notícias', icon: NewsIcon }
]

export default function DashboardLayout({ children, titulo }) {
  const { usuario, logout, isPaciente } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const nav = isPaciente ? navPaciente : navProfissional

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const iniciais = usuario?.nome
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="none">
              <path d="M8 5v3l2 1.5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.2" opacity=".35"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">
            Agend<span className="text-indigo-600">ô</span>
          </span>
        </div>

        <nav className="flex-1 py-3 px-2">
          {nav.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path} to={path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs mb-0.5 transition-colors
                  ${active
                    ? 'bg-indigo-50 text-indigo-700 font-medium border-l-2 border-indigo-600 rounded-l-none'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-100 px-3 py-3">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
              {iniciais}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{usuario?.nome}</p>
              <p className="text-xs text-gray-400 truncate">{isPaciente ? 'Paciente' : 'Profissional'}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Link to="/configuracoes" className="flex-1 text-center text-xs text-gray-400 hover:text-gray-700 py-1.5 rounded-md hover:bg-gray-50">
              Config.
            </Link>
            <button onClick={handleLogout} className="flex-1 text-center text-xs text-gray-400 hover:text-red-600 py-1.5 rounded-md hover:bg-red-50">
              Sair
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 h-12 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-medium text-gray-900">{titulo}</h1>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </header>
        <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {children}
        </main>
      </div>
    </div>
  )
}

function GridIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".8"/>
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".4"/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity=".4"/>
    </svg>
  )
}

function CalIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 14c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M12 7l1.5 1.5L16 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DocIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function CardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 8h14" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  )
}

function BookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function BrainIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M8 2C5.8 2 4 3.8 4 6c0 1.1.4 2 1.1 2.7C4.4 9.2 4 10.1 4 11c0 1.7 1.3 3 3 3h2c1.7 0 3-1.3 3-3 0-.9-.4-1.8-1.1-2.3C11.6 8 12 7.1 12 6c0-2.2-1.8-4-4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8 2v12M5 7h6M5 10h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function FileIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 1v4h4M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}
function NewsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 6h8M4 9h5M4 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}