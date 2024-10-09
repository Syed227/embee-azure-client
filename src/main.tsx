import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import msalConfig from './authConfig.ts'; // Ensure this path is correct based on your project structure

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </MsalProvider>
  </BrowserRouter>
);
