import Home from "./pages/Home";
import Log from "./pages/Log";
import Signed from "./pages/Signed";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<Log />} />
        <Route path="/signed" element={<Signed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
