import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyBuildMarker } from './buildInfo';
import './styles.css';

applyBuildMarker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
