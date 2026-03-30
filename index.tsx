import React from 'react';
import ReactDOM from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App';

posthog.init('phx_3sdL9hVErfxHHMwrPRucB0s3GtdpaEjFTpBVC9dNcbWIDC', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
