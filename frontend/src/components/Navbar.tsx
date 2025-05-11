import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expected = import.meta.env.VITE_ADMIN_TOKEN || "my-secret-token";
    const loggedIn = token === expected;

    setIsAdmin(loggedIn);
    setShowWelcome(loggedIn);

    if (loggedIn) {
      const timeout = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setIsAdmin(false);
    navigate("/admin/login");
    alert("🔓 Logged out successfully.");
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex space-x-4">
          <Link to="/" className="text-sm hover:text-blue-600">🏠 Dashboard</Link>
          <Link to="/short-term" className="text-sm hover:text-blue-600">📊 Short-Term</Link>
          <Link to="/medium-term" className="text-sm hover:text-blue-600">🧠 Medium-Term</Link>
          <Link to="/long-term" className="text-sm hover:text-blue-600">📉 Long-Term</Link>
          <Link to="/tools" className="text-sm hover:text-blue-600">💼 Tools</Link>
          <Link to="/blog" className="text-sm font-semibold text-blue-700">📄 Blog</Link>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500 italic">👤 Admin Mode</span>
            <Link to="/admin/new-post" className="text-sm hover:text-blue-600">🛠 New Post</Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              🔒 Logout
            </button>
          </div>
        )}
      </nav>

      {showWelcome && (
        <div className="text-center bg-green-100 text-green-800 py-2 text-sm font-medium">
          ✅ Welcome, Admin! You are now logged in.
        </div>
      )}
    </>
  );
};

export default Navbar;
