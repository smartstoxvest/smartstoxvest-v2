import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ShortTerm from "@/pages/ShortTerm";
import MediumTerm from "@/pages/MediumTerm";
import LongTerm from "@/pages/LongTerm";
import Dashboard from "@/pages/Dashboard";
import RecommendedTools from "@/pages/RecommendedTools";
import NewPost from "@/pages/NewPost";
import EditPost from "@/pages/EditPost";
import Blog from "@/pages/Blog"; 
import BlogDetail from "@/pages/BlogDetail";
import AdminLogin from "@/pages/AdminLogin";
import RequireAdmin from "@/components/RequireAdmin";
import { useEffect, useState } from "react";

const AppRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expected = import.meta.env.VITE_ADMIN_TOKEN;
    console.log("🌐 TOKEN:", token);
    console.log("✅ EXPECTED:", expected);
    console.log("🔐 isAdmin:", token === expected);
    setIsAdmin(token === expected);
  }, []);

  return (
    <Router>
      <div className="p-4">
        <nav className="mb-6 border-b pb-4 flex gap-6 text-lg">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🏠 Dashboard</NavLink>
          <NavLink to="/short-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📊 Short-Term</NavLink>
          <NavLink to="/medium-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🔮 Medium-Term</NavLink>
          <NavLink to="/long-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📉 Long-Term</NavLink>
          <NavLink to="/tools" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🧰 Tools</NavLink>
          {isAdmin && (
            <NavLink to="/admin/new-post" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🛠️ New Post</NavLink>
          )}
          <NavLink to="/blog" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📝 Blog</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/short-term" element={<ShortTerm />} />
          <Route path="/medium-term" element={<MediumTerm />} />
          <Route path="/long-term" element={<LongTerm />} />
          <Route path="/tools" element={<RecommendedTools />} />
          
          {/* 🛡 Admin-protected routes */}
          <Route path="/admin/new-post" element={
            <RequireAdmin>
              <NewPost />
            </RequireAdmin>
          } />
          <Route path="/admin/edit/:slug" element={
            <RequireAdmin>
              <EditPost />
            </RequireAdmin>
          } />

          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
