import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PopUpGlobal } from "./components/common/popup";
import Footer from "./components/layout/Footer";
import "./styles/public.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PopUpGlobal />
      <App />
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
