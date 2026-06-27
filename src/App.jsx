import Home from "./pages/Home";
import Log from "./pages/Log";
import Signed from "./pages/Signed";
import { ThemeProvider } from './pages/ThemeContext';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
     <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<Log />} />
        <Route path="/signed" element={<Signed />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
