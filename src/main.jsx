import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AgentProfile from './Components/AgentProfile.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<App />} />
        <Route path='/agent' element={<AgentProfile />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
