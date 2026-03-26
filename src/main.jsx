import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import providers
import { PlannerProvider } from './context/PlannerContext' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlannerProvider> 
        <App />
      </PlannerProvider>
    </BrowserRouter>
  </React.StrictMode>,
)