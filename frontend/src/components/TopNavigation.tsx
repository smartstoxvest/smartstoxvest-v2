// src/components/TopNavigation.tsx
import { Link, useLocation } from "react-router-dom";

const TopNavigation = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-1 rounded font-medium ${
      pathname === path ? "bg-blue-600 text-white" : "text-blue-700 hover:underline"
    }`;

  return (
    <div className="flex justify-end gap-4 px-6 py-3 bg-gray-100 border-b">
      <Link to="/app/short-term" className={linkClass("/app/short-term")}>Short-Term</Link>
      <Link to="/app/medium-term" className={linkClass("/app/medium-term")}>Medium-Term</Link>
      <Link to="/app/long-term" className={linkClass("/app/long-term")}>Long-Term</Link>
	  <Link to="/app/blog" className={linkClass("/app/blog")}>Blog</Link>
      <Link to="/" className="text-gray-600 hover:underline">🏠 Home</Link>
    </div>
  );
};

export default TopNavigation;
