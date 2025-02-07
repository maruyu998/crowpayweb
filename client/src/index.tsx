import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <CookiesProvider >
      <App />
    </CookiesProvider>
  // </React.StrictMode>
);

if('serviceWorker' in navigator){
  window.addEventListener('load', function() {
    (navigator as any).serviceWorker.register('/sw.js')
    .then((registration:ServiceWorkerRegistration)=>{
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch((error:unknown) => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}