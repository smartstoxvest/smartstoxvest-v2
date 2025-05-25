import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";

// 👇 Define user type here or import it from hooks/useAuth if declared there
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});
export const useDarkMode = () => useContext(DarkModeContext);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const { user, loading } = useAuth() as AuthContextType;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/auth");
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden dark:bg-gray-950 dark:text-white">
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? "w-64" : "w-16"
          } bg-gray-900 text-white flex-col p-4 transition-all duration-300`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 text-white focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h2 className={`text-2xl font-bold mb-6 ${!sidebarOpen ? "hidden" : "block"}`}>
            SmartStoxVest
          </h2>
        </aside>

        <main className="flex-1 bg-white dark:bg-gray-900 p-6 overflow-auto">
          <Navbar />

          <header className="mb-4 border-b pb-2 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">
              📈 Investment Dashboard
            </h1>

            <div className="flex items-center gap-4">
              {!loading && user && (
                <div className="text-sm flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-200">👋 {user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 text-sm underline ml-2 hover:text-red-800"
                  >
                    🔓 Logout
                  </button>
                </div>
              )}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </DarkModeContext.Provider>
  );
};

export default Layout;
