import { BrowserRouter as Router, Routes, Route, NavLink, Navigate} from "react-router-dom";
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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      const envToken = import.meta.env.VITE_ADMIN_TOKEN;
      setIsAdmin(token === envToken);
    };

    checkAdmin();

    window.addEventListener("storage", checkAdmin);

    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    window.location.href = "/admin/login";
  };

  return (
    // ✅ Added basename="/app" to tell React Router that this app is hosted at /app on Netlify
    <Router basename="/app">
      <div className="p-4">
        <nav className="mb-6 border-b pb-4 flex gap-6 text-lg items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🏠 Dashboard</NavLink>
          <NavLink to="/short-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📊 Short-Term</NavLink>
          <NavLink to="/medium-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🔮 Medium-Term</NavLink>
          <NavLink to="/long-term" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>📉 Long-Term</NavLink>
          <NavLink to="/tools" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🧰 Tools</NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/new-post" className={({ isActive }) => isActive ? "font-bold text-blue-600" : "text-gray-600"}>🛠️ New Post</NavLink>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline ml-2"
              >
                🔓 Logout
              </button>
            </>
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
          <Route path="/app/admin/new-post" element={
            <RequireAdmin>
              <NewPost />
            </RequireAdmin>
          } />
          <Route path="admin/edit/:slug" element={
            <RequireAdmin>
              <EditPost />
            </RequireAdmin>
          } />

          <Route path="admin/login" element={<AdminLogin />} />

          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* ✅ Catch-all: Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
