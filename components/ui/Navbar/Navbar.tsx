'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const pathname = usePathname();
  const isDark = pathname === '/pricing' || pathname === '/booking' || pathname === '/beta';

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

      if (currentScrollY - lastScrollY.current > 6 && currentScrollY > 80) {
        setHidden(true);
      } else if (lastScrollY.current - currentScrollY > 6) {
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
        transform: hidden ? 'translateY(-80%)' : 'translateY(0)',
        opacity: hidden ? 0 : 1,
        transition:
          'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
      }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-6">
        <Navlinks isDark={isDark} />
      </div>
    </nav>
  );
}