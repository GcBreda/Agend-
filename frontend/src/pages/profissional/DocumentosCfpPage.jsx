import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const DOCUMENTOS = [
  {
    id: 'declaracao',
    nome: 'Declaração',
    icone: '📄',
    cor: 'indigo',
    descricao: 'Documento que confirma a prestação de serviços psicológicos, podendo atestar comparecimento, participação ou realização de atendimento.',
    quando: 'Quando solicitado pelo paciente para fins de comprovação de atendimento, plano de saúde, trabalho ou escola.',
    resolucao: 'Resolução CFP nº 006/2019',
    obrigatorios: [
      'Nome completo do paciente',
      'Número de sessões realizadas ou período de atendimento',
      'Finalidade do documento quando aplicável',
      'Data de emissão',
      'Assinatura do psicólogo com carimbo',
      'Número do CRP',
    ],
    nao_deve: [
      'Revelar diagnóstico sem consentimento do paciente',
      'Emitir sem que o atendimento tenha de fato ocorrido',
      'Incluir informações que violem o sigilo profissional',
    ],
    modelo: 'DECLARACAO\n\nDeclaro para os devidos fins que [NOME DO PACIENTE], portador(a) do CPF [CPF], encontra-se sob acompanhamento psicologico neste consultorio, com sessoes realizadas [FREQUENCIA], no periodo de [DATA INICIO] a [DATA FIM].\n\n[CIDADE], [DATA]\n\n[NOME DO PSICOLOGO]\nCRP [NUMERO]',
  },
  {
    id: 'atestado',
    nome: 'Atestado Psicológico',
    icone: '📋',
    cor: 'green',
    descricao: 'Documento que certifica condições psicológicas do paciente, podendo indicar necessidade de afastamento, restrições de atividades ou aptidão para determinada função.',
    quando: 'Quando há necessidade de afastamento do trabalho por condição de saúde mental, ou para comprovar aptidão ou inaptidão para atividade específica.',
    resolucao: 'Resolução CFP nº 006/2019',
    obrigatorios: [
      'Nome completo do paciente',
      'CID-10 ou CID-11 quando necessário e autorizado',
      'Período de afastamento ou restrição se aplicável',
      'Data de emissão',
      'Assinatura e carimbo do psicólogo',
      'Número do CRP',
    ],
    nao_deve: [
      'Emitir atestado sem avaliação presencial adequada',
      'Incluir diagnóstico sem consentimento expresso do paciente',
      'Atestar condições que estejam além da competência do psicólogo',
      'Emitir de forma retroativa sem justificativa clínica',
    ],
    modelo: 'ATESTADO PSICOLOGICO\n\nAtesto que [NOME DO PACIENTE], portador(a) do CPF [CPF], esteve sob minha avaliacao psicologica e, em razao de condicao de saude mental, necessita de afastamento de suas atividades pelo periodo de [X DIAS], a partir de [DATA].\n\n[CIDADE], [DATA]\n\n[NOME DO PSICOLOGO]\nCRP [NUMERO]',
  },
  {
    id: 'relatorio',
    nome: 'Relatório Psicológico',
    icone: '📊',
    cor: 'amber',
    descricao: 'Documento técnico que descreve o processo de avaliação ou acompanhamento psicológico, com análise fundamentada sobre o caso. É o documento mais completo e detalhado.',
    quando: 'Solicitado por instituições, juízo, escola, INSS, planos de saúde ou pelo próprio paciente para fins específicos.',
    resolucao: 'Resolução CFP nº 006/2019',
    obrigatorios: [
      'Identificação do solicitante e finalidade do relatório',
      'Dados de identificação do avaliado',
      'Descrição do processo com número de sessões e instrumentos utilizados',
      'Análise psicológica fundamentada',
      'Conclusão e recomendações quando aplicável',
      'Data, assinatura, carimbo e CRP',
    ],
    estrutura: [
      { secao: '1. Identificação', descricao: 'Nome, idade, escolaridade, encaminhante e finalidade do documento.' },
      { secao: '2. Demanda', descricao: 'Motivo do encaminhamento ou solicitação do relatório.' },
      { secao: '3. Procedimentos', descricao: 'Técnicas, instrumentos e número de sessões realizadas.' },
      { secao: '4. Análise', descricao: 'Descrição fundamentada das observações e resultados obtidos.' },
      { secao: '5. Conclusão', descricao: 'Síntese das análises com recomendações pertinentes.' },
      { secao: '6. Identificação', descricao: 'Nome completo, CRP, data e assinatura.' },
    ],
    nao_deve: [
      'Emitir opinião além dos dados coletados',
      'Usar linguagem não técnica ou estigmatizante',
      'Revelar informações além do necessário para a finalidade',
      'Emitir sem processo de avaliação adequado',
    ],
  },
  {
    id: 'laudo',
    nome: 'Laudo Psicológico',
    icone: '🔬',
    cor: 'purple',
    descricao: 'Documento resultante de processo de avaliação psicológica com uso de testes e instrumentos padronizados. Apresenta conclusões técnicas sobre aspectos específicos da personalidade, inteligência ou funcionamento psíquico.',
    quando: 'Processos judiciais, avaliações de custódia, concursos públicos, avaliações de saúde mental para funções específicas como porte de arma ou adoção.',
    resolucao: 'Resolução CFP nº 006/2019',
    obrigatorios: [
      'Identificação completa do avaliado',
      'Finalidade da avaliação',
      'Instrumentos utilizados com registro no SATEPSI',
      'Descrição do processo avaliativo',
      'Análise e interpretação dos resultados',
      'Conclusão técnica objetiva',
      'Data, assinatura, carimbo e CRP',
    ],
    atencao: [
      'Somente instrumentos registrados no SATEPSI podem ser utilizados',
      'O psicólogo deve ter formação específica nos instrumentos utilizados',
      'O laudo é sigiloso e destinado exclusivamente ao solicitante',
      'Deve ser conservado por no mínimo 5 anos',
    ],
    nao_deve: [
      'Usar testes não aprovados pelo SATEPSI',
      'Realizar avaliação sem número adequado de sessões',
      'Emitir conclusões além do que os dados sustentam',
      'Compartilhar com terceiros não autorizados',
    ],
  },
  {
    id: 'prontuario',
    nome: 'Prontuário Psicológico',
    icone: '🗂️',
    cor: 'red',
    descricao: 'Conjunto de documentos que registram todo o processo de atendimento psicológico. É de uso interno do psicólogo e deve ser mantido de forma segura e sigilosa.',
    quando: 'Obrigatório para todo atendimento psicológico. Deve ser iniciado na primeira sessão e mantido atualizado durante todo o processo.',
    resolucao: 'Resolução CFP nº 001/2009',
    obrigatorios: [
      'Dados de identificação do paciente',
      'Data de início do atendimento',
      'Registro de cada sessão com data e observações relevantes',
      'Instrumentos utilizados e resultados',
      'Evolução do caso',
      'Data de encerramento e motivo quando aplicável',
    ],
    prazos: [
      { prazo: 'Adultos', tempo: 'Mínimo 5 anos após encerramento' },
      { prazo: 'Crianças e adolescentes', tempo: 'Até completar 18 anos mais 5 anos' },
      { prazo: 'Documentos de avaliação', tempo: 'Mínimo 5 anos' },
    ],
    nao_deve: [
      'Deixar o prontuário em local de acesso não autorizado',
      'Descartar sem os procedimentos adequados de descarte seguro',
      'Compartilhar com terceiros sem autorização ou determinação legal',
      'Omitir registros relevantes do processo terapêutico',
    ],
  },
]

const COR = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
}

function DocumentosCfpPage() {
  const [docAberto, setDocAberto] = useState(null)
  const [abaAtiva,  setAbaAtiva]  = useState({})
  const [busca,     setBusca]     = useState('')
  const [copiado,   setCopiado]   = useState(null)

  function toggleDoc(id) {
    setDocAberto(docAberto === id ? null : id)
    setAbaAtiva(function(prev) { return Object.assign({}, prev, { [id]: prev[id] || 'info' }) })
  }

  function setAba(id, aba) {
    setAbaAtiva(function(prev) { return Object.assign({}, prev, { [id]: aba }) })
  }

  function copiarModelo(texto, id) {
    navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(function() { setCopiado(null) }, 2000)
  }

  const resultados = DOCUMENTOS.filter(function(d) {
    if (!busca) return true
    const termo = busca.toLowerCase()
    return d.nome.toLowerCase().includes(termo) ||
           d.descricao.toLowerCase().includes(termo) ||
           d.quando.toLowerCase().includes(termo)
  })

  return (
    <DashboardLayout titulo="Documentos Psicológicos CFP">

      <div className="bg-indigo-600 rounded-xl px-6 py-5 flex items-start justify-between">
        <div>
          <h2 className="text-base font-medium text-white mb-1">
            Documentos Psicológicos — Como Elaborar
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed mb-3">
            Guia prático baseado na Resolução CFP 006/2019 e demais normativas do CFP.
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-lg font-medium text-white">{DOCUMENTOS.length}</p>
              <p className="text-xs text-indigo-200">Tipos de documento</p>
            </div>
          </div>
        </div>
        <a href="https://site.cfp.org.br/wp-content/uploads/2019/09/Resolu%C3%A7%C3%A3o-CFP-n%C3%BA-006-19.pdf" target="_blank" rel="noreferrer" className="bg-white text-indigo-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 flex-shrink-0">
          Resolução CFP 006/2019
        </a>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {DOCUMENTOS.map(function(d) {
          const c = COR[d.cor]
          return (
            <button key={d.id} onClick={function() { toggleDoc(d.id) }}
              className={'border rounded-xl p-3 text-left transition-all hover:shadow-sm ' + c.bg + ' ' + c.border + (docAberto === d.id ? ' ring-2 ring-indigo-400' : '')}>
              <div className="text-xl mb-2">{d.icone}</div>
              <p className={'text-xs font-medium ' + c.text}>{d.nome}</p>
              <p className="text-xs text-gray-400 mt-0.5">CFP</p>
            </button>
          )
        })}
      </div>

      <input value={busca} onChange={function(e) { setBusca(e.target.value) }}
        placeholder="Buscar documento... Ex: atestado, prontuário, laudo"
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500" />

      <div className="flex flex-col gap-3">

        {resultados.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">Nenhum resultado para {busca}</p>
          </div>
        )}

        {resultados.map(function(doc) {
          const c = COR[doc.cor]
          const aberto = docAberto === doc.id
          const aba = abaAtiva[doc.id] || 'info'

          const abas = [
            { id: 'info',    label: 'Informações' },
            { id: 'campos',  label: 'Campos obrigatórios' },
            { id: 'vedado',  label: 'O que é vedado' },
          ]
          if (doc.modelo)    abas.push({ id: 'modelo',    label: 'Modelo' })
          if (doc.estrutura) abas.push({ id: 'estrutura', label: 'Estrutura' })
          if (doc.prazos)    abas.push({ id: 'prazos',    label: 'Prazos' })
          if (doc.atencao)   abas.push({ id: 'atencao',   label: 'Atenção' })

          return (
            <div key={doc.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

              <button onClick={function() { toggleDoc(doc.id) }}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ' + c.bg}>
                    <span className="text-lg">{doc.icone}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.resolucao}</p>
                  </div>
                </div>
                <span className="text-gray-400">{aberto ? '▲' : '▼'}</span>
              </button>

              {aberto && (
                <div className="border-t border-gray-100">

                  <div className="flex border-b border-gray-100 overflow-x-auto">
                    {abas.map(function(tab) {
                      return (
                        <button key={tab.id} onClick={function() { setAba(doc.id, tab.id) }}
                          className={'px-4 py-2.5 text-xs font-medium transition-colors border-b-2 flex-shrink-0 ' + (aba === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="p-5">

                    {aba === 'info' && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">O que é</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{doc.descricao}</p>
                        </div>
                        <div className={'border rounded-xl p-4 ' + c.bg + ' ' + c.border}>
                          <p className="text-xs font-medium text-gray-500 mb-1">Quando emitir</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{doc.quando}</p>
                        </div>
                      </div>
                    )}

                    {aba === 'campos' && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-3">Campos obrigatórios</p>
                        <div className="flex flex-col gap-2">
                          {doc.obrigatorios.map(function(campo, ci) {
                            return (
                              <div key={ci} className="flex items-start gap-3">
                                <div className={'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ' + c.bg}>
                                  <span className={'text-xs font-medium ' + c.text}>{ci + 1}</span>
                                </div>
                                <p className="text-sm text-gray-700">{campo}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {aba === 'vedado' && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-3">O psicólogo NÃO deve</p>
                        <div className="flex flex-col gap-2">
                          {doc.nao_deve.map(function(item, ii) {
                            return (
                              <div key={ii} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                                <span className="text-red-500 flex-shrink-0">X</span>
                                <p className="text-sm text-red-700">{item}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {aba === 'modelo' && doc.modelo && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-medium text-gray-500">Modelo de documento</p>
                          <button onClick={function() { copiarModelo(doc.modelo, doc.id) }}
                            className={'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ' + (copiado === doc.id ? 'bg-green-100 text-green-700' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')}>
                            {copiado === doc.id ? 'Copiado!' : 'Copiar modelo'}
                          </button>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{doc.modelo}</pre>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Os campos entre colchetes devem ser preenchidos com os dados reais.</p>
                      </div>
                    )}

                    {aba === 'estrutura' && doc.estrutura && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-3">Estrutura recomendada</p>
                        <div className="flex flex-col gap-2">
                          {doc.estrutura.map(function(s, si) {
                            return (
                              <div key={si} className={'border rounded-lg p-3 flex gap-3 ' + c.bg + ' ' + c.border}>
                                <span className={'text-xs font-medium flex-shrink-0 ' + c.text}>{s.secao}</span>
                                <p className="text-xs text-gray-600">{s.descricao}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {aba === 'prazos' && doc.prazos && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-3">Prazos de guarda</p>
                        <div className="flex flex-col gap-2">
                          {doc.prazos.map(function(p, pi) {
                            return (
                              <div key={pi} className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-sm font-medium text-amber-800">{p.prazo}</p>
                                <p className="text-sm text-amber-700">{p.tempo}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {aba === 'atencao' && doc.atencao && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-3">Pontos de atenção</p>
                        <div className="flex flex-col gap-2">
                          {doc.atencao.map(function(item, ii) {
                            return (
                              <div key={ii} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
                                <span className="text-amber-500 flex-shrink-0">!</span>
                                <p className="text-sm text-amber-800">{item}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <span className="text-indigo-500 flex-shrink-0 text-lg">i</span>
        <div>
          <p className="text-xs font-medium text-indigo-800 mb-1">Base legal</p>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Todos os documentos psicológicos devem seguir a Resolução CFP 006/2019.
            Em caso de dúvida, consulte o Conselho Regional de Psicologia da sua região.
          </p>
          <a href="https://site.cfp.org.br" target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-medium hover:underline mt-1 inline-block">
            Acessar site.cfp.org.br
          </a>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default DocumentosCfpPage