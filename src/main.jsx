import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import providers
import { PlannerProvider } from './context/PlannerContext' 
import { SettingsProvider } from './context/SettingsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <PlannerProvider> 
          <App />
        </PlannerProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)