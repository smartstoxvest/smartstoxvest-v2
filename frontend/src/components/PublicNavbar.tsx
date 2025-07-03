import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* 🧠 Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            className="h-8 w-auto"
            alt="SmartStoxVest"
          />
          <span className="text-xl font-bold text-blue-900">SmartStoxVest</span>
        </div>

        {/* 🧠 Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-blue-700">
          <a href="#mission" className="hover:text-blue-500">Mission</a>
          <a href="#team" className="hover:text-blue-500">Team</a>
          <a href="#features" className="hover:text-blue-500">Features</a>
          <a href="https://smart-portfolio-tracker.netlify.app/" className="hover:text-blue-500">PortFolio Tracker</a>
          <a href="#feedback" className="hover:text-blue-500">Feedback</a>
          <a href="/app/blog" className="hover:text-blue-500">Blog</a>
          <a href="#FAQ" className="hover:text-blue-500">FAQ</a>
          <a href="/SmartStoxVest_User_Manual.pdf" download className="text-blue-600 underline">User Manual</a>
        </nav>

        {/* 🍔 Mobile Menu Button */}
        <button
          className="md:hidden text-blue-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-sm font-medium text-blue-700">
          <a href="#mission" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Mission</a>
          <a href="#team" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Team</a>
          <a href="#features" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Features</a>
          <a href="#feedback" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">Feedback</a>
          <a href="/app/blog" className="hover:text-blue-500">Blog</a> {/* ✅ Fixed */}
          <a href="#FAQ" onClick={() => setMenuOpen(false)} className="block hover:text-blue-500">FAQ</a>
          <a href="/SmartStoxVest_User_Manual.pdf" download onClick={() => setMenuOpen(false)} className="block text-blue-600 underline">User Manual</a>
        </div>
      )}
    </header>
  );
}
