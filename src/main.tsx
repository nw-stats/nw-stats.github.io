import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { SeasonProvider } from './components/provider/seasonprovider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SeasonProvider>
      <App />
    </SeasonProvider>
  </React.StrictMode>
);
