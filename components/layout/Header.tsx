
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white capitalize truncate max-w-[150px] sm:max-w-none">
          Professional RF Suite
        </h2>
      </div>
      
      <div className="flex items-center space-x-2 lg:space-x-6">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          title="Toggle Theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium dark:text-white">Admin Engineer</span>
            <span className="text-xs text-gray-500">Tier: Enterprise</span>
          </div>
          <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600" alt="Profile" />
        </div>
      </div>
    </header>
  );
};
