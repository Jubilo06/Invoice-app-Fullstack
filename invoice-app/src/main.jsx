import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { InvoiceProvider } from './components/InvoiceProvider'
import { AuthProvider } from './components/AuthContext.jsx'
import { Workbox } from 'workbox-window'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </InvoiceProvider>
    </AuthProvider>
  </StrictMode>,
)
