
  import React from 'react'
  import FeedNoticiasPage from './pages/FeedNoticiasPage'
  import DocumentosCfpPage from './pages/profissional/DocumentosCfpPage'
  import DsmPage from './pages/profissional/DsmPage'
  import CodigoEticaPage from './pages/profissional/CodigoEticaPage'
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { AuthProvider, useAuth } from './context/AuthContext'

  import LandingPage        from './pages/LandingPage'
  import LoginPage          from './pages/auth/LoginPage'
  import CadastroPage       from './pages/auth/CadastroPage'
  import RecuperarSenhaPage from './pages/auth/RecuperarSenhaPage'

  import PacienteDashboard from './pages/paciente/DashboardPage'
  import PacienteConsultas from './pages/paciente/ConsultasPage'
  import PacienteAgendar   from './pages/paciente/AgendarPage'
  import PacienteHistorico from './pages/paciente/HistoricoPage'

  import ProfissionalDashboard  from './pages/profissional/DashboardPage'
  import ProfissionalAgenda     from './pages/profissional/AgendaPage'
  import ProfissionalPacientes  from './pages/profissional/PacientesPage'
  import ProfissionalProntuario from './pages/profissional/ProntuariosPage'
  import ProfissionalFinanceiro from './pages/profissional/FinanceiroPage'

  import ConfiguracoesPage from './pages/ConfiguracoesPage'
  import NotFoundPage      from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } }
})

function RotaProtegida({ children, perfil }) {
  const { usuario, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (perfil && usuario.perfil !== perfil) return <Navigate to="/" replace />
  return children
}
function RotaPublica({ children }) {
  const { usuario, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>
  if (usuario) {
    return <Navigate to={usuario.perfil === 'PACIENTE' ? '/paciente' : '/profissional'} replace />
  }
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<LandingPage />} />
            <Route path="/login"          element={<RotaPublica><LoginPage /></RotaPublica>} />
            <Route path="/cadastro"       element={<RotaPublica><CadastroPage /></RotaPublica>} />
            <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />

            <Route path="/paciente" element={<RotaProtegida perfil="PACIENTE"><PacienteDashboard /></RotaProtegida>} />
            <Route path="/paciente/consultas" element={<RotaProtegida perfil="PACIENTE"><PacienteConsultas /></RotaProtegida>} />
            <Route path="/paciente/agendar"   element={<RotaProtegida perfil="PACIENTE"><PacienteAgendar /></RotaProtegida>} />
            <Route path="/paciente/historico" element={<RotaProtegida perfil="PACIENTE"><PacienteHistorico /></RotaProtegida>} />
            <Route path="/paciente/noticias" element={<RotaProtegida perfil="PACIENTE"><FeedNoticiasPage /></RotaProtegida>} />

            <Route path="/profissional" element={<RotaProtegida perfil="PROFISSIONAL"><ProfissionalDashboard /></RotaProtegida>} />
            <Route path="/profissional/codigo-etica" element={<RotaProtegida perfil="PROFISSIONAL"><CodigoEticaPage /></RotaProtegida>} />
            <Route path="/profissional/agenda"      element={<RotaProtegida perfil="PROFISSIONAL"><ProfissionalAgenda /></RotaProtegida>} />
            <Route path="/profissional/pacientes"   element={<RotaProtegida perfil="PROFISSIONAL"><ProfissionalPacientes /></RotaProtegida>} />
            <Route path="/profissional/prontuarios/:pacienteId?" element={<RotaProtegida perfil="PROFISSIONAL"><ProfissionalProntuario /></RotaProtegida>} />
            <Route path="/profissional/financeiro"  element={<RotaProtegida perfil="PROFISSIONAL"><ProfissionalFinanceiro /></RotaProtegida>} />
            <Route path="/profissional/dsm5" element={<RotaProtegida perfil="PROFISSIONAL"><DsmPage /></RotaProtegida>} />
            <Route path="/profissional/documentos-cfp" element={<RotaProtegida perfil="PROFISSIONAL"><DocumentosCfpPage /></RotaProtegida>} />
            <Route path="/profissional/noticias" element={<RotaProtegida perfil="PROFISSIONAL"><FeedNoticiasPage /></RotaProtegida>} />

            <Route path="/configuracoes" element={<RotaProtegida><ConfiguracoesPage /></RotaProtegida>} />

            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}   