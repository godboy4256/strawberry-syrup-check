import { createRoot } from "react-dom/client";
import React from "react";
import "./styles/public.css";
import Footer from "./components/layout/footer";
import MainPage from "./pages/mainPage";
const App = () => {
  return (
    <div id="app_container">
      <MainPage />
      <Footer />
    </div>
  );
};
createRoot(document.getElementById("root")).render(<App />);
