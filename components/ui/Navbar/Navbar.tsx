'use client';

import { useEffect, useState } from 'react';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((prev) => !prev);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <nav
      className={s.root}
      style={{
        transform: tick ? 'translateY(-18px)' : 'translateY(0)',
        opacity: tick ? 0.45 : 1,
        transition: 'transform 300ms ease, opacity 300ms ease'
      }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-6">
        <div className="pointer-events-auto pt-5">
          <div className="relative">
            <div
              className="absolute -bottom-8 left-1/2 z-[999] -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: tick ? '#dc2626' : '#0f172a' }}
            >
              {tick ? 'NAV ACTIVE B' : 'NAV ACTIVE A'}
            </div>

            <Navlinks />
          </div>
        </div>
      </div>
    </nav>
  );
}