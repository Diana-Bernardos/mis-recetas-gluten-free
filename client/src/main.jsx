import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// --- HYBRID DEPLOYMENT CONFIG ---
// If we are in production (Vercel), we still want to talk to the LOCAL backend
// because Ollama and SQLite are on the user's machine.
if (import.meta.env.PROD) {
  axios.defaults.baseURL = 'http://localhost:3000';
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
