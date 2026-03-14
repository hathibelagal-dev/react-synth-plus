import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Showcase from '../examples/Showcase.jsx'
import './index.css'

const RootComponent = import.meta.env.VITE_SHOWCASE === 'true' ? Showcase : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)
