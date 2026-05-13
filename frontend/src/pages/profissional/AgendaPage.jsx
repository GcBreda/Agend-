import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAgendamentos, useCancelarAgendamento } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const STATUS_LABEL = {
  PENDENTE:   { label: 'Pendente',   cls: 'bg-amber-50 text-amber-700',   bar: 'bg-amber-400' },
  CONFIRMADO: { label: 'Confirmada', cls: 'bg-indigo-50 text-indigo-700', bar: 'bg-indigo-500' },
  REALIZADO:  { label: 'Realizada',  cls: 'bg-green-50 text-green-700',   bar: 'bg-green-500' },
  CANCELADO:  { label: 'Cancelada',  cls: 'bg-red-50 text-red-600',       bar: 'bg-red-400' },
}

const TIPO_LABEL = {
  AVALIACAO_INICIAL: 'Avaliação inicial',
  ACOMPANHAMENTO:    'Acompanhamento',
  TCC:               'TCC',
  PSICANALISE:       'Psicanálise',
}

export default function AgendaPage() {
  const { data: agendamentos = [], isLoading } = useAgendamentos()
  const { mutateAsync: cancelar, isPending: cancelando } = useCancelarAgendamento()

  const hoje     = new Date()
  const [semana, setSemana] = useState(0) // 0 = semana atual, 1 = próxima, -1 = anterior

  // Calcula os 7 dias da semana selecionada
  function getDiasSemana() {
    const inicio = new Date(hoje)
    inicio.setDate(hoje.getDate() - hoje.getDay() + semana * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      return d
    })
  }

  const dias = getDiasSemana()
  const inicioSemana = dias[0]
  const fimSemana    = dias[6]

  function formatarSemana() {
    if (inicioSemana.getMonth() === fimSemana.getMonth()) {
      return `${inicioSemana.getDate()} a ${fimSemana.getDate()} de ${MESES[fimSemana.getMonth()]} ${fimSemana.getFullYear()}`
    }
    return `${inicioSemana.getDate()} de ${MESES[inicioSemana.getMonth()]} a ${fimSemana.getDate()} de ${MESES[fimSemana.getMonth()]}`
  }

  function formatarHora(iso) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  function mesmodia(d1, d2) {
    return d1.getDate()     === d2.getDate() &&
           d1.getMonth()    === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear()
  }

  function agendamentosDoDia(dia) {
    return agendamentos
      .filter(ag => mesmodia(new Date(ag.dataHora), dia))
      .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
  }

  async function handleCancelar(id) {
    if (!window.confirm('Deseja cancelar esta consulta?')) return
    try { await cancelar(id) }
    catch { alert('Erro ao cancelar. Tente novamente.') }
  }

  const totalSemana = dias.reduce((acc, d) => acc + agendamentosDoDia(d).length, 0)

  return (
    <DashboardLayout titulo="Agenda">

      {/* Cabeçalho navegação */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-900">{formatarSemana()}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{totalSemana} consulta{totalSemana !== 1 ? 's' : ''} esta semana</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSemana(s => s - 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            ‹
          </button>
          <button onClick={() => setSemana(0)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${semana === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            Hoje
          </button>
          <button onClick={() => setSemana(s => s + 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            ›
          </button>
        </div>
      </div>

      {/* Grade semanal */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia, i) => {
          const isHoje      = mesmodia(dia, hoje)
          const agsDoDia    = agendamentosDoDia(dia)
          const isPassado   = dia < hoje && !isHoje

          return (
            <div key={i} className={`bg-white border rounded-xl overflow-hidden ${isHoje ? 'border-indigo-400' : 'border-gray-200'}`}>
              {/* Cabeçalho do dia */}
              <div className={`px-2 py-2 text-center border-b ${isHoje ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-50 border-gray-100'}`}>
                <p className={`text-xs font-medium ${isHoje ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {DIAS_SEMANA[dia.getDay()]}
                </p>
                <p className={`text-lg font-semibold leading-tight ${isHoje ? 'text-white' : isPassado ? 'text-gray-300' : 'text-gray-900'}`}>
                  {dia.getDate()}
                </p>
              </div>

              {/* Agendamentos do dia */}
              <div className="p-1.5 min-h-[80px]">
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse"/>
                ) : agsDoDia.length === 0 ? (
                  <p className="text-xs text-center text-gray-200 mt-4">—</p>
                ) : (
                  <div className="space-y-1">
                    {agsDoDia.map(ag => {
                      const status = STATUS_LABEL[ag.status] || STATUS_LABEL.PENDENTE
                      return (
                        <div key={ag.id}
                          className={`rounded-lg px-1.5 py-1 text-xs ${status.cls} border border-current border-opacity-20`}>
                          <p className="font-medium truncate">
                            {formatarHora(ag.dataHora)}
                          </p>
                          <p className="truncate opacity-80">
                            {ag.paciente?.usuario?.nome?.split(' ')[0]}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista detalhada da semana */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900">Detalhes da semana</h2>
        </div>

        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Carregando...</div>
        ) : totalSemana === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Nenhuma consulta nesta semana</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {dias.map(dia => {
              const agsDoDia = agendamentosDoDia(dia)
              if (agsDoDia.length === 0) return null
              return (
                <div key={dia.toISOString()}>
                  {/* Cabeçalho do dia na lista */}
                  <div className="px-5 py-2 bg-gray-50 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      {DIAS_SEMANA[dia.getDay()]}, {dia.getDate()} de {MESES[dia.getMonth()]}
                    </span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{agsDoDia.length} consulta{agsDoDia.length !== 1 ? 's' : ''}</span>
                  </div>

                  {agsDoDia.map(ag => {
                    const status = STATUS_LABEL[ag.status] || STATUS_LABEL.PENDENTE
                    return (
                      <div key={ag.id} className="px-5 py-3.5 flex items-center gap-4">
                        <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
                          {formatarHora(ag.dataHora)}
                        </span>
                        <div className={`w-1 h-10 rounded-full flex-shrink-0 ${status.bar}`}/>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {ag.paciente?.usuario?.nome}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {TIPO_LABEL[ag.tipoSessao]} · 50 min
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.cls}`}>
                            {status.label}
                          </span>
                          {['PENDENTE','CONFIRMADO'].includes(ag.status) && (
                            <button onClick={() => handleCancelar(ag.id)} disabled={cancelando}
                              className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50">
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}