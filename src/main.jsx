import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Redux Provider aur Store import karein
import { Provider } from 'react-redux'
import { store } from '../src/store/store.js' // Path check karlein: src/app/store.js

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)