import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { StudentProvider } from './context/StudentContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { MedicalReportsProvider } from './context/MedicalReportsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <MedicalReportsProvider>
          <StudentProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </StudentProvider>
        </MedicalReportsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
