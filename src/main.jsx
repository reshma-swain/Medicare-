// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/styles.css'; // <- your CSS

// optional init (image fallbacks, focus styles)
import { initSite } from './utils/init';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// run small DOM helpers after a short delay
setTimeout(() => {
  if (typeof initSite === 'function') initSite();
}, 200);
