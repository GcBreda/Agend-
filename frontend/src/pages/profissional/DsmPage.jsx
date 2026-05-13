import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const SECOES = [
  {
    id: 'estrutural',
    categoria: 'Mudanças Estruturais Importantes',
    cor: 'indigo',
    icone: '🏗️',
    itens: [
      {
        titulo: 'Fim do Sistema Multiaxial',
        conteudo: 'O DSM-5 eliminou os 5 eixos (Eixo I, II, III, IV, V). Agora, todos os transtornos mentais, de personalidade e condições médicas estão listados em uma única seção, visando integrar melhor os diagnósticos.',
        destaque: 'Os 5 eixos foram unificados em uma única lista diagnóstica.'
      },
      {
        titulo: 'Abordagem Dimensional',
        conteudo: 'O manual passou a focar mais na gravidade dos sintomas como um continuum, ao invés de apenas uma categorização "sim/não". Os sintomas são avaliados em três níveis de gravidade.',
        destaque: null,
        niveis: ['Leve', 'Moderado', 'Grave']
      },
      {
        titulo: 'Organização por Ciclo de Vida',
        conteudo: 'A estrutura segue a ordem do desenvolvimento humano, começando com transtornos neurodesenvolvimentais (infância) até transtornos neurocognitivos (idade avançada).',
        destaque: 'Do nascimento ao envelhecimento — uma organização que reflete o desenvolvimento humano.'
      },
    ]
  },
  {
    id: 'diagnosticas',
    categoria: 'Principais Alterações Diagnósticas',
    cor: 'green',
    icone: '🔄',
    itens: [
      {
        titulo: 'Transtorno do Espectro Autista (TEA)',
        conteudo: 'O DSM-5 unificou os diagnósticos anteriormente separados em um único diagnóstico: Transtorno do Espectro Autista, com níveis de gravidade baseados na necessidade de suporte.',
        destaque: null,
        unificou: ['Autismo', 'Síndrome de Asperger', 'TGD sem outra especificação'],
        tag: 'UNIFICAÇÃO'
      },
      {
        titulo: 'TDAH — Alteração de Critério',
        conteudo: 'A idade limite para o início dos sintomas foi alterada de 7 para 12 anos, facilitando o diagnóstico em adultos e adolescentes. Alguns sintomas devem estar presentes antes dos 12 anos.',
        destaque: 'Idade de início: de 7 anos (DSM-IV) para 12 anos (DSM-5).',
        tag: 'MODIFICAÇÃO'
      },
      {
        titulo: 'Transtorno de Luto Prolongado',
        conteudo: 'Incluído no DSM-5-TR, define luto intenso que persiste por mais de 12 meses após a perda em adultos, ou 6 meses para crianças e adolescentes.',
        destaque: 'Adultos: +12 meses | Crianças: +6 meses',
        tag: 'NOVO NO TR'
      },
      {
        titulo: 'Transtornos de Humor — Especificador Misto',
        conteudo: 'O termo "transtorno misto" foi substituído por um especificador "com características mistas", aplicável tanto a episódios de mania quanto de depressão, permitindo maior precisão diagnóstica.',
        destaque: '"Transtorno misto" → "Com características mistas" (especificador)',
        tag: 'MODIFICAÇÃO'
      },
      {
        titulo: 'Transtorno de Disforia de Gênero',
        conteudo: 'Substituiu o antigo "Transtorno da Identidade de Gênero", focando no sofrimento (disforia) causado pela incongruência de gênero e não na identidade em si, reduzindo o estigma diagnóstico.',
        destaque: '"Transtorno da Identidade de Gênero" → "Transtorno de Disforia de Gênero"',
        tag: 'RENOMEAÇÃO'
      },
    ]
  },
  {
    id: 'tr',
    categoria: 'Diferenciais do DSM-5-TR (Revisão de Texto)',
    cor: 'amber',
    icone: '📝',
    itens: [
      {
        titulo: 'Atualizações de Texto',
        conteudo: 'Revisão completa dos textos descritivos de quase todos os transtornos com base em pesquisas recentes, incorporando evidências científicas atualizadas sobre prevalência, fatores de risco e tratamentos.',
        destaque: 'Quase todos os transtornos tiveram seus textos revisados.'
      },
      {
        titulo: 'Foco no Preconceito e Discriminação',
        conteudo: 'O DSM-5-TR incluiu estudos e análises sobre o impacto do racismo e discriminação na manifestação dos transtornos mentais, reconhecendo fatores socioculturais no adoecimento psíquico.',
        destaque: 'Primeiro manual a incluir explicitamente o impacto do racismo na saúde mental.'
      },
      {
        titulo: 'Atualizações de Terminologia',
        conteudo: 'Mudanças terminológicas visando maior precisão clínica e redução do estigma. As substituições refletem o entendimento científico atual sobre as condições.',
        destaque: null,
        terminologia: [
          { de: 'Deficiência Intelectual', para: 'Transtorno do Desenvolvimento Intelectual' },
          { de: 'Transtorno de Conversão', para: 'Transtorno de Sintomas Neurológicos Funcionais' },
        ]
      },
    ]
  },
  {
    id: 'uso',
    categoria: 'Como Usar o DSM-5',
    cor: 'purple',
    icone: '🧭',
    itens: [
      {
        titulo: 'Diagnóstico Diferencial',
        conteudo: 'O manual possui uma seção específica para ajudar a distinguir transtornos com sintomas semelhantes. O diagnóstico diferencial é essencial para evitar diagnósticos equivocados e garantir o tratamento adequado.',
        destaque: 'Use sempre a seção de diagnóstico diferencial antes de fechar o diagnóstico.'
      },
      {
        titulo: 'Critérios Clínicos e Julgamento Profissional',
        conteudo: 'O diagnóstico exige o cumprimento de critérios explícitos, mas o uso clínico exige julgamento profissional. O DSM-5 não deve ser usado como um "check-list" automático — o contexto clínico do paciente é sempre fundamental.',
        destaque: 'Critérios + julgamento clínico = diagnóstico responsável.'
      },
      {
        titulo: 'Avaliação de Personalidade — Modelo Alternativo',
        conteudo: 'O DSM-5 introduziu um modelo alternativo (dimensional) para transtornos de personalidade na Seção III, voltado para estudos futuros. Foca em traços desadaptativos e no funcionamento da personalidade, complementando o modelo categórico tradicional.',
        destaque: 'Seção III: modelo dimensional para pesquisa e uso clínico avançado.'
      },
    ]
  },
]

const COR = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', header: 'bg-indigo-600' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  header: 'bg-green-600' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  header: 'bg-amber-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', header: 'bg-purple-600' },
}

const TAG_COR = {
  'NOVO NO TR':   'bg-green-100 text-green-700',
  'MODIFICAÇÃO':  'bg-amber-100 text-amber-700',
  'UNIFICAÇÃO':   'bg-blue-100 text-blue-700',
  'RENOMEAÇÃO':   'bg-purple-100 text-purple-700',
}

function DsmPage() {
  const [busca, setBusca] = useState('')
  const [secaoAberta, setSecaoAberta] = useState(null)
  const [itemAberto, setItemAberto] = useState(null)

  const resultados = SECOES.map(function(secao) {
    return {
      ...secao,
      itens: secao.itens.filter(function(item) {
        if (!busca) return true
        const termo = busca.toLowerCase()
        return item.titulo.toLowerCase().includes(termo) ||
               item.conteudo.toLowerCase().includes(termo) ||
               (item.destaque && item.destaque.toLowerCase().includes(termo))
      })
    }
  }).filter(function(s) {
    return !busca || s.itens.length > 0
  })

  const totalItens = SECOES.reduce(function(acc, s) { return acc + s.itens.length }, 0)
  const totalResultados = resultados.reduce(function(acc, s) { return acc + s.itens.length }, 0)

  function toggleSecao(id) {
    setSecaoAberta(secaoAberta === id ? null : id)
    setItemAberto(null)
  }

  function toggleItem(key) {
    setItemAberto(itemAberto === key ? null : key)
  }

  return (
    <DashboardLayout titulo="DSM-5 — Manual Diagnóstico">

      <div className="bg-indigo-600 rounded-xl px-6 py-5 flex items-start justify-between">
        <div>
          <h2 className="text-base font-medium text-white mb-1">
            DSM-5 — Manual Diagnóstico e Estatístico de Transtornos Mentais
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed mb-3">
            5ª Edição — American Psychiatric Association (APA) · Inclui atualizações do DSM-5-TR
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-lg font-medium text-white">{SECOES.length}</p>
              <p className="text-xs text-indigo-200">Seções</p>
            </div>
            <div>
              <p className="text-lg font-medium text-white">{totalItens}</p>
              <p className="text-xs text-indigo-200">Tópicos</p>
            </div>
          </div>
        </div>
<div className="flex flex-col gap-2 flex-shrink-0">
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-white font-medium">DSM-5</p>
            <p className="text-xs text-indigo-200">2013</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-white font-medium">DSM-5-TR</p>
            <p className="text-xs text-indigo-200">2022</p>
          </div>
          <a href="https://membros.analysispsicologia.com.br/wp-content/uploads/2024/06/DSM-V.pdf" target="_blank" rel="noreferrer" className="bg-white text-indigo-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 text-center">
            DSM-5 completo
          </a>
        </div>
    </div>
      <div className="grid grid-cols-4 gap-3">
        {SECOES.map(function(s) {
          const c = COR[s.cor]
          return (
            <button
              key={s.id}
              onClick={function() { toggleSecao(s.id) }}
              className={`${c.bg} ${c.border} border rounded-xl p-4 text-left transition-all hover:shadow-sm`}
            >
              <div className="text-xl mb-2">{s.icone}</div>
              <p className={`text-xs font-medium ${c.text} leading-tight`}>{s.categoria}</p>
              <p className="text-xs text-gray-400 mt-1">{s.itens.length} tópicos</p>
            </button>
          )
        })}
      </div>

      <div className="relative">
        <input
          value={busca}
          onChange={function(e) { setBusca(e.target.value); setSecaoAberta(null); setItemAberto(null) }}
          placeholder="Buscar por transtorno, critério ou termo... Ex: autismo, luto, TDAH"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
        />
        {busca && (
          <button
            onClick={function() { setBusca('') }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        )}
      </div>

      {busca && (
        <p className="text-xs text-gray-400 -mt-2">
          {totalResultados} resultado(s) para {busca}
        </p>
      )}

      <div className="flex flex-col gap-3">

        {resultados.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">Nenhum resultado para {busca}</p>
          </div>
        )}

        {resultados.map(function(secao) {
          const c = COR[secao.cor]
          const aberta = secaoAberta === secao.id || busca
          return (
            <div key={secao.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

              <button
                onClick={function() { toggleSecao(secao.id) }}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-base">{secao.icone}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{secao.categoria}</p>
                    <p className="text-xs text-gray-400">{secao.itens.length} tópico{secao.itens.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-gray-400">{aberta ? '▲' : '▼'}</span>
              </button>

              {aberta && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {secao.itens.map(function(item, ii) {
                    const key = secao.id + '-' + ii
                    const aberto = itemAberto === key
                    return (
                      <div key={ii}>
                        <button
                          onClick={function() { toggleItem(key) }}
                          className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                              {item.tag && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COR[item.tag]}`}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.conteudo}</p>
                          </div>
                          <span className="text-gray-300 text-sm flex-shrink-0 mt-1">{aberto ? '▲' : '▼'}</span>
                        </button>

                        {aberto && (
                          <div className={`mx-5 mb-4 ${c.bg} ${c.border} border rounded-xl p-4`}>

                            <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.conteudo}</p>

                            {item.destaque && (
                              <div className="flex items-start gap-2 bg-white rounded-lg p-3 mb-3">
                                <span className="text-indigo-500 flex-shrink-0">💡</span>
                                <p className={`text-xs font-medium ${c.text}`}>{item.destaque}</p>
                              </div>
                            )}

                            {item.niveis && (
                              <div className="flex gap-2 mt-2">
                                {item.niveis.map(function(nivel, ni) {
                                  const cores = ['bg-green-100 text-green-700', 'bg-amber-100 text-amber-700', 'bg-red-100 text-red-700']
                                  return (
                                    <span key={ni} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${cores[ni]}`}>
                                      {nivel}
                                    </span>
                                  )
                                })}
                              </div>
                            )}

                            {item.unificou && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 mb-2">Diagnósticos unificados:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.unificou.map(function(d, di) {
                                    return (
                                      <span key={di} className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-600">
                                        {d}
                                      </span>
                                    )
                                  })}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                  <span className="text-xs text-gray-400">unificados em</span>
                                  <div className="flex-1 h-px bg-gray-200"></div>
                                </div>
                                <div className="text-center mt-2">
                                  <span className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium">
                                    Transtorno do Espectro Autista (TEA)
                                  </span>
                                </div>
                              </div>
                            )}

                            {item.terminologia && (
                              <div className="mt-2 flex flex-col gap-2">
                                {item.terminologia.map(function(t, ti) {
                                  return (
                                    <div key={ti} className="flex items-center gap-2 bg-white rounded-lg p-2.5">
                                      <span className="text-xs text-red-500 line-through flex-1">{t.de}</span>
                                      <span className="text-gray-400">→</span>
                                      <span className="text-xs text-green-700 font-medium flex-1">{t.para}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 flex-shrink-0 text-lg">⚠️</span>
          <div>
            <p className="text-xs font-medium text-amber-800 mb-1">Aviso de uso clínico</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              O DSM-5 é um instrumento auxiliar ao diagnóstico clínico. Seu uso requer julgamento profissional qualificado
              e não deve ser utilizado como um check-list automático. O diagnóstico deve sempre considerar o contexto
              cultural, social e clínico do paciente.
            </p>
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default DsmPage