import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppContextProvider } from "./context/AppContext/index.tsx";
import { SessionStorageProvider } from "./context/SessionStorageContext/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <SessionStorageProvider>
        <App />
      </SessionStorageProvider>
    </AppContextProvider>
  </React.StrictMode>
);
