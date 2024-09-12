import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AgentProfile from './Components/AgentProfile.jsx'
import Agora from './Agora.jsx'

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AgoraRTCProvider client={client}>
      <BrowserRouter>
        <Routes >
          <Route path='/' element={<App />} />
          <Route path='/agora' element={<Agora />} />
          <Route path='/agent/:uid' element={<AgentProfile />} />
        </Routes>
      </BrowserRouter>
    </AgoraRTCProvider>
  </StrictMode>
)
