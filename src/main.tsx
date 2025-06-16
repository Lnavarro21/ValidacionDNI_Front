import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioUSMP from './FormularioUSMP';
import InscripcionLinea from './InscripcionLinea';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormularioUSMP />} />
        <Route path="/inscripcion" element={<InscripcionLinea />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
