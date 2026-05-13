import React, { useState } from 'react'
import { useAgendamentos } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const METODO_LABEL = {
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO:  'Cartão de débito',
  PIX:            'PIX',
  CONVENIO:       'Convênio',
}

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function FinanceiroPage() {
  const { data: agendamentos = [], isLoading } = useAgendamentos()
  const hoje = new Date()
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())

  // Filtra agendamentos realizados do mês selecionado
  const doMes = agendamentos.filter(ag => {
    const d = new Date(ag.dataHora)
    return ag.status === 'REALIZADO' &&
           d.getMonth()    === mesSelecionado &&
           d.getFullYear() === anoSelecionado
  })

  const mesAnterior = agendamentos.filter(ag => {
    const d = new Date(ag.dataHora)
    const mesAnt = mesSelecionado === 0 ? 11 : mesSelecionado - 1
    const anoAnt = mesSelecionado === 0 ? anoSelecionado - 1 : anoSelecionado
    return ag.status === 'REALIZADO' &&
           d.getMonth()    === mesAnt &&
           d.getFullYear() === anoAnt
  })

  const valorSessao   = 180 // valor fixo por enquanto
  const receitaMes    = doMes.length * valorSessao
  const receitaAnt    = mesAnterior.length * valorSessao
  const variacao      = receitaAnt > 0 ? ((receitaMes - receitaAnt) / receitaAnt * 100).toFixed(0) : 0
  const taxaConfirm   = agendamentos.length > 0
    ? Math.round((agendamentos.filter(a => a.status !== 'CANCELADO').length / agendamentos.length) * 100)
    : 0

  // Navegação de mês
  function mesAnteriorNav() {
    if (mesSelecionado === 0) { setMesSelecionado(11); setAnoSelecionado(a => a - 1) }
    else setMesSelecionado(m => m - 1)
  }
  function mesProximoNav() {
    if (mesSelecionado === 11) { setMesSelecionado(0); setAnoSelecionado(a => a + 1) }
    else setMesSelecionado(m => m + 1)
  }

  // Gráfico de barras — últimos 6 meses
  const ultimos6 = Array.from({ length: 6 }, (_, i) => {
    let m = mesSelecionado - 5 + i
    let a = anoSelecionado
    while (m < 0) { m += 12; a-- }
    const sessoes = agendamentos.filter(ag => {
      const d = new Date(ag.dataHora)
      return ag.status === 'REALIZADO' && d.getMonth() === m && d.getFullYear() === a
    }).length
    return { mes: MESES[m].slice(0,3), sessoes, receita: sessoes * valorSessao, atual: m === mesSelecionado && a === anoSelecionado }
  })
  const maxSessoes = Math.max(...ultimos6.map(m => m.sessoes), 1)

  return (
    <DashboardLayout titulo="Financeiro">

      {/* Navegação de mês */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          {MESES[mesSelecionado]} {anoSelecionado}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={mesAnteriorNav}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            ‹
          </button>
          <button onClick={() => { setMesSelecionado(hoje.getMonth()); setAnoSelecionado(hoje.getFullYear()) }}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors
              ${mesSelecionado === hoje.getMonth() && anoSelecionado === hoje.getFullYear()
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            Mês atual
          </button>
          <button onClick={mesProximoNav}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
            ›
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Receita do mês</p>
          <p className="text-xl font-semibold text-gray-900">{formatarMoeda(receitaMes)}</p>
          <p className={`text-xs mt-1 ${Number(variacao) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {Number(variacao) >= 0 ? '↑' : '↓'} {Math.abs(variacao)}% vs mês anterior
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Sessões realizadas</p>
          <p className="text-xl font-semibold text-gray-900">{isLoading ? '...' : doMes.length}</p>
          <p className="text-xs text-gray-400 mt-1">neste mês</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Valor por sessão</p>
          <p className="text-xl font-semibold text-gray-900">{formatarMoeda(valorSessao)}</p>
          <p className="text-xs text-gray-400 mt-1">valor padrão</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Taxa de confirmação</p>
          <p className="text-xl font-semibold text-gray-900">{taxaConfirm}%</p>
          <p className={`text-xs mt-1 ${taxaConfirm >= 85 ? 'text-green-600' : 'text-amber-600'}`}>
            {taxaConfirm >= 85 ? '✓ Meta atingida' : 'Meta: 85%'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Gráfico de barras */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Sessões — últimos 6 meses</h2>
          </div>
          <div className="flex items-end gap-3 h-32">
            {ultimos6.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{m.sessoes}</span>
                <div className="w-full flex items-end" style={{ height: '80px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all ${m.atual ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                    style={{ height: `${(m.sessoes / maxSessoes) * 80}px`, minHeight: m.sessoes > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="text-xs text-gray-400">{m.mes}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>Total 6 meses: {ultimos6.reduce((a, m) => a + m.sessoes, 0)} sessões</span>
            <span>{formatarMoeda(ultimos6.reduce((a, m) => a + m.receita, 0))}</span>
          </div>
        </div>

        {/* Resumo do mês */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Resumo do mês</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Sessões realizadas</span>
              <span className="font-medium text-gray-900">{doMes.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Sessões canceladas</span>
              <span className="font-medium text-gray-900">
                {agendamentos.filter(ag => {
                  const d = new Date(ag.dataHora)
                  return ag.status === 'CANCELADO' &&
                         d.getMonth() === mesSelecionado &&
                         d.getFullYear() === anoSelecionado
                }).length}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Valor por sessão</span>
              <span className="font-medium text-gray-900">{formatarMoeda(valorSessao)}</span>
            </div>
            <div className="h-px bg-gray-100"/>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Total</span>
              <span className="font-semibold text-indigo-600">{formatarMoeda(receitaMes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de sessões do mês */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">
            Sessões de {MESES[mesSelecionado]}
          </h2>
          <span className="text-xs text-gray-400">{doMes.length} sessão{doMes.length !== 1 ? 'ões' : ''}</span>
        </div>

        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Carregando...</div>
        ) : doMes.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Nenhuma sessão realizada neste mês</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {doMes
              .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
              .map(ag => (
                <div key={ag.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="w-12 flex-shrink-0 text-center">
                    <p className="text-sm font-medium text-gray-900">{new Date(ag.dataHora).getDate()}</p>
                    <p className="text-xs text-gray-400">{MESES[new Date(ag.dataHora).getMonth()].slice(0,3)}</p>
                  </div>
                  <div className="w-1 h-10 rounded-full bg-green-400 flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ag.paciente?.usuario?.nome}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ag.tipoSessao?.replace(/_/g, ' ')} · {new Date(ag.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-green-600">
                      {formatarMoeda(valorSessao)}
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      Realizada
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}