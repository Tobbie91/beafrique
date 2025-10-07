// ✅ Works with strict TS configs
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ScrollToTop />
    <HelmetProvider>
      <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);