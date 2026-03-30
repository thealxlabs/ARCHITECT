import React from 'react';
import ReactDOM from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App';

posthog.init('phc_44Ow1DHNtOGD7R5GnHWy58RMUoAfHniU2NkiRrVPaqj', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
