// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { TimerProvider } from './pages/TimerContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TimerProvider>
       <App />
     </TimerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
