'use client';

import { useEffect, useState } from 'react';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  const [hasScrolled, setHasScrolled] = useState(false);

  /**
   * Public-site direction:
   * Keep the navbar light across the main public pages.
   *
   * Individual pages can still have their own hero/background styling,
   * but the shared navbar now stays consistent with the new Booking page.
   */
  const isDark = false;

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={s.root}
      style={{
        transform: 'translateY(0)',
        opacity: 1,
        pointerEvents: 'auto',
        transition:
          'background-color 260ms ease, border-color 260ms ease, box-shadow 260ms ease, backdrop-filter 260ms ease',
      }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="w-full">
        <Navlinks isDark={isDark} hasScrolled={hasScrolled} />
      </div>
    </nav>
  );
}