import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { registerServiceWorker } from "./registerSW"

// Enregistrer le service worker pour la PWA
registerServiceWorker()
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
