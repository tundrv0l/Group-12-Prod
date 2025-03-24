import React from 'react';
import ReactDOM from 'react-dom/client';
import { Grommet } from 'grommet';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Disable browser scroll restoration - fixed to use window.history
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Grommet>
      <App />
    </Grommet>
  </React.StrictMode>
);

reportWebVitals();