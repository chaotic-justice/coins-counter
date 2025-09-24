import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GTProvider } from 'gt-react'
import gtConfig from '../gt.config.json'
import loadTranslations from './lib/loadTranslations.ts'
import dictionary from './dictionary.json'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GTProvider {...gtConfig} loadTranslations={loadTranslations} dictionary={dictionary}>
      <App />
    </GTProvider>
  </StrictMode>,
)
