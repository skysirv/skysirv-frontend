'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import s from './Navbar.module.css';
import AuthModal from '@/components/auth/AuthModal';
import CreateAccountForm from '@/components/auth/CreateAccountForm';

interface NavlinksProps {
  user?: any;
  isDark?: boolean;
}

export default function Navlinks({ user, isDark = false }: NavlinksProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);

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

    const handleFocus = () => checkSession();
    const handleStorage = () => checkSession();
    const handleAuthChanged = () => checkSession();

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
    <>
      <div className="pointer-events-auto pt-4 md:pt-5">
        <div
          className={`relative mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)] ${isDark
              ? 'border border-white/10 bg-slate-900/80 backdrop-blur'
              : 'border border-slate-200 bg-white'
            }`}
        >
          <div className="flex items-center translate-y-[1px] -translate-x-3">
            <Link href="/" className={s.logo} aria-label="Skysirv" style={{ marginLeft: '-22px' }}>
              <span style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <img
                  src={
                    isDark
                      ? '/branding/logo/skysirv-logo-white.svg'
                      : '/branding/logo/skysirv-logo.svg'
                  }
                  alt="Skysirv"
                  style={{ width: '180px', height: 'auto', display: 'block' }}
                />
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            {isLoggedIn && isAdmin && (
              <Link
                href="/admin"
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                  }`}
              >
                Admin
              </Link>
            )}

            {isLoggedIn && !isAdmin && (
              <Link
                href="/dashboard"
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                  }`}
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
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                  }`}
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/signin"
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                  }`}
              >
                Sign in
              </Link>
            )}

            {!isLoggedIn && (
              <button
                type="button"
                onClick={() => setCreateAccountModalOpen(true)}
                className="rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-semibold transition hover:bg-slate-200"
              >
                Create account
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        open={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        title="Create your Skysirv™ account"
        description="Start monitoring airfare with real travel intelligence"
        maxWidthClassName="max-w-sm"
      >
        <CreateAccountForm />
      </AuthModal>
    </>
  );
}