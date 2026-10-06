import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './finanzas.css';
import { FinanzasPage } from './FinanzasPage';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root en index.html');

createRoot(root).render(
  <StrictMode>
    <FinanzasPage />
  </StrictMode>,
);
