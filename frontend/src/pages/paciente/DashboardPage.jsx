import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAgendamentos } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function PacienteDashboard() {
  const { usuario } = useAuth()
  const { data: agendamentos = [], isLoading } = useAgendamentos()

  const proximas  = agendamentos.filter(a => ['PENDENTE','CONFIRMADO'].includes(a.status))
  const proxima   = proximas.sort((a,b) => new Date(a.dataHora) - new Date(b.dataHora))[0]
  const realizadas = agendamentos.filter(a => a.status === 'REALIZADO').length

  function formatarData(iso) {
    return new Date(iso).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
  }

  function diasAte(iso) {
    return Math.ceil((new Date(iso) - new Date()) / (1000*60*60*24))
  }

  return (
    <DashboardLayout titulo="Início">
      {proxima && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-800">Bom dia, {usuario.nome.split(' ')[0]}!</p>
            <p className="text-xs text-indigo-600 mt-0.5">
              Próxima consulta em <strong>{diasAte(proxima.dataHora)} dias</strong> — {formatarData(proxima.dataHora)} com {proxima.profissional?.usuario?.nome}
            </p>
          </div>
          <Link to="/paciente/consultas" className="text-xs font-medium text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-200">
            Ver detalhes
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Próxima consulta</p>
          <p className="text-xl font-medium text-gray-900">
            {proxima ? new Date(proxima.dataHora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}) : '—'}
          </p>
          {proxima && <p className="text-xs text-indigo-600 mt-0.5">Em {diasAte(proxima.dataHora)} dias</p>}
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Consultas realizadas</p>
          <p className="text-xl font-medium text-gray-900">{isLoading ? '...' : realizadas}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Agendadas</p>
          <p className="text-xl font-medium text-gray-900">{isLoading ? '...' : proximas.length}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Próximas consultas</h2>
          <Link to="/paciente/consultas" className="text-xs text-indigo-600 hover:underline">Ver todas</Link>
        </div>
        {isLoading ? <p className="text-sm text-gray-400">Carregando...</p> :
         proximas.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-3">Nenhuma consulta agendada</p>
            <Link to="/paciente/agendar" className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
              Agendar agora
            </Link>
          </div>
        ) : proximas.slice(0,3).map(ag => (
          <div key={ag.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400 w-10 text-right flex-shrink-0">
              {new Date(ag.dataHora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}
            </span>
            <div className="w-0.5 h-9 rounded-full bg-indigo-500 flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{ag.profissional?.usuario?.nome}</p>
              <p className="text-xs text-gray-400">{new Date(ag.dataHora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})} · {ag.tipoSessao?.replace(/_/g,' ')}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${ag.status === 'CONFIRMADO' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
              {ag.status === 'CONFIRMADO' ? 'Confirmada' : 'Pendente'}
            </span>
          </div>
        ))}
      </div>

      <Link to="/paciente/agendar"
        className="block w-full text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
        + Agendar nova consulta
      </Link>
    </DashboardLayout>
  )
}
