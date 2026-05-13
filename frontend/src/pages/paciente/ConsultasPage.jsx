import React from 'react'
import { Link } from 'react-router-dom'
import { useAgendamentos, useCancelarAgendamento } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const STATUS_LABEL = {
  PENDENTE:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-700' },
  CONFIRMADO: { label: 'Confirmada', cls: 'bg-indigo-50 text-indigo-700' },
  REALIZADO:  { label: 'Realizada',  cls: 'bg-green-50 text-green-700' },
  CANCELADO:  { label: 'Cancelada',  cls: 'bg-red-50 text-red-600' },
  REMARCADO:  { label: 'Remarcada',  cls: 'bg-gray-100 text-gray-500' },
}

const TIPO_LABEL = {
  AVALIACAO_INICIAL: 'Avaliação inicial',
  ACOMPANHAMENTO:    'Acompanhamento',
  TCC:               'Terapia cognitivo-comportamental',
  PSICANALISE:       'Psicanálise',
}

export default function ConsultasPage() {
  const { data: agendamentos = [], isLoading } = useAgendamentos()
  const { mutateAsync: cancelar, isPending: cancelando } = useCancelarAgendamento()

  const proximas  = agendamentos.filter(a => ['PENDENTE', 'CONFIRMADO'].includes(a.status))
    .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
  const passadas  = agendamentos.filter(a => ['REALIZADO', 'CANCELADO', 'REMARCADO'].includes(a.status))
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))

  async function handleCancelar(id) {
    if (!window.confirm('Deseja cancelar esta consulta?')) return
    try {
      await cancelar(id)
    } catch {
      alert('Erro ao cancelar. Tente novamente.')
    }
  }

  function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  }

  function formatarHora(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <DashboardLayout titulo="Minhas consultas">
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-gray-400">Carregando consultas...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout titulo="Minhas consultas">

      {/* Botão agendar */}
      <div className="flex justify-end">
        <Link to="/paciente/agendar"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          + Nova consulta
        </Link>
      </div>

      {/* Próximas consultas */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">Próximas consultas</h2>
          <p className="text-xs text-gray-400 mt-0.5">{proximas.length} agendamento{proximas.length !== 1 ? 's' : ''}</p>
        </div>

        {proximas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-3">Nenhuma consulta agendada</p>
            <Link to="/paciente/agendar"
              className="text-sm font-medium text-indigo-600 hover:underline">
              Agendar agora →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {proximas.map(ag => {
              const status = STATUS_LABEL[ag.status] || STATUS_LABEL.PENDENTE
              return (
                <div key={ag.id} className="px-5 py-4 flex items-center gap-4">
                  {/* Data */}
                  <div className="w-12 flex-shrink-0 text-center">
                    <div className="text-lg font-semibold text-gray-900 leading-none">
                      {new Date(ag.dataHora).getDate()}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(ag.dataHora).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </div>
                  </div>

                  {/* Barra colorida */}
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${ag.status === 'CONFIRMADO' ? 'bg-indigo-500' : 'bg-amber-400'}`}/>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ag.profissional?.usuario?.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {TIPO_LABEL[ag.tipoSessao]} · {formatarHora(ag.dataHora)} · 50 min
                    </p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {formatarData(ag.dataHora)}
                    </p>
                  </div>

                  {/* Status + ações */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.cls}`}>
                      {status.label}
                    </span>
                    {['PENDENTE', 'CONFIRMADO'].includes(ag.status) && (
                      <button
                        onClick={() => handleCancelar(ag.id)}
                        disabled={cancelando}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Histórico */}
      {passadas.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">Histórico</h2>
              <p className="text-xs text-gray-400 mt-0.5">{passadas.length} sessão{passadas.length !== 1 ? 'ões' : ''}</p>
            </div>
            <Link to="/paciente/historico" className="text-xs text-indigo-600 hover:underline">
              Ver tudo →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {passadas.slice(0, 3).map(ag => {
              const status = STATUS_LABEL[ag.status]
              return (
                <div key={ag.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-12 flex-shrink-0 text-center">
                    <div className="text-lg font-semibold text-gray-400 leading-none">
                      {new Date(ag.dataHora).getDate()}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">
                      {new Date(ag.dataHora).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </div>
                  </div>
                  <div className="w-1 h-12 rounded-full flex-shrink-0 bg-gray-200"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">
                      {ag.profissional?.usuario?.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {TIPO_LABEL[ag.tipoSessao]} · {formatarHora(ag.dataHora)}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
