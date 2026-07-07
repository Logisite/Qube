import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Stub to handle MetaMask extension in sandboxed iframes and prevent browser errors
if (typeof window !== 'undefined') {
  // Catch MetaMask and other unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && (
      (event.reason.message && event.reason.message.includes('MetaMask')) ||
      (event.reason.message && event.reason.message.includes('ethereum')) ||
      event.reason.toString().includes('MetaMask')
    )) {
      event.preventDefault();
      console.warn('Silenced MetaMask promise rejection:', event.reason);
    }
  });

  // Catch general errors and silence them if they refer to MetaMask
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('MetaMask') ||
      event.message.includes('ethereum')
    )) {
      event.preventDefault();
      console.warn('Silenced MetaMask console error:', event.message);
    }
  });

  // If a script tries to look for ethereum, give it a mock safe object to prevent connection crashes
  if (!(window as any).ethereum) {
    (window as any).ethereum = {
      isMetaMask: true,
      request: async (args: { method: string; params?: any[] }) => {
        console.log('Mock MetaMask request called:', args.method);
        if (args.method === 'eth_requestAccounts' || args.method === 'eth_accounts') {
          return ['0x0000000000000000000000000000000000000000'];
        }
        return null;
      },
      on: () => {},
      removeListener: () => {},
    };
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

