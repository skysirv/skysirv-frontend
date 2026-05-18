'use client';

import { useEffect, useRef, useState } from 'react';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

const BETA_BANNER_STORAGE_KEY = 'skysirv_beta_banner_dismissed';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [showBetaBanner, setShowBetaBanner] = useState(false);
  const lastScrollY = useRef(0);

  /**
   * Public-site direction:
   * Keep the navbar light across the main public pages.
   *
   * Individual pages can still have their own hero/background styling,
   * but the shared navbar now stays consistent with the new Booking page.
   */
  const isDark = false;

  useEffect(() => {
    const dismissed =
      window.sessionStorage.getItem(BETA_BANNER_STORAGE_KEY) === 'true';

    setShowBetaBanner(!dismissed);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setHidden(false);
      lastScrollY.current = currentScrollY;
      return;

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

  const dismissBetaBanner = () => {
    window.sessionStorage.setItem(BETA_BANNER_STORAGE_KEY, 'true');
    setShowBetaBanner(false);
  };

  return (
    <nav
      className={s.root}
      style={{
        transform: hidden ? 'translateY(-64px)' : 'translateY(0)',
        opacity: 1,
        transition:
          'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
      }}
    >
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      {showBetaBanner ? (
        <div className="relative z-50 flex h-9 pointer-events-auto items-center justify-center overflow-hidden bg-[#10103a]/90 backdrop-blur-xl px-10 text-center text-[11px] font-medium text-white shadow-sm sm:min-h-[40px] sm:px-12 sm:py-2 sm:text-[13px]">
          <p className="max-w-full truncate whitespace-nowrap leading-none">
            <span className="font-semibold">Skysirv Public Beta</span>
            <span className="mx-1.5 text-white/45">·</span>
            <span className="text-white/85">
              Airfare intelligence in progress
            </span>
          </p>

          <button
            type="button"
            aria-label="Dismiss beta banner"
            onClick={dismissBetaBanner}
            className="absolute right-2 top-1/2 z-[60] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white pointer-events-auto sm:right-4"
          >
            <span className="text-lg leading-none sm:text-xl">×</span>
          </button>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-6">
        <Navlinks isDark={isDark} />
      </div>
    </nav>
  );
}