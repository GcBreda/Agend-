import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAgendamentos } from '../../hooks/useAgendamentos'
import { prontuarioService } from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout'

const TIPO_LABEL = {
  AVALIACAO_INICIAL: 'Avaliação inicial',
  ACOMPANHAMENTO:    'Acompanhamento',
  TCC:               'TCC',
  PSICANALISE:       'Psicanálise',
}

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ── Modal de nova anotação ───────────────────────────────────
function ModalAnotacao({ agendamento, onClose, onSalvar }) {
  const [form, setForm] = useState({ anotacoes: '', cid: '', lembretes: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSalvar() {
    if (!form.anotacoes.trim()) { setErro('As anotações são obrigatórias.'); return }
    setSalvando(true)
    setErro('')
    try {
      await onSalvar({ agendamentoId: agendamento.id, ...form })
      onClose()
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar prontuário.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Nova anotação</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {agendamento.paciente?.usuario?.nome} · {formatarData(agendamento.dataHora)} · {formatarHora(agendamento.dataHora)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 mb-4">{erro}</div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Anotações da sessão *</label>
            <textarea
              value={form.anotacoes}
              onChange={e => setForm(f => ({ ...f, anotacoes: e.target.value }))}
              rows={5}
              placeholder="Descreva os principais pontos abordados na sessão..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">CID (opcional)</label>
              <input
                value={form.cid}
                onChange={e => setForm(f => ({ ...f, cid: e.target.value }))}
                placeholder="Ex: F41.1"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Lembrete (opcional)</label>
              <input
                value={form.lembretes}
                onChange={e => setForm(f => ({ ...f, lembretes: e.target.value }))}
                placeholder="Ex: Revisar técnica de respiração"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSalvar} disabled={salvando}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {salvando ? 'Salvando...' : 'Salvar anotação'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────
export default function ProntuariosPage() {
  const queryClient = useQueryClient()
  const { data: agendamentos = [], isLoading } = useAgendamentos()

  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)
  const [agendamentoModal,    setAgendamentoModal]    = useState(null)
  const [busca,               setBusca]               = useState('')

  // Lista de pacientes únicos extraída dos agendamentos
  const pacientes = Object.values(
    agendamentos.reduce((acc, ag) => {
      const id = ag.pacienteId
      if (!acc[id]) {
        acc[id] = {
          id,
          nome:      ag.paciente?.usuario?.nome || 'Paciente',
          email:     ag.paciente?.usuario?.email || '',
          sessoes:   0,
          ultimaSessao: null,
        }
      }
      acc[id].sessoes++
      const data = new Date(ag.dataHora)
      if (!acc[id].ultimaSessao || data > acc[id].ultimaSessao) {
        acc[id].ultimaSessao = data
      }
      return acc
    }, {})
  ).filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))

  // Prontuários do paciente selecionado
  const { data: prontuarios = [], isLoading: loadingPront } = useQuery({
    queryKey: ['prontuarios', pacienteSelecionado?.id],
    queryFn: async () => {
      const { data } = await prontuarioService.listarPorPaciente(pacienteSelecionado.id)
      return data.prontuarios
    },
    enabled: !!pacienteSelecionado
  })

  // Agendamentos realizados sem prontuário do paciente selecionado
  const semProntuario = pacienteSelecionado
    ? agendamentos.filter(ag =>
        ag.pacienteId === pacienteSelecionado.id &&
        ag.status === 'REALIZADO' &&
        !prontuarios.find(p => p.agendamentoId === ag.id)
      )
    : []

  const { mutateAsync: criarProntuario } = useMutation({
    mutationFn: (dados) => prontuarioService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prontuarios', pacienteSelecionado?.id] })
    }
  })

  const iniciais = (nome) => nome?.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase()

  return (
    <DashboardLayout titulo="Prontuários">

      {agendamentoModal && (
        <ModalAnotacao
          agendamento={agendamentoModal}
          onClose={() => setAgendamentoModal(null)}
          onSalvar={criarProntuario}
        />
      )}

      <div className="flex gap-5 h-full">

        {/* Lista de pacientes */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Pacientes</h2>
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {isLoading ? (
              <p className="text-xs text-gray-400 px-4 py-4">Carregando...</p>
            ) : pacientes.length === 0 ? (
              <p className="text-xs text-gray-400 px-4 py-4">Nenhum paciente encontrado</p>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {pacientes.map(p => (
                  <button key={p.id} onClick={() => setPacienteSelecionado(p)}
                    className={`w-full px-4 py-3 flex items-center gap-2.5 text-left transition-colors
                      ${pacienteSelecionado?.id === p.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
                      ${pacienteSelecionado?.id === p.id ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                      {iniciais(p.nome)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${pacienteSelecionado?.id === p.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {p.nome}
                      </p>
                      <p className="text-xs text-gray-400">{p.sessoes} sessão{p.sessoes !== 1 ? 'ões' : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prontuário do paciente */}
        <div className="flex-1 min-w-0">
          {!pacienteSelecionado ? (
            <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-sm text-gray-400">Selecione um paciente para ver o prontuário</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cabeçalho do paciente */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 text-base font-medium flex items-center justify-center flex-shrink-0">
                    {iniciais(pacienteSelecionado.nome)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-gray-900">{pacienteSelecionado.nome}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {pacienteSelecionado.sessoes} sessões · última em{' '}
                      {pacienteSelecionado.ultimaSessao ? formatarData(pacienteSelecionado.ultimaSessao) : '—'}
                    </p>
                  </div>
                  {semProntuario.length > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-amber-600 mb-1">{semProntuario.length} sessão sem anotação</p>
                      <button onClick={() => setAgendamentoModal(semProntuario[0])}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                        + Nova anotação
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Anotações */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">Anotações de sessão</h2>
                  <span className="text-xs text-gray-400">{prontuarios.length} registro{prontuarios.length !== 1 ? 's' : ''}</span>
                </div>

                {loadingPront ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">Carregando...</div>
                ) : prontuarios.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-gray-400 mb-3">Nenhuma anotação registrada</p>
                    {semProntuario.length > 0 && (
                      <button onClick={() => setAgendamentoModal(semProntuario[0])}
                        className="text-sm text-indigo-600 hover:underline">
                        Criar primeira anotação →
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {prontuarios.map((pront, i) => (
                      <div key={pront.id} className="px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                              Sessão {prontuarios.length - i} · {formatarData(pront.criadoEm)}
                            </span>
                            {pront.cid && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                CID: {pront.cid}
                              </span>
                            )}
                          </div>
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            Registrado
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {pront.anotacoes}
                        </p>

                        {pront.lembretes && (
                          <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2">
                            <span className="text-indigo-500">🔔</span>
                            <p className="text-xs text-indigo-700">{pront.lembretes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}