import Home from "./pages/Home";
import Log from "./pages/Log";
import Signed from "./pages/Signed";
import Profile from "./pages/Profile";
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
