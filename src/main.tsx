import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logger } from '@/lib/logger'

createRoot(document.getElementById("root")!).render(<App />);

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        logger.info('PWA service worker registered: ', registration.scope)
      })
      .catch((error) => {
        logger.warn('PWA service worker registration failed: ', error)
      });
  });
}
