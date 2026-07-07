import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { StudentProvider } from './context/StudentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StudentProvider>
  </StrictMode>,
)
