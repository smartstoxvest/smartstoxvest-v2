import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// 🧠 Define the user type if not already done globally
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth() as AuthContextType;

  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timeout = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setUser(null);
    navigate("/auth");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link to="/" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        🏠 Dashboard
      </Link>
      <Link to="/short-term" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        📈 Short-Term
      </Link>
      <Link to="/medium-term" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        🔮 Medium-Term
      </Link>
      <Link to="/long-term" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        📉 Long-Term
      </Link>
      <Link to="/tools" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        🧰 Tools
      </Link>
      <Link to="/blog" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
        📄 Blog
      </Link>

      {isAdmin && (
        <>
          <Link to="/admin/new-post" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
            🛠 New Post
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 hover:text-blue-600" onClick={onClick}>
            📋 View Users
          </Link>
        </>
      )}

      {user ? (
        <button
          onClick={() => {
            handleLogout();
            onClick?.();
          }}
          className="block px-4 py-2 text-red-600 hover:underline"
        >
          🔒 Logout
        </button>
      ) : (
        <Link to="/auth" className="block px-4 py-2 text-blue-600 hover:underline" onClick={onClick}>
          🔐 Login
        </Link>
      )}
    </>
  );

  return (
    <>
      <nav className="bg-white border-b shadow-sm">
        <div className="flex justify-between items-center px-4 py-3 md:px-8">
          <div className="flex items-center space-x-2">
            <button className="md:hidden text-blue-600" onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center text-blue-700 font-bold text-lg">
              <img src="/favicon.ico" className="w-6 h-6 mr-1" />
              SmartStoxVest
            </Link>
          </div>
          <div className="hidden md:flex space-x-4 text-sm">
            <NavLinks />
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white border-t py-3 shadow-md">
            <NavLinks onClick={toggleMenu} />
          </div>
        )}
      </nav>

      {showWelcome && user && (
        <div className="text-center bg-green-100 text-green-800 py-2 text-sm font-medium">
          ✅ Welcome, {isAdmin ? "👑 Admin" : "User"}!
        </div>
      )}
    </>
  );
};

export default Navbar;
