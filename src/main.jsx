import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import providers
import { PlannerProvider } from './context/PlannerContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext.jsx'
import { TimerProvider } from './context/TimerContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <PlannerProvider>
            <TimerProvider>
              <App />
            </TimerProvider>
          </PlannerProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)