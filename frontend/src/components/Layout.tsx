import { createContext, useState, useContext, useEffect } from "react";

import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";

// Create dark mode context
export const DarkModeContext = createContext({ darkMode: false, toggleDarkMode: () => {} });

export const useDarkMode = () => useContext(DarkModeContext);

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

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

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="flex h-screen overflow-hidden dark:bg-gray-950 dark:text-white">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } bg-gray-900 text-white flex flex-col p-4 transition-all duration-300`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-6 text-white focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h2 className={`text-2xl font-bold mb-6 ${!sidebarOpen ? "hidden" : "block"}`}>SmartStoxVest</h2>
          <nav className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "font-semibold text-blue-400" : "text-gray-300"
              }
            >
              🏠 {sidebarOpen && "Dashboard"}
            </NavLink>
            <NavLink
              to="/short-term"
              className={({ isActive }) =>
                isActive ? "font-semibold text-blue-400" : "text-gray-300"
              }
            >
              ⚡ {sidebarOpen && "Short-Term"}
            </NavLink>
            <NavLink
              to="/medium-term"
              className={({ isActive }) =>
                isActive ? "font-semibold text-blue-400" : "text-gray-300"
              }
            >
              🔮 {sidebarOpen && "Medium-Term"}
            </NavLink>
            <NavLink
              to="/long-term"
              className={({ isActive }) =>
                isActive ? "font-semibold text-blue-400" : "text-gray-300"
              }
            >
              🧠 {sidebarOpen && "Long-Term"}
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-gray-900 p-6 overflow-auto">
          {/* Topbar */}
          <header className="mb-4 border-b pb-2 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-white">📈 Investment Dashboard</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          {/* Animated Page Content */}
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
