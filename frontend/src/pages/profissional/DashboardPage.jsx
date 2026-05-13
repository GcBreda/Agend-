import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAgendamentos } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUS_LABEL = {
  PENDENTE:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-700' },
  CONFIRMADO: { label: 'Confirmada', cls: 'bg-indigo-50 text-indigo-700' },
  REALIZADO:  { label: 'Realizada',  cls: 'bg-green-50 text-green-700' },
  CANCELADO:  { label: 'Cancelada',  cls: 'bg-red-50 text-red-600' },
}

const TIPO_LABEL = {
  AVALIACAO_INICIAL: 'Avaliação inicial',
  ACOMPANHAMENTO:    'Acompanhamento',
  TCC:               'TCC',
  PSICANALISE:       'Psicanálise',
}

export default function ProfissionalDashboard() {
  const { usuario } = useAuth()
  const { data: agendamentos = [], isLoading } = useAgendamentos()

  const hoje = new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' })

  const deHoje = agendamentos.filter(ag => {
    const d = new Date(ag.dataHora).toLocaleDateString('pt-BR', { dateStyle: 'short' })
    return d === hoje
  }).sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))

  const confirmadas = deHoje.filter(a => a.status === 'CONFIRMADO').length
  const realizadas  = agendamentos.filter(a => a.status === 'REALIZADO').length
  const proximas    = agendamentos.filter(a => ['PENDENTE', 'CONFIRMADO'].includes(a.status))

  // Pacientes únicos
  const pacientesUnicos = [...new Set(agendamentos.map(a => a.pacienteId))].length

  function formatarHora(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <DashboardLayout titulo="Visão geral">

      {/* Boas vindas */}
      <div className="bg-indigo-600 rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            Bom dia, {usuario?.nome?.split(' ')[0]}!
          </p>
          <p className="text-xs text-indigo-200 mt-0.5">
            Você tem <strong className="text-white">{deHoje.length} consulta{deHoje.length !== 1 ? 's' : ''}</strong> hoje · {confirmadas} confirmada{confirmadas !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/profissional/agenda"
          className="text-xs font-medium text-indigo-700 bg-white px-3 py-1.5 rounded-lg hover:bg-indigo-50">
          Ver agenda →
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Consultas hoje</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : deHoje.length}</p>
          <p className="text-xs text-indigo-600 mt-1">{confirmadas} confirmadas</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Próximas</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : proximas.length}</p>
          <p className="text-xs text-gray-400 mt-1">agendadas</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Pacientes ativos</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : pacientesUnicos}</p>
          <p className="text-xs text-gray-400 mt-1">no total</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Sessões realizadas</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : realizadas}</p>
          <p className="text-xs text-green-600 mt-1">↑ este período</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Agenda de hoje */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Agenda de hoje</h2>
            <Link to="/profissional/agenda" className="text-xs text-indigo-600 hover:underline">Ver completa →</Link>
          </div>

          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Carregando...</div>
          ) : deHoje.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-gray-400">Nenhuma consulta hoje</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {deHoje.map(ag => {
                const status = STATUS_LABEL[ag.status] || STATUS_LABEL.PENDENTE
                return (
                  <div key={ag.id} className="px-5 py-3.5 flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
                      {formatarHora(ag.dataHora)}
                    </span>
                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                      ag.status === 'CONFIRMADO' ? 'bg-indigo-500' :
                      ag.status === 'REALIZADO'  ? 'bg-green-500'  :
                      ag.status === 'CANCELADO'  ? 'bg-red-400'    : 'bg-amber-400'
                    }`}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ag.paciente?.usuario?.nome}
                      </p>
                      <p className="text-xs text-gray-400">{TIPO_LABEL[ag.tipoSessao]} · 50 min</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Próximas + atalhos */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900">Próximas consultas</h2>
            </div>
            {proximas.length === 0 ? (
              <p className="text-xs text-gray-400 px-4 py-4">Nenhuma consulta agendada</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {proximas.slice(0, 4).map(ag => (
                  <div key={ag.id} className="px-4 py-3 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                      {ag.paciente?.usuario?.nome?.split(' ').slice(0,2).map(n=>n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{ag.paciente?.usuario?.nome}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(ag.dataHora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})} · {formatarHora(ag.dataHora)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Atalhos */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Acesso rápido</h2>
            <div className="flex flex-col gap-2">
              <Link to="/profissional/pacientes"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 py-1.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">👥</span>
                Ver pacientes
              </Link>
              <Link to="/profissional/prontuarios"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 py-1.5">
                <span className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">📋</span>
                Prontuários
              </Link>
              <Link to="/profissional/financeiro"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 py-1.5">
                <span className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">💰</span>
                Financeiro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}