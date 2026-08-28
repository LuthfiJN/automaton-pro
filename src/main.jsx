import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Hanya menyisakan index.css tempat Tailwind berada

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);