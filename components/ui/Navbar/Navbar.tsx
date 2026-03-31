'use client';

import { useEffect, useRef, useState } from 'react';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      if (currentScrollY <= 24) {
        setHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={s.root}
      style={{
        transform: hidden ? 'translateY(-120%)' : 'translateY(0)',
        opacity: hidden ? 0 : 1,
        transition: 'transform 240ms ease, opacity 240ms ease'
      }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-6">
        <Navlinks />
      </div>
    </nav>
  );
}