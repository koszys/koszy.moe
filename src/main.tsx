import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Import providers
import { PlannerProvider } from './context/PlannerContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import { TimerProvider } from './context/TimerContext'

// Import auth UI components
import LoadingFallback from './components/ui/LoadingFallback'
import LogoutModal from './components/auth/LogoutModal'
import AuthModal from './components/auth/AuthModal'
import { useAuth } from './context/AuthContext'

function AppProviders() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingFallback message="Connecting..." />
  }

  return (
    <>
      <SettingsProvider>
        <PlannerProvider>
          <TimerProvider>
            <App />
          </TimerProvider>
        </PlannerProvider>
      </SettingsProvider>
      <AuthModal />
      <LogoutModal />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProviders />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)