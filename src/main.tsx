import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Setup global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[GLOBAL ERROR]', event.error?.message || event.message);
    console.error('[STACK]', event.error?.stack);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[UNHANDLED REJECTION]', event.reason);
    if (event.reason instanceof Error) {
      console.error('[STACK]', event.reason.stack);
    }
  });

  // Log when the script starts
  console.log('[MAIN] Script loaded, DOM ready state:', document.readyState);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[MAIN] FATAL: root element not found');
  document.body.innerHTML = '<div style="color:red;padding:20px;">FATAL: No root element</div>';
} else {
  console.log('[MAIN] Root element found, starting React render');
  
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('[MAIN] React render successful');
  } catch (error) {
    console.error('[MAIN] React render failed:', error);
    if (error instanceof Error) {
      rootElement.innerHTML = `<div style="color:red;padding:20px;white-space:pre-wrap;font-family:monospace;">
Error: ${error.message}

${error.stack}
      </div>`;
    }
  }
}// Force deployment trigger
