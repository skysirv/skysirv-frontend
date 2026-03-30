'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark') {
      root.classList.add('dark');
      setDark(true);
    } else {
      root.classList.remove('dark');
      setDark(false);
    }
  }, []);

  function toggleTheme() {
    const root = document.documentElement;

    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex h-7 w-14 items-center rounded-full p-1 transition-colors duration-300 ${
        dark ? 'bg-slate-800' : 'bg-slate-200'
      }`}
    >
      {/* Sun icon */}
      <div className="absolute left-2 flex items-center justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`${dark ? 'text-slate-400' : 'text-slate-700'}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </div>

      {/* Moon icon */}
      <div className="absolute right-2 flex items-center justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${dark ? 'text-white' : 'text-slate-500'}`}
        >
          <path d="M21 12.79A9 9 0 1111.21 3c0 .34.02.67.05 1A7 7 0 0021 12.79z" />
        </svg>
      </div>

      {/* Slider */}
      <div
        className={`h-5 w-5 rounded-full shadow-md transition-transform duration-300 ${
          dark ? 'translate-x-7 bg-white' : 'translate-x-0 bg-slate-800'
        }`}
      />
    </button>
  );
}