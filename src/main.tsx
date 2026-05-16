import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import WorkPage from './views/WorkPage.tsx'
import AboutPage from './views/AboutPage.tsx'
import FooterSakuraTest from './views/FooterSakuraTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/footer-sakura" element={<FooterSakuraTest />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
