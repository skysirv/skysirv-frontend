'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import s from './Navbar.module.css';
import AuthModal from '@/components/auth/AuthModal';
import AuthPanel from '@/components/auth/AuthPanel';
import {
  AUTH_LAST_ACTIVITY_KEY,
  clearAuthSession,
  getAuthAdmin,
  getAuthToken,
  setAuthAdmin,
} from '@/utils/auth-storage';

interface NavlinksProps {
  user?: any;
  isDark?: boolean;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export default function Navlinks({ user, isDark = false }: NavlinksProps) {
  const pathname = usePathname();
  const isChoosePlanPage = pathname === '/choose-plan';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  function signOutSilently() {
    clearAuthSession();
    window.dispatchEvent(new Event('skysirv-auth-changed'));
  }

  function signOutAndReturnHome() {
    clearAuthSession();
    window.dispatchEvent(new Event('skysirv-auth-changed'));
    window.location.href = '/';
  }

  useEffect(() => {
    let isMounted = true;
    let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

    function resetInactivityTimer() {
      const token = getAuthToken();

      if (!token) return;

      sessionStorage.setItem(AUTH_LAST_ACTIVITY_KEY, Date.now().toString());

      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      inactivityTimer = setTimeout(() => {
        signOutSilently();
      }, SESSION_TIMEOUT_MS);
    }

    async function checkSession() {
      const token = getAuthToken();

      if (!token) {
        if (!isMounted) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        clearAuthSession();
        setIsSessionReady(true);
        return;
      }

      const lastActivity = sessionStorage.getItem(AUTH_LAST_ACTIVITY_KEY);

      if (lastActivity) {
        const inactiveFor = Date.now() - Number(lastActivity);

        if (inactiveFor > SESSION_TIMEOUT_MS) {
          signOutAndReturnHome();
          return;
        }
      }

      resetInactivityTimer();

      if (!isMounted) return;

      setIsLoggedIn(true);
      setIsAdmin(getAuthAdmin() === 'true');
      setIsSessionReady(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (!isMounted) return;
          setIsLoggedIn(false);
          setIsAdmin(false);
          clearAuthSession();
          setIsSessionReady(true);
          return;
        }

        const data = await res.json();
        const loggedIn = !!data.user?.id;
        const admin = data.user?.is_admin === true;

        if (!isMounted) return;

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setIsSessionReady(true);
        setAuthAdmin(admin);
      } catch {
        if (!isMounted) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        clearAuthSession();
        setIsSessionReady(true);
      }
    }

    checkSession();

    const handleFocus = () => checkSession();
    const handleStorage = () => checkSession();
    const handleAuthChanged = () => checkSession();

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('skysirv-auth-changed', handleAuthChanged as EventListener);

    return () => {
      isMounted = false;

      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });

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
                  src={isDark ? '/branding/logo/skysirv-logo-white.svg' : '/branding/logo/skysirv-logo.svg'}
                  alt="Skysirv"
                  style={{ width: '180px', height: 'auto', display: 'block' }}
                />
              </span>
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
            <div
              className={`flex items-center gap-6 text-sm font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'
                }`}
            >
              <Link href="/pricing" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                Pricing
              </Link>

              <Link href="/booking" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                Booking
              </Link>

              <Link
                href="/flight-attendant"
                className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}
              >
                Skysirv Flight Attendant™
              </Link>

              <Link href="/beta" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                Skysirv™ Beta
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            {isSessionReady && (
              <>
                {isLoggedIn && isAdmin && (
                  <Link
                    href="/admin"
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                  >
                    Admin
                  </Link>
                )}

                {isLoggedIn && !isAdmin && !isChoosePlanPage && (
                  <Link
                    href="/dashboard"
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                      }`}
                  >
                    Dashboard
                  </Link>
                )}

                {isLoggedIn ? (
                  !isChoosePlanPage ? (
                    <button
                      onClick={signOutAndReturnHome}
                      className={`rounded-full px-3 py-2 text-sm font-medium transition ${isDark ? 'text-white hover:bg-white/10' : 'hover:bg-slate-50'
                        }`}
                    >
                      Sign out
                    </button>
                  ) : null
                ) : (
                  <button
                    type="button"
                    onClick={() => setCreateAccountModalOpen(true)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isDark
                      ? 'bg-white text-slate-900 hover:bg-slate-200'
                      : 'bg-slate-900 text-white hover:bg-slate-700'
                      }`}
                  >
                    Sign in
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        open={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
      >
        <AuthPanel
          onSigninComplete={() => {
            setCreateAccountModalOpen(false)
            window.dispatchEvent(new Event('skysirv-auth-changed'))
          }}
          onSignupComplete={() => setCreateAccountModalOpen(false)}
        />
      </AuthModal>
    </>
  );
}