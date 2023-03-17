import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import { PopUpGlobal } from "./components/common/popup";
import Footer from "./components/layout/Footer";
import "./styles/public.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <PopUpGlobal />
        <App />
        <Footer />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
