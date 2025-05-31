import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Add this

const isNative = Capacitor.isNativePlatform();

// ✅ Load from .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
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
    </GoogleOAuthProvider>
  </React.StrictMode>
);
