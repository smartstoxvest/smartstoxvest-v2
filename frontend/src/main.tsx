import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core'; // ✅ Import this
import { AuthProvider } from "@/contexts/AuthContext";

const isNative = Capacitor.isNativePlatform(); // ✅ Accurate check for native (iOS/Android)



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      {isNative ? (
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      ) : (
        <BrowserRouter basename="/app">
          <AppRoutes />
        </BrowserRouter>
      )}
    </AuthProvider>
  </React.StrictMode>
);