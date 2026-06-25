import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store/store.ts'
import { Notification } from '@/components/ui/Notification.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "MISSING_CLIENT_ID"}>
        <App />
        <Notification />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
