import { Route, Routes } from "react-router-dom";
import DetailCalPage from "./pages/Detailed";
import MainPage from "./pages/MainPage";
import MultiCalPage from "./pages/MultiPage";
import CalRecord from "./pages/CalRecord";
import BasicCalPage from "./pages/Standad";
import "./styles/root.css";
import HelpPage from "./pages/HelpPage";
import MinimumSalary from "./pages/MinimumSalary";
import { useEffect } from "react";

function App() {
  useEffect(() => {}, []);
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/standard" element={<BasicCalPage />} />
      <Route path="/detailed" element={<DetailCalPage />} />
      <Route path="/multi" element={<MultiCalPage />} />
      <Route path="/minimum_salary" element={<MinimumSalary />} />
      <Route path="/calrecord" element={<CalRecord />} />
      <Route path="/help/*" element={<HelpPage />} />
    </Routes>
  );
}

export default App;
