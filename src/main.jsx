import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FractionsFactory from '../FractionsFactory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FractionsFactory />
  </StrictMode>,
)
