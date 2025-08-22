import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { HeadProvider } from "react-head";
import './index.css';
import { AuthProvider } from './Context/AuthProvider';
// Importa el registro de PWA
import { registerSW } from 'virtual:pwa-register'

registerSW()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
);