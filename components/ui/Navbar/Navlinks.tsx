'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const token = localStorage.getItem('skysirv_token');

      if (!token) {
        if (!isMounted) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('skysirv_admin');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (!isMounted) return;
          setIsLoggedIn(false);
          setIsAdmin(false);
          localStorage.removeItem('skysirv_admin');
          return;
        }

        const data = await res.json();
        const loggedIn = !!data.user?.id;
        const admin = data.user?.is_admin === true;

        if (!isMounted) return;

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);

        if (admin) {
          localStorage.setItem('skysirv_admin', 'true');
        } else {
          localStorage.removeItem('skysirv_admin');
        }
      } catch {
        if (!isMounted) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('skysirv_admin');
      }
    }

    checkSession();

    const handleFocus = () => {
      checkSession();
    };

    const handleStorage = () => {
      checkSession();
    };

    const handleAuthChanged = () => {
      checkSession();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('skysirv-auth-changed', handleAuthChanged as EventListener);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('skysirv-auth-changed', handleAuthChanged as EventListener);
    };
  }, []);

  return (
    <div className="pointer-events-auto pt-4 md:pt-5">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between rounded-full border border-slate-200 bg-white px-6 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)]">
        <div className="flex items-center translate-y-[1px] -translate-x-3">
          <Link href="/" className={s.logo} aria-label="Skysirv">
            <span style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              <img
                src="/branding/logo/skysirv-logo.svg"
                alt="Skysirv"
                style={{ width: '200px', height: 'auto', display: 'block' }}
              />
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {isLoggedIn && isAdmin && (
            <Link
              href="/admin"
              className={`${s.link} rounded-full px-3 py-2 text-sm font-medium transition hover:bg-slate-50`}
            >
              Admin
            </Link>
          )}

          {isLoggedIn && !isAdmin && (
            <Link
              href="/dashboard"
              className={`${s.link} rounded-full px-3 py-2 text-sm font-medium transition hover:bg-slate-50`}
            >
              Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem('skysirv_token');
                localStorage.removeItem('skysirv_admin');
                window.dispatchEvent(new Event('skysirv-auth-changed'));
                window.location.href = '/';
              }}
              className={`${s.link} rounded-full px-3 py-2 text-sm font-medium transition hover:bg-slate-50`}
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/signin"
              className={`${s.link} rounded-full px-3 py-2 text-sm font-medium transition hover:bg-slate-50`}
            >
              Sign in
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              href="/create-account"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Create account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}