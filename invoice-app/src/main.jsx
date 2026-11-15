import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { InvoiceProvider } from './components/InvoiceProvider'
import { AuthProvider } from './components/AuthContext.jsx'
import { Workbox } from 'workbox-window'
import { Buffer } from 'buffer'


if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js'); 
  wb.register();
}
if (typeof window !== 'undefined') {
       window.Buffer = Buffer;
       window.global = window;  
}

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
