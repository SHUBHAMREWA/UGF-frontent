import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './hideErrorOverlay.css'; // Hide React dev error overlay for API errors
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import "./context/interceptorSetup.js"

// 🛡️ AGGRESSIVE Global Error Handler - Prevents ALL API errors from showing React error overlay
if (process.env.NODE_ENV === 'development') {
  // Suppress unhandled promise rejections (axios errors)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Check if it's ANY kind of network/API error
    const isApiError = 
      error?.isAxiosError ||
      error?.isTimeout ||
      error?.captchaRequired ||
      error?.captchaBlocked ||
      error?.response?.status >= 400 ||
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ERR_NETWORK' ||
      error?.message?.toLowerCase()?.includes('timeout') ||
      error?.message?.toLowerCase()?.includes('network') ||
      error?.message?.toLowerCase()?.includes('request failed') ||
      error?.message?.toLowerCase()?.includes('404') ||
      error?.message?.toLowerCase()?.includes('403') ||
      (typeof error === 'object' && error !== null && 'config' in error); // Axios error
    
    if (isApiError) {
      console.warn('🔇 API error suppressed (no overlay):', error?.message || error?.code || 'Unknown');
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Also suppress regular errors that might be from async functions
  window.addEventListener('error', (event) => {
    if (event.message?.toLowerCase()?.includes('timeout')) {
      console.warn('🔇 Timeout error suppressed');
      event.preventDefault();
      return false;
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
