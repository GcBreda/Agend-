import React, { useState } from 'react'
import { useAgendamentos } from '../../hooks/useAgendamentos'
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

function iniciais(nome) {
  return nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ── Modal de detalhes do paciente ────────────────────────────
function ModalPaciente({ paciente, agendamentos, onClose }) {
  const sessoes = agendamentos
    .filter(ag => ag.pacienteId === paciente.id)
    .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))

  const realizadas  = sessoes.filter(a => a.status === 'REALIZADO').length
  const canceladas  = sessoes.filter(a => a.status === 'CANCELADO').length
  const proxima     = sessoes.find(a => ['PENDENTE', 'CONFIRMADO'].includes(a.status))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col">

        {/* Cabeçalho */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 text-lg font-medium flex items-center justify-center flex-shrink-0">
            {iniciais(paciente.nome)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-gray-900">{paciente.nome}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{paciente.email}</p>
            <div className="flex gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                paciente.status === 'novo' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
              }`}>
                {paciente.status === 'novo' ? 'Novo' : 'Ativo'}
              </span>
              {paciente.planoSaude && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {paciente.planoSaude}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg flex-shrink-0">✕</button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-gray-100">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{sessoes.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">{realizadas}</p>
            <p className="text-xs text-gray-400">Realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-red-500">{canceladas}</p>
            <p className="text-xs text-gray-400">Canceladas</p>
          </div>
        </div>

        {/* Próxima consulta */}
        {proxima && (
          <div className="mx-6 mt-4 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
            <p className="text-xs font-medium text-indigo-700 mb-1">Próxima consulta</p>
            <p className="text-xs text-indigo-600">
              {formatarData(proxima.dataHora)} às {formatarHora(proxima.dataHora)} · {TIPO_LABEL[proxima.tipoSessao]}
            </p>
          </div>
        )}

        {/* Histórico de sessões */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-xs font-medium text-gray-500 mb-3">Histórico de sessões</h3>
          {sessoes.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhuma sessão registrada</p>
          ) : (
            <div className="space-y-2">
              {sessoes.map(ag => (
                <div key={ag.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-10 text-center flex-shrink-0">
                    <p className="text-xs font-medium text-gray-900">{new Date(ag.dataHora).getDate()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ag.dataHora).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </p>
                  </div>
                  <div className={`w-1 h-8 rounded-full flex-shrink-0 ${
                    ag.status === 'REALIZADO'  ? 'bg-green-400' :
                    ag.status === 'CONFIRMADO' ? 'bg-indigo-400' :
                    ag.status === 'CANCELADO'  ? 'bg-red-300' : 'bg-amber-400'
                  }`}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800">{TIPO_LABEL[ag.tipoSessao]}</p>
                    <p className="text-xs text-gray-400">{formatarHora(ag.dataHora)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    ag.status === 'REALIZADO'  ? 'bg-green-50 text-green-700' :
                    ag.status === 'CONFIRMADO' ? 'bg-indigo-50 text-indigo-700' :
                    ag.status === 'CANCELADO'  ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {ag.status === 'REALIZADO' ? 'Realizada' :
                     ag.status === 'CONFIRMADO' ? 'Confirmada' :
                     ag.status === 'CANCELADO' ? 'Cancelada' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
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
export default function PacientesPage() {
  const { data: agendamentos = [], isLoading } = useAgendamentos()
  const [busca,              setBusca]              = useState('')
  const [pacienteModal,      setPacienteModal]      = useState(null)
  const [filtroStatus,       setFiltroStatus]       = useState('todos')

  // Monta lista de pacientes únicos
  const pacientes = Object.values(
    agendamentos.reduce((acc, ag) => {
      const id = ag.pacienteId
      if (!acc[id]) {
        acc[id] = {
          id,
          nome:        ag.paciente?.usuario?.nome || 'Paciente',
          email:       ag.paciente?.usuario?.email || '',
          planoSaude:  ag.paciente?.planoSaude || null,
          sessoes:     0,
          realizadas:  0,
          proxima:     null,
          ultimaSessao: null,
          status:      'ativo',
        }
      }
      acc[id].sessoes++
      if (ag.status === 'REALIZADO') acc[id].realizadas++

      const data = new Date(ag.dataHora)
      if (!acc[id].ultimaSessao || data > acc[id].ultimaSessao) {
        acc[id].ultimaSessao = data
      }
      if (['PENDENTE','CONFIRMADO'].includes(ag.status)) {
        if (!acc[id].proxima || data < new Date(acc[id].proxima)) {
          acc[id].proxima = ag.dataHora
        }
      }

      // Novo = apenas 1 sessão
      acc[id].status = acc[id].realizadas <= 1 ? 'novo' : 'ativo'
      return acc
    }, {})
  )

  const pacientesFiltrados = pacientes
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                 p.email.toLowerCase().includes(busca.toLowerCase()))
    .filter(p => filtroStatus === 'todos' || p.status === filtroStatus)
    .sort((a, b) => a.nome.localeCompare(b.nome))

  const totalAtivos = pacientes.filter(p => p.status === 'ativo').length
  const totalNovos  = pacientes.filter(p => p.status === 'novo').length

  return (
    <DashboardLayout titulo="Pacientes">

      {pacienteModal && (
        <ModalPaciente
          paciente={pacienteModal}
          agendamentos={agendamentos}
          onClose={() => setPacienteModal(null)}
        />
      )}

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total de pacientes</p>
          <p className="text-2xl font-semibold text-gray-900">{isLoading ? '...' : pacientes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Ativos</p>
          <p className="text-2xl font-semibold text-green-600">{isLoading ? '...' : totalAtivos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Novos</p>
          <p className="text-2xl font-semibold text-amber-600">{isLoading ? '...' : totalNovos}</p>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex items-center gap-3">
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'ativo', label: 'Ativos' },
            { id: 'novo',  label: 'Novos' },
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

      {/* Lista de pacientes */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 grid grid-cols-12 gap-4">
          <span className="col-span-4 text-xs font-medium text-gray-400">Paciente</span>
          <span className="col-span-2 text-xs font-medium text-gray-400 text-center">Sessões</span>
          <span className="col-span-3 text-xs font-medium text-gray-400">Próxima consulta</span>
          <span className="col-span-2 text-xs font-medium text-gray-400">Status</span>
          <span className="col-span-1 text-xs font-medium text-gray-400"></span>
        </div>

        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">Carregando...</div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Nenhum paciente encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pacientesFiltrados.map(p => (
              <div key={p.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">

                {/* Nome */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {iniciais(p.nome)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.nome}</p>
                    <p className="text-xs text-gray-400 truncate">{p.email}</p>
                  </div>
                </div>

                {/* Sessões */}
                <div className="col-span-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{p.sessoes}</p>
                  <p className="text-xs text-gray-400">{p.realizadas} realizadas</p>
                </div>

                {/* Próxima */}
                <div className="col-span-3">
                  {p.proxima ? (
                    <>
                      <p className="text-xs font-medium text-gray-800">{formatarData(p.proxima)}</p>
                      <p className="text-xs text-gray-400">{formatarHora(p.proxima)}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-300">—</p>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    p.status === 'novo' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {p.status === 'novo' ? 'Novo' : 'Ativo'}
                  </span>
                </div>

                {/* Ação */}
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => setPacienteModal(p)}
                    className="text-xs text-indigo-600 border border-indigo-200 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}