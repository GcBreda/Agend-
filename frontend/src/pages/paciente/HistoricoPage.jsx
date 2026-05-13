import React, { useState } from 'react'
import { useAgendamentos } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const TIPO_LABEL = {
  AVALIACAO_INICIAL: 'Avaliação inicial',
  ACOMPANHAMENTO:    'Acompanhamento',
  TCC:               'Terapia cognitivo-comportamental',
  PSICANALISE:       'Psicanálise',
}

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ── Modal de detalhes da sessão ──────────────────────────────
function ModalSessao({ agendamento, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md">

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Detalhes da sessão</h2>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{formatarData(agendamento.dataHora)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Profissional</span>
              <span className="font-medium text-gray-900">{agendamento.profissional?.usuario?.nome}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Horário</span>
              <span className="font-medium text-gray-900">{formatarHora(agendamento.dataHora)} · 50 min</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Tipo de sessão</span>
              <span className="font-medium text-gray-900">{TIPO_LABEL[agendamento.tipoSessao]}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${
                agendamento.status === 'REALIZADO' ? 'text-green-600' :
                agendamento.status === 'CANCELADO' ? 'text-red-500' : 'text-gray-900'
              }`}>
                {agendamento.status === 'REALIZADO' ? 'Realizada' :
                 agendamento.status === 'CANCELADO' ? 'Cancelada' : agendamento.status}
              </span>
            </div>
          </div>

          {agendamento.prontuario && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Nota da sessão</p>
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {agendamento.prontuario.anotacoes}
                </p>
                {agendamento.prontuario.lembretes && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-indigo-100">
                    <span>🔔</span>
                    <p className="text-xs text-indigo-700">{agendamento.prontuario.lembretes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose}
            className="w-full py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────
export default function HistoricoPage() {
  const { data: agendamentos = [], isLoading } = useAgendamentos()
  const [sessaoModal,    setSessaoModal]    = useState(null)
  const [filtroStatus,   setFiltroStatus]   = useState('todos')
  const [busca,          setBusca]          = useState('')

  const historico = agendamentos
    .filter(ag => ['REALIZADO', 'CANCELADO'].includes(ag.status))
    .filter(ag => filtroStatus === 'todos' || ag.status === filtroStatus)
    .filter(ag => {
      if (!busca) return true
      return ag.profissional?.usuario?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
             TIPO_LABEL[ag.tipoSessao]?.toLowerCase().includes(busca.toLowerCase())
    })
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))

  const realizadas = agendamentos.filter(a => a.status === 'REALIZADO').length
  const canceladas = agendamentos.filter(a => a.status === 'CANCELADO').length

  // Agrupa por mês/ano
  const porMes = historico.reduce((acc, ag) => {
    const d   = new Date(ag.dataHora)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!acc[key]) acc[key] = { label: `${MESES[d.getMonth()]} ${d.getFullYear()}`, sessoes: [] }
    acc[key].sessoes.push(ag)
    return acc
  }, {})

  return (
    <DashboardLayout titulo="Histórico">

      {sessaoModal && (
        <ModalSessao agendamento={sessaoModal} onClose={() => setSessaoModal(null)}/>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total de sessões</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : realizadas + canceladas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Realizadas</p>
          <p className="text-2xl font-semibold text-green-600">{isLoading ? '...' : realizadas}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Canceladas</p>
          <p className="text-2xl font-semibold text-red-500">{isLoading ? '...' : canceladas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por profissional ou tipo..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'todos',     label: 'Todas' },
            { id: 'REALIZADO', label: 'Realizadas' },
            { id: 'CANCELADO', label: 'Canceladas' },
          ].map(f => (
            <button key={f.id} onClick={() => setFiltroStatus(f.id)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                filtroStatus === f.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista agrupada por mês */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-10 text-center text-sm text-gray-400">
          Carregando...
        </div>
      ) : historico.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-12 text-center">
          <p className="text-sm text-gray-400">Nenhuma sessão encontrada</p>
        </div>
      ) : (
        Object.values(porMes).map(grupo => (
          <div key={grupo.label} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">{grupo.label}</span>
              <span className="text-xs text-gray-400">{grupo.sessoes.length} sessão{grupo.sessoes.length !== 1 ? 'ões' : ''}</span>
            </div>

            <div className="divide-y divide-gray-100">
              {grupo.sessoes.map(ag => (
                <div key={ag.id} className="px-5 py-4 flex items-center gap-4">

                  {/* Data */}
                  <div className="w-10 flex-shrink-0 text-center">
                    <p className="text-sm font-semibold text-gray-900 leading-none">
                      {new Date(ag.dataHora).getDate()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ag.dataHora).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                    </p>
                  </div>

                  {/* Barra */}
                  <div className={`w-1 h-10 rounded-full flex-shrink-0 ${
                    ag.status === 'REALIZADO' ? 'bg-green-400' : 'bg-red-300'
                  }`}/>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ag.profissional?.usuario?.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {TIPO_LABEL[ag.tipoSessao]} · {formatarHora(ag.dataHora)}
                    </p>
                  </div>

                  {/* Status + ação */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      ag.status === 'REALIZADO' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {ag.status === 'REALIZADO' ? 'Realizada' : 'Cancelada'}
                    </span>
                    {ag.status === 'REALIZADO' && (
                      <button onClick={() => setSessaoModal(ag)}
                        className="text-xs text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50">
                        Ver detalhes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

    </DashboardLayout>
  )
}