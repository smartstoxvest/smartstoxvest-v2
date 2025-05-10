
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ShortTerm from "@/pages/ShortTerm";
import MediumTerm from "@/pages/MediumTerm";
import LongTerm from "@/pages/LongTerm";
import Dashboard from "@/pages/Dashboard"; // ✅ Added Dashboard import
import RecommendedTools from "@/pages/RecommendedTools";

const AppRoutes = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-6 border-b pb-4 flex gap-6 text-lg">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🏠 Dashboard</NavLink>
          <NavLink to="/short-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📊 Short-Term</NavLink>
          <NavLink to="/medium-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🔮 Medium-Term</NavLink>
          <NavLink to="/long-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📉 Long-Term</NavLink>
          <NavLink to="/tools" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🧰 Tools</NavLink> {/* 👈 New Nav */}
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/short-term" element={<ShortTerm />} />
          <Route path="/medium-term" element={<MediumTerm />} />
          <Route path="/long-term" element={<LongTerm />} />
          <Route path="/tools" element={<RecommendedTools />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
