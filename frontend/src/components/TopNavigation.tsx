// src/components/TopNavigation.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // optional: install lucide-react for icons

const TopNavigation = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded font-medium ${
      pathname === path ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-gray-100 border-b">
      {/* Top bar */}
      <div className="flex justify-between items-center px-4 py-3 md:px-6">
        <Link to="/" className="font-bold text-blue-800 text-lg">SmartStoxVest</Link>
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Links (always visible on md+, collapsible on mobile) */}
      <div className={`md:flex ${isOpen ? "block" : "hidden"} px-4 md:px-6 pb-4 md:pb-0`}>
        <Link to="/app/short-term" className={linkClass("/app/short-term")}>Short-Term</Link>
        <Link to="/app/medium-term" className={linkClass("/app/medium-term")}>Medium-Term</Link>
        <Link to="/app/long-term" className={linkClass("/app/long-term")}>Long-Term</Link>
        <Link to="/app/blog" className={linkClass("/app/blog")}>Blog</Link>
        <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">🏠 Home</Link>
      </div>
    </nav>
  );
};

export default TopNavigation;
