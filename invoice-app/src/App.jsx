import { useState, useContext } from 'react'
import Invoice from './components/Invoice'
import { InvoiceContext } from './components/InvoiceProvider'
import InvoiceTable from './components/InvoiceTable'
import { Stack,Typography } from '@mui/material'
import Main from './components/Main'
import Summary from './components/Summary'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import InvoiceItems from './components/InvoiceItems'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import InvoiceEditorPage from './components/InvoiceEditorPage'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

function App() {
   const { currentInvoice } = useContext(InvoiceContext);
   const hasItems = currentInvoice.sections?.length > 0 && currentInvoice.sections[0]?.items.length > 0;
  return (
      <Stack direction="column" className="App" spacing={0}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Invoice />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dashboard" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoice/new" 
            element={
              <ProtectedRoute>
                <InvoiceEditorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoice/edit/:invoiceId" 
            element={
              <ProtectedRoute>
                <InvoiceEditorPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<div>404 - Page Not Found</div>} /> 
        </Routes>
        <Footer />
      </Stack>
      
  )
}

export default App
