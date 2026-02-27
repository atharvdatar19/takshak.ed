import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { trackEvent } from "./lib/analytics"

trackEvent("app_booted")

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
