import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'

const CODIGO = [
  {
    titulo: 'Princípios Fundamentais',
    artigos: [
      {
        num: 'Princípio I',
        texto: 'O psicólogo baseará o seu trabalho no respeito e na promoção da liberdade, da dignidade, da igualdade e da integridade do ser humano, apoiado nos valores que embasam a Declaração Universal dos Direitos Humanos.'
      },
      {
        num: 'Princípio II',
        texto: 'O psicólogo trabalhará visando promover a saúde e a qualidade de vida das pessoas e da coletividade e contribuirá para a eliminação de quaisquer formas de negligência, discriminação, exploração, violência, crueldade e opressão.'
      },
      {
        num: 'Princípio III',
        texto: 'O psicólogo atuará com responsabilidade social, analisando crítica e historicamente a realidade política, econômica, social e cultural.'
      },
      {
        num: 'Princípio IV',
        texto: 'O psicólogo atuará com responsabilidade, por meio do contínuo aprimoramento profissional, contribuindo para o desenvolvimento da Psicologia como campo científico de conhecimento e de prática.'
      },
      {
        num: 'Princípio V',
        texto: 'O psicólogo contribuirá para promover a universalização do acesso da população às informações, ao conhecimento da ciência psicológica, aos serviços e aos padrões éticos da profissão.'
      },
      {
        num: 'Princípio VI',
        texto: 'O psicólogo zelará para que o exercício profissional seja efetuado com dignidade, rejeitando situações em que a Psicologia seja utilizada para criar condições de opressão, exploração ou aniquilamento do ser humano.'
      },
      {
        num: 'Princípio VII',
        texto: 'O psicólogo considerará as relações humanas, institucionais e sociais como elemento central de sua atuação, contribuindo para a construção de uma sociedade democrática e plural, em que seja possível o pleno exercício da cidadania.'
      },
    ]
  },
  {
    titulo: 'Das Responsabilidades do Psicólogo — Arts. 1º ao 10',
    artigos: [
      {
        num: 'Art. 1º',
        texto: 'São deveres fundamentais dos psicólogos:\na) Conhecer, respeitar e agir de acordo com os princípios éticos fundamentais;\nb) Assumir responsabilidades profissionais somente por atividades para as quais esteja capacitado pessoal, teórica e tecnicamente;\nc) Prestar serviços psicológicos de qualidade, em condições de trabalho dignas e apropriadas à natureza desses serviços, utilizando princípios, conhecimentos e técnicas reconhecidamente fundamentados na ciência psicológica;\nd) Incentivar e promover o desenvolvimento da Psicologia;\ne) Contribuir para a consolidação e aprimoramento da Psicologia como profissão e como ciência;\nf) Fornecer à população informações corretas sobre a profissão, seus princípios éticos, suas competências e sua contribuição ao bem-estar individual e coletivo;\ng) Orientar a população no sentido de encontrar os serviços adequados às suas necessidades;\nh) Conhecer e respeitar as diretrizes das políticas públicas de saúde, educação, assistência social e demais políticas aplicáveis ao campo de atuação profissional;\ni) Respeitar a legislação pertinente ao exercício profissional;\nj) Zelar pela própria saúde mental e física, buscando auxílio profissional quando necessário;\nl) Contribuir para o debate, a reflexão e a análise crítica da vida em sociedade.'
      },
      {
        num: 'Art. 2º',
        texto: 'Ao psicólogo é vedado:\na) Praticar ou ser conivente com quaisquer atos que caracterizem negligência, discriminação, exploração, violência, crueldade ou opressão;\nb) Induzir a convicções políticas, filosóficas, morais, ideológicas, religiosas, de orientação sexual ou a qualquer tipo de preconceito, quando do exercício de suas funções profissionais;\nc) Utilizar ou favorecer o uso de conhecimento e a utilização de práticas psicológicas como instrumentos de castigo, tortura ou qualquer forma de violência;\nd) Acumpliciar-se com pessoas ou organizações que exerçam atividades contrárias à lei, à ética e à dignidade humana;\ne) Ser conivente com erros, infrações éticas, violência ou descumprimento de normas, de qualquer natureza, cometidos por outros psicólogos;\nf) Omitir informações que sejam relevantes para o processo de avaliação, diagnóstico ou intervenção;\ng) Emitir documentos sem respaldo técnico, ético e institucional, quando for o caso;\nh) Fazer prognósticos categoriais sobre clientes/pacientes com base em laudos de outros psicólogos, sem proceder à nova avaliação;\ni) Prolongar ou criar necessidade de atendimento;\nj) Submeter pessoas a procedimentos diagnósticos ou terapêuticos sem seu conhecimento e consentimento;\nl) Usar de relacionamento profissional para obter vantagens pessoais;\nm) Assinar trabalhos ou documentos elaborados por outra pessoa;\nn) Exercer a profissão quando em estado que prejudique o atendimento ao cliente;\no) Realizar intervenções sem os elementos mínimos necessários para garanti-los;\np) Participar de pesquisas que contrariem as normas éticas;\nq) Prestar serviços e assumir atividades incompatíveis com sua formação.'
      },
      {
        num: 'Art. 3º',
        texto: 'O psicólogo, no exercício profissional, deverá conhecer e observar as atribuições que lhe são conferidas pela legislação e regulamentação pertinentes ao exercício da Psicologia.'
      },
      {
        num: 'Art. 4º',
        texto: 'Ao psicólogo é vedado negar, sem justa causa, atendimento a pessoas que procurem seus serviços.'
      },
      {
        num: 'Art. 5º',
        texto: 'O psicólogo que se recusar a prestar serviços a clientes encaminhados por outros profissionais de saúde, em razão de diferenças filosóficas, ideológicas ou religiosas, deverá encaminhá-los para outro profissional.'
      },
      {
        num: 'Art. 6º',
        texto: 'O psicólogo, no exercício profissional, deverá zelar pela qualidade dos serviços prestados, utilizando princípios, conhecimentos e técnicas reconhecidamente fundamentados na ciência psicológica.'
      },
      {
        num: 'Art. 7º',
        texto: 'O psicólogo poderá recusar-se a prestar serviços quando as condições de trabalho forem inadequadas para o exercício profissional digno e de qualidade, devendo comunicar o fato às autoridades competentes.'
      },
      {
        num: 'Art. 8º',
        texto: 'O psicólogo deverá informar, a quem de direito, os resultados decorrentes da prestação de serviços psicológicos, transmitindo somente o que for necessário para a tomada de decisões que afetem o usuário ou a terceiros.'
      },
      {
        num: 'Art. 9º',
        texto: 'É dever do psicólogo respeitar o sigilo profissional a fim de proteger, por meio da confidencialidade, a intimidade das pessoas, grupos ou organizações, a que tenha acesso no exercício profissional.\n\nParágrafo único: A quebra do sigilo só poderá ocorrer nas seguintes situações:\na) Consentimento do cliente;\nb) Determinação legal;\nc) Risco de vida para o cliente ou terceiros.'
      },
      {
        num: 'Art. 10',
        texto: 'Nas situações em que se configure conflito entre as exigências decorrentes do disposto no art. 9º e as afirmações dos princípios fundamentais desta lei, excetuadas as situações previstas em lei, o psicólogo poderá quebrar o sigilo somente quando:\na) O sigilo resultar em dano ao próprio cliente ou a terceiros;\nb) Em caso de internação do cliente;\nc) Para evitar as consequências danosas à saúde pública;\nd) Por determinação judicial.'
      },
    ]
  },
  {
    titulo: 'Das Responsabilidades do Psicólogo — Arts. 11 ao 20',
    artigos: [
      {
        num: 'Art. 11',
        texto: 'O psicólogo prestará informações necessárias ao usuário sobre o processo de diagnóstico e terapêutico, incluindo informações sobre os objetivos, métodos, critérios de avaliação e acompanhamento dos resultados.'
      },
      {
        num: 'Art. 12',
        texto: 'O psicólogo, ao elaborar documentos escritos destinados a subsidiar procedimentos de avaliação, classificação e seleção de qualquer natureza, deverá fazê-lo com objetividade, utilizando linguagem clara e acessível, de forma que as informações sejam precisas e úteis.\n\nParágrafo único: Nenhum documento psicológico de avaliação poderá ser fornecido sem a identificação do psicólogo que o elaborou.'
      },
      {
        num: 'Art. 13',
        texto: 'O psicólogo, ao elaborar laudos, pareceres, relatórios e quaisquer outros documentos de avaliação psicológica, deverá:\na) Registrar os dados obtidos, os instrumentos utilizados e os critérios adotados;\nb) Basear suas conclusões nos dados obtidos;\nc) Limitar-se a seu campo de competência;\nd) Registrar a data de emissão do documento.'
      },
      {
        num: 'Art. 14',
        texto: 'O psicólogo poderá suspender atendimentos, quando estes estiverem sendo prejudicados pelas condições do ambiente de trabalho, comunicando o fato ao superior imediato e tomando as medidas necessárias para que o usuário não seja prejudicado.'
      },
      {
        num: 'Art. 15',
        texto: 'O psicólogo deverá manter os documentos pertinentes ao trabalho desenvolvido em locais seguros, pelo prazo estabelecido nos termos das leis vigentes, garantindo o sigilo e o acesso do cliente.'
      },
      {
        num: 'Art. 16',
        texto: 'O psicólogo que trabalha em equipe multiprofissional somente compartilhará informações e documentos pertinentes ao caso, quando necessário ao desenvolvimento do trabalho, observando o sigilo profissional.'
      },
      {
        num: 'Art. 17',
        texto: 'O psicólogo, no exercício da docência, deverá adotar os princípios éticos desta resolução em sua prática pedagógica.'
      },
      {
        num: 'Art. 18',
        texto: 'O psicólogo que realizar pesquisas com seres humanos deverá fazê-lo em conformidade com as diretrizes nacionais e internacionais que regem a pesquisa com seres humanos.'
      },
      {
        num: 'Art. 19',
        texto: 'O psicólogo, ao utilizar meios de comunicação de massa, obedecerá aos princípios éticos desta resolução, sendo vedado:\na) Apresentar afirmações sem respaldo científico;\nb) Realizar atendimento psicológico a distância por tais meios;\nc) Expor a identidade de clientes;\nd) Comprometer a dignidade e integridade do ser humano.'
      },
      {
        num: 'Art. 20',
        texto: 'O psicólogo, ao anunciar seus serviços profissionais, deverá:\na) Observar as diretrizes éticas desta resolução;\nb) Restringir-se à informação de sua qualificação profissional, área de atuação e formas de contato;\nc) Abster-se de anunciar técnicas e procedimentos cujos resultados sejam promessas sem comprovação científica.'
      },
    ]
  },
  {
    titulo: 'Das Disposições Gerais — Arts. 21 ao 25',
    artigos: [
      {
        num: 'Art. 21',
        texto: 'As penalidades aplicáveis ao psicólogo, por infração às normas desta resolução, são:\na) Advertência;\nb) Multa;\nc) Censura pública;\nd) Suspensão do exercício profissional;\ne) Cassação do registro profissional.'
      },
      {
        num: 'Art. 22',
        texto: 'As infrações éticas serão apreciadas pelos Conselhos Regionais de Psicologia, em primeira instância, e pelo Conselho Federal de Psicologia, em segunda instância.'
      },
      {
        num: 'Art. 23',
        texto: 'O psicólogo tem o direito de ser informado sobre o processo ético instaurado contra si, podendo apresentar defesa e recursos nos prazos legais.'
      },
      {
        num: 'Art. 24',
        texto: 'O Conselho Federal de Psicologia e os Conselhos Regionais de Psicologia orientarão e fiscalizarão o exercício da profissão, promovendo a divulgação dos princípios éticos e das normas de conduta profissional.'
      },
      {
        num: 'Art. 25',
        texto: 'Esta resolução entra em vigor na data de sua publicação, revogando-se as disposições em contrário, em especial a Resolução CFP nº 002/87.'
      },
    ]
  },
]

function CodigoEticaPage() {
  const [busca, setBusca] = useState('')
  const [tituloAberto, setTituloAberto] = useState(null)
  const [artigoAberto, setArtigoAberto] = useState(null)

  const totalArtigos = CODIGO.reduce(function(acc, t) { return acc + t.artigos.length }, 0)

  const resultados = CODIGO.map(function(titulo) {
    return {
      titulo: titulo.titulo,
      artigos: titulo.artigos.filter(function(a) {
        if (!busca) return true
        return a.num.toLowerCase().includes(busca.toLowerCase()) || a.texto.toLowerCase().includes(busca.toLowerCase())
      })
    }
  }).filter(function(t) {
    return !busca || t.artigos.length > 0
  })

  function toggleTitulo(i) {
    if (tituloAberto === i) {
      setTituloAberto(null)
    } else {
      setTituloAberto(i)
    }
    setArtigoAberto(null)
  }

  function toggleArtigo(key) {
    if (artigoAberto === key) {
      setArtigoAberto(null)
    } else {
      setArtigoAberto(key)
    }
  }

  function copiar(texto) {
    navigator.clipboard.writeText(texto)
  }

  return (
    <DashboardLayout titulo="Código de Ética CFP">

      <div className="bg-indigo-600 rounded-xl p-5 flex items-start justify-between">
        <div>
          <h2 className="text-base font-medium text-white mb-1">
            Código de Ética Profissional do Psicólogo
          </h2>
          <p className="text-xs text-indigo-200 mb-3">
            Resolução CFP 010/05 — Aprovado em 27 de agosto de 2005.
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-lg font-medium text-white">{CODIGO.length}</p>
              <p className="text-xs text-indigo-200">Seções</p>
            </div>
            <div>
              <p className="text-lg font-medium text-white">{totalArtigos}</p>
              <p className="text-xs text-indigo-200">Artigos e Princípios</p>
            </div>
          </div>
        </div>
        <a href="https://site.cfp.org.br/wp-content/uploads/2012/07/codigo-de-etica-psicologia.pdf" target="_blank" rel="noreferrer" className="bg-white text-indigo-700 text-xs font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 flex-shrink-0">
          PDF oficial CFP
        </a>
      </div>

      <input
        value={busca}
        onChange={function(e) { setBusca(e.target.value) }}
        placeholder="Buscar artigo ou palavra-chave... Ex: sigilo, vedado, penalidades"
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500"
      />

      {busca && (
        <p className="text-xs text-gray-400 -mt-2">
          {resultados.reduce(function(acc, t) { return acc + t.artigos.length }, 0)} resultado(s) para {busca}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {resultados.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-sm text-gray-400">Nenhum resultado encontrado</p>
          </div>
        )}

        {resultados.map(function(titulo, ti) {
          return (
            <div key={ti} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

              <button
                onClick={function() { toggleTitulo(ti) }}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">{ti + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{titulo.titulo}</p>
                    <p className="text-xs text-gray-400">{titulo.artigos.length} itens</p>
                  </div>
                </div>
                <span className="text-gray-400">{tituloAberto === ti || busca ? '▲' : '▼'}</span>
              </button>

              {(tituloAberto === ti || busca) && (
                <div className="border-t border-gray-100">
                  {titulo.artigos.map(function(artigo, ai) {
                    const key = ti + '-' + ai
                    const aberto = artigoAberto === key
                    return (
                      <div key={ai} className="border-b border-gray-100 last:border-0">
                        <button
                          onClick={function() { toggleArtigo(key) }}
                          className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-gray-50"
                        >
                          <span className="text-xs font-medium text-indigo-600 w-24 flex-shrink-0 mt-0.5">
                            {artigo.num}
                          </span>
                          <p className="text-sm text-gray-700 flex-1 leading-relaxed line-clamp-2">
                            {artigo.texto.split('\n')[0]}
                          </p>
                          <span className="text-gray-300 text-sm flex-shrink-0">{aberto ? '▲' : '▼'}</span>
                        </button>

                        {aberto && (
                          <div className="px-5 pb-4 ml-28">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                              <p className="text-xs font-medium text-indigo-700 mb-2">{artigo.num} — Texto integral</p>
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{artigo.texto}</p>
                              <button
                                onClick={function() { copiar(artigo.num + ': ' + artigo.texto) }}
                                className="mt-3 text-xs text-indigo-500 hover:text-indigo-700"
                              >
                                Copiar artigo
                              </button>
                            </div>
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

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">Fonte: Conselho Federal de Psicologia — Resolução CFP 010/05</p>
        <a href="https://site.cfp.org.br" target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline">
          site.cfp.org.br
        </a>
      </div>

    </DashboardLayout>
  )
}

export default CodigoEticaPage