import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/short-term', label: '📈 Short-Term' },
  { path: '/medium-term', label: '📊 Medium-Term' },
  { path: '/long-term', label: '🏦 Long-Term' },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex space-x-4 px-6 py-2 bg-gray-100 dark:bg-gray-800">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-lg text-sm font-medium ${
            location.pathname === item.path
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
