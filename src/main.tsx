import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { BrowserRouter } from "react-router";
import App from '@/App.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { ThemeProvider } from './components/theme-provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
    <Toaster expand={true} visibleToasts={5} />
  </StrictMode>,
)
