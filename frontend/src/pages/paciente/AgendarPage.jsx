import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { profissionalService } from '../../services/api'
import { useHorariosDisponiveis, useCriarAgendamento } from '../../hooks/useAgendamentos'
import DashboardLayout from '../../components/layout/DashboardLayout'

const TIPOS_SESSAO = [
  { value: 'AVALIACAO_INICIAL', label: 'Avaliação inicial' },
  { value: 'ACOMPANHAMENTO',    label: 'Acompanhamento' },
  { value: 'TCC',               label: 'Terapia cognitivo-comportamental' },
  { value: 'PSICANALISE',       label: 'Psicanálise' }
]

export default function AgendarPage() {
  const navigate = useNavigate()
  const [etapa,        setEtapa]        = useState(1)
  const [profissional, setProfissional] = useState(null)
  const [data,         setData]         = useState('')
  const [horario,      setHorario]      = useState('')
  const [tipoSessao,   setTipoSessao]   = useState('ACOMPANHAMENTO')
  const [erro,         setErro]         = useState('')
  const [sucesso,      setSucesso]      = useState(false)

  const { data: profissionais = [], isLoading: loadingProf } = useQuery({
    queryKey: ['profissionais'],
    queryFn: async () => {
      const { data } = await profissionalService.listar()
      return data.profissionais
    }
  })

  const { data: horarios = [], isLoading: loadingHorarios } = useHorariosDisponiveis(profissional?.id, data)
  const { mutateAsync: criarAgendamento, isPending } = useCriarAgendamento()

  async function confirmar() {
    setErro('')
    try {
      await criarAgendamento({ profissionalId: profissional.id, dataHora: `${data}T${horario}:00`, tipoSessao })
      setSucesso(true)
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao criar agendamento.')
    }
  }

  if (sucesso) {
    return (
      <DashboardLayout titulo="Agendar consulta">
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Consulta agendada!</h2>
          <p className="text-sm text-gray-500 text-center max-w-xs">Você receberá um e-mail de confirmação e lembretes automáticos antes da sessão.</p>
          <button onClick={() => navigate('/paciente/consultas')}
            className="mt-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Ver minhas consultas
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout titulo="Agendar consulta">
      <div className="flex items-center gap-2">
        {[1,2,3].map(n => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0
              ${n <= etapa ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {n < etapa ? '✓' : n}
            </div>
            <span className={`text-xs ${n === etapa ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
              {n === 1 ? 'Profissional' : n === 2 ? 'Horário' : 'Confirmação'}
            </span>
            {n < 3 && <div className={`flex-1 h-px ${n < etapa ? 'bg-indigo-300' : 'bg-gray-200'}`}/>}
          </div>
        ))}
      </div>

      {etapa === 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Escolha o profissional</h2>
          {loadingProf ? <p className="text-sm text-gray-400">Carregando...</p> : (
            <div className="space-y-3">
              {profissionais.map(p => (
                <div key={p.id} onClick={() => setProfissional(p)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${profissional?.id === p.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-sm font-medium flex items-center justify-center flex-shrink-0">
                      {p.usuario?.nome?.split(' ').slice(0,2).map(n=>n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{p.usuario?.nome}</p>
                      <p className="text-xs text-gray-400">{p.especialidade?.replace(/_/g,' ')} · CRP {p.crp}</p>
                    </div>
                    <p className="text-sm font-medium text-indigo-600">R$ {Number(p.valorSessao).toFixed(0)}/sessão</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button disabled={!profissional} onClick={() => setEtapa(2)}
            className="mt-5 w-full py-2.5 bg-indigo-600 disabled:opacity-40 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Continuar →
          </button>
        </div>
      )}

      {etapa === 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Escolha a data e o horário</h2>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
            <input type="date" value={data} min={new Date().toISOString().split('T')[0]}
              onChange={e => { setData(e.target.value); setHorario('') }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
          </div>
          {data && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-2">Horários disponíveis</label>
              {loadingHorarios ? <p className="text-xs text-gray-400">Buscando horários...</p> :
               horarios.length === 0 ? <p className="text-xs text-gray-400">Nenhum horário disponível nesta data.</p> : (
                <div className="grid grid-cols-4 gap-2">
                  {horarios.map(h => (
                    <button key={h.hora} disabled={!h.disponivel} onClick={() => setHorario(h.hora)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all
                        ${!h.disponivel ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through' :
                          horario === h.hora ? 'bg-indigo-600 text-white' :
                          'bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'}`}>
                      {h.hora}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de sessão</label>
            <select value={tipoSessao} onChange={e => setTipoSessao(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              {TIPOS_SESSAO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEtapa(1)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">← Voltar</button>
            <button disabled={!data || !horario} onClick={() => setEtapa(3)}
              className="flex-[2] py-2.5 bg-indigo-600 disabled:opacity-40 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
              Continuar →
            </button>
          </div>
        </div>
      )}

      {etapa === 3 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Confirmar agendamento</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-2">
            <div className="flex justify-between text-xs"><span className="text-gray-500">Profissional</span><span className="font-medium">{profissional?.usuario?.nome}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Data</span><span className="font-medium">{new Date(data+'T00:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Horário</span><span className="font-medium">{horario} · 50 min</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-500">Sessão</span><span className="font-medium">{TIPOS_SESSAO.find(t=>t.value===tipoSessao)?.label}</span></div>
            <div className="flex justify-between text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-indigo-600 font-semibold text-sm">R$ {Number(profissional?.valorSessao).toFixed(2)}</span>
            </div>
          </div>
          {erro && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700 mb-4">{erro}</div>}
          <div className="flex gap-2">
            <button onClick={() => setEtapa(2)} className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50">← Voltar</button>
            <button onClick={confirmar} disabled={isPending}
              className="flex-[2] py-2.5 bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
              {isPending ? 'Confirmando...' : 'Confirmar →'}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}