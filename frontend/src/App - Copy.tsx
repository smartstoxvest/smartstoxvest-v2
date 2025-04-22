import { BrowserRouter, Routes, Route } from "react-router-dom";
import MediumTerm from "./pages/MediumTerm";
import Navbar from "./components/Navbar"; // optional, if you want to show nav
import Home from "./pages/Home"; // optional if you want a homepage

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Optional: if you’ve created it */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* if Home.tsx exists */}
        <Route path="/medium" element={<MediumTerm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
