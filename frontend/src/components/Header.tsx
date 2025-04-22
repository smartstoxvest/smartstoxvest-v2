import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SmartStoxVest 📊</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Smart Investing Made Simple</p>
    </header>
  );
};

export default Header;
