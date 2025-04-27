import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes'; // ✅ Use only what you need

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
