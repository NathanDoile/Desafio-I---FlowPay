import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://ca230bf25474b92c862e2e5204afaf59@o4511927711563776.ingest.us.sentry.io/4511927734304768",

  dataCollection: {},
  
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  
  tracesSampleRate: 1.0, 
  
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
