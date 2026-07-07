import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { StudentProvider } from './context/StudentContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StudentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StudentProvider>
    </AuthProvider>
  </StrictMode>,
)
