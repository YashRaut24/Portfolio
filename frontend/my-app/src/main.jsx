import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
import '@fontsource/comfortaa/400.css';
import '@fontsource/comfortaa/700.css';
import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';
import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
  </StrictMode>
)
