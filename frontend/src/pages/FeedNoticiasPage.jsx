import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'

const API_KEY = 'efd227e9654bea79e140a7ebb491f3be'

const CATEGORIAS = [
  { id: 'todas',     label: 'Todas',        query: 'psicologia OR saúde mental OR psiquiatria' },
  { id: 'saude',     label: 'Saúde Mental', query: 'saúde mental ansiedade depressão' },
  { id: 'leis',      label: 'Leis e Normas',query: 'lei psicologia CFP saúde mental legislação' },
  { id: 'ciencia',   label: 'Ciência',      query: 'pesquisa psicologia neurociência comportamento' },
  { id: 'sociedade', label: 'Sociedade',    query: 'psicologia sociedade violência saúde pública' },
]

function calcularTempo(dataStr) {
  const diff = Date.now() - new Date(dataStr).getTime()
  const min  = Math.floor(diff / 60000)
  const hora = Math.floor(diff / 3600000)
  const dia  = Math.floor(diff / 86400000)
  if (min < 60)  return 'há ' + min + 'min'
  if (hora < 24) return 'há ' + hora + 'h'
  return 'há ' + dia + 'd'
}

function extrairDominio(url) {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url }
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-44 bg-gray-100"></div>
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <div className="h-3 bg-gray-100 rounded-full w-20"></div>
          <div className="h-3 bg-gray-100 rounded-full w-10"></div>
        </div>
        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>
  )
}

function FeedNoticiasPage() {
  const [noticias,   setNoticias]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [erro,       setErro]       = useState('')
  const [categoria,  setCategoria]  = useState('todas')
  const [busca,      setBusca]      = useState('')
  const [buscaAtiva, setBuscaAtiva] = useState('')
  const [destaque,   setDestaque]   = useState(null)

 const CACHE_TTL = 30 * 60 * 1000 // 30 minutos

function getCacheKey(cat, termo) {
  return 'agendo_noticias_' + cat + (termo ? '_' + termo : '')
}

function lerCache(key) {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    const parsed = JSON.parse(item)
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

function salvarCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
  } catch {}
}
 async function buscarNoticias(cat, termo) {
  setLoading(true)
  setErro('')

  const cacheKey = getCacheKey(cat, termo)
  const cached   = lerCache(cacheKey)

  if (cached) {
    setDestaque(cached[0] || null)
    setNoticias(cached.slice(1))
    setLoading(false)
    return
  }

  const q = termo || CATEGORIAS.find(function(c) { return c.id === cat })?.query || 'psicologia'

  const url = 'https://gnews.io/api/v4/search?q=' +
    encodeURIComponent(q) +
    '&lang=pt&country=br&max=12&apikey=' + API_KEY

  try {
    const res  = await fetch(url)
    const data = await res.json()
    if (data.errors) {
      const fallback = lerCache(cacheKey + '_old')
      if (fallback) {
        setDestaque(fallback[0] || null)
        setNoticias(fallback.slice(1))
        setErro('Exibindo notícias salvas anteriormente.')
      } else {
        setErro('Limite da API atingido. Tente novamente em alguns minutos.')
        setNoticias([])
        setDestaque(null)
      }
    } else {
      const artigos = data.articles || []
      const unicos = artigos.filter(function(artigo, index, self) {
        return index === self.findIndex(function(a) {
          return extrairDominio(a.url) === extrairDominio(artigo.url) || a.title === artigo.title
        })
      })
      salvarCache(cacheKey, unicos)
      salvarCache(cacheKey + '_old', unicos)
      setDestaque(unicos[0] || null)
      setNoticias(unicos.slice(1))
    }
  } catch {
    const fallback = lerCache(cacheKey + '_old')
    if (fallback) {
      setDestaque(fallback[0] || null)
      setNoticias(fallback.slice(1))
      setErro('Sem conexão. Exibindo notícias salvas.')
    } else {
      setErro('Não foi possível conectar ao serviço de notícias.')
      setNoticias([])
      setDestaque(null)
    }
  } finally {
    setLoading(false)
  }
}

  function handleBusca(e) {
    e.preventDefault()
    if (!busca.trim()) return
    setBuscaAtiva(busca)
    buscarNoticias(categoria, busca)
  }

  function limparBusca() {
    setBusca('')
    setBuscaAtiva('')
    buscarNoticias(categoria)
  }

  return (
    <DashboardLayout titulo="Notícias">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Feed de Notícias</h1>
          <p className="text-xs text-gray-400 mt-0.5">Psicologia e saúde mental em tempo real</p>
        </div>
        <button
          onClick={function() { buscarNoticias(categoria, buscaAtiva || undefined) }}
          className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M14 8A6 6 0 112 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M14 8l-2-2M14 8l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Atualizar
        </button>
      </div>

      {/* Busca */}
      <form onSubmit={handleBusca} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            value={busca}
            onChange={function(e) { setBusca(e.target.value) }}
            placeholder="Buscar notícia... Ex: ansiedade, TDAH, burnout"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
          Buscar
        </button>
        {buscaAtiva && (
          <button type="button" onClick={limparBusca}
            className="px-4 py-2.5 border border-gray-200 text-sm text-gray-500 rounded-xl hover:bg-gray-50 transition-colors">
            Limpar
          </button>
        )}
      </form>

      {/* Categorias */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIAS.map(function(cat) {
          const ativa = categoria === cat.id && !buscaAtiva
          return (
            <button key={cat.id}
              onClick={function() { setCategoria(cat.id); setBuscaAtiva(''); setBusca('') }}
              className={'text-xs px-4 py-1.5 rounded-full font-medium transition-all ' +
                (ativa ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {buscaAtiva && (
        <p className="text-xs text-gray-400">
          Resultados para: <span className="font-medium text-gray-600">{buscaAtiva}</span>
        </p>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-center">
          <p className="text-sm text-red-600 font-medium mb-1">Não foi possível carregar as notícias</p>
          <p className="text-xs text-red-400">{erro}</p>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="h-56 bg-gray-100"></div>
            <div className="p-5">
              <div className="h-3 bg-gray-100 rounded-full w-24 mb-3"></div>
              <div className="h-5 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-5 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(function(i) { return <SkeletonCard key={i}/> })}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {!loading && !erro && (
        <div className="flex flex-col gap-5">

          {/* Notícia em destaque */}
          {destaque && (
            <a href={destaque.url} target="_blank" rel="noreferrer"
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all flex gap-0">
              <div className="flex-1 min-w-0 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {extrairDominio(destaque.url)}
                    </span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{calcularTempo(destaque.publishedAt)}</span>
                    <span className="text-xs font-medium text-white bg-indigo-600 px-2.5 py-1 rounded-full ml-auto">
                      Destaque
                    </span>
                  </div>
                  <h2 className="text-xl font-medium text-gray-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-3">
                    {destaque.title}
                  </h2>
                  {destaque.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {destaque.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700">Ler matéria completa</span>
                  <svg className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {destaque.image && (
                <div className="w-72 flex-shrink-0 overflow-hidden">
                  <img src={destaque.image} alt={destaque.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={function(e) { e.target.parentElement.style.display = 'none' }}/>
                </div>
              )}
            </a>
          )}

          {/* Grid de notícias */}
          {noticias.length === 0 && !destaque && (
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-16 text-center">
              <div className="text-4xl mb-3">🧠</div>
              <p className="text-sm text-gray-400">Nenhuma notícia encontrada.</p>
            </div>
          )}

          {noticias.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {noticias.map(function(noticia, i) {
                return (
                  <a key={i} href={noticia.url} target="_blank" rel="noreferrer"
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col">

                    <div className="h-44 overflow-hidden bg-gray-50 flex-shrink-0">
                      {noticia.image ? (
                        <img src={noticia.image} alt={noticia.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={function(e) { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-3xl">🧠</div>' }}/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🧠</div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full truncate max-w-28">
                          {extrairDominio(noticia.url)}
                        </span>
                        <span className="text-xs text-gray-300 ml-auto flex-shrink-0">
                          {calcularTempo(noticia.publishedAt)}
                        </span>
                      </div>

                      <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-3 group-hover:text-indigo-600 transition-colors flex-1">
                        {noticia.title}
                      </h3>

                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
                        <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">Ler mais</span>
                        <svg className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between py-2">
        <p className="text-xs text-gray-300">Powered by GNews API · Portais brasileiros</p>
        <p className="text-xs text-gray-300">{noticias.length + (destaque ? 1 : 0)} notícias carregadas</p>
      </div>

    </DashboardLayout>
  )
}

export default FeedNoticiasPage