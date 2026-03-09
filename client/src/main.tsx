import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './app/App.tsx'
import Dashboard from './Pages/Dashboard.tsx'
import NotFoundPage from './Pages/NotFoundPage.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider} from '@react-oauth/google';

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log(VITE_GOOGLE_CLIENT_ID);
const router = createBrowserRouter([
  {path:"/",element:<App />},
  {path:"/dashboard", element:<Dashboard />},
  {path:"*", element:<NotFoundPage />}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider> 
  </StrictMode>,
)