import { Route, Routes } from "react-router-dom";
import DetailCalPage from "./pages/Detailed";
import MainPage from "./pages/MainPage";
import MultiCalPage from "./pages/MultiPage";
import CalRecord from "./pages/CalRecord";
import BasicCalPage from "./pages/Standad";
import "./styles/root.css";

function App() {
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/standard" element={<BasicCalPage />} />
      <Route path="/detailed" element={<DetailCalPage />} />
      <Route path="/multi" element={<MultiCalPage />} />
      <Route path="/calrecord" element={<CalRecord />} />
    </Routes>
  );
}

export default App;
