'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
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

const ACCOUNT_HREF = '/account';

function getDashboardHrefFromPlan(planId?: string | null) {
  if (!planId) return '/choose-plan';

  if (planId === 'free') {
    return '/dashboard/free';
  }

  if (
    planId === 'pro' ||
    planId === 'pro_monthly' ||
    planId === 'pro_yearly' ||
    planId === 'pro_lifetime'
  ) {
    return '/dashboard/pro';
  }

  if (
    planId === 'business' ||
    planId === 'business_monthly' ||
    planId === 'business_yearly' ||
    planId === 'enterprise' ||
    planId === 'enterprise_monthly' ||
    planId === 'enterprise_yearly'
  ) {
    return '/dashboard/business';
  }

  return '/choose-plan';
}

export default function Navlinks({ user, isDark = false }: NavlinksProps) {
  const pathname = usePathname();
  const isChoosePlanPage = pathname === '/choose-plan';

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [dashboardHref, setDashboardHref] = useState('/choose-plan');

  function expireSessionAndReturnHome() {
    setAccountMenuOpen(false);
    clearAuthSession();
    window.dispatchEvent(new Event('skysirv-auth-changed'));
    window.location.href = '/';
  }

  function signOutAndReturnHome() {
    setAccountMenuOpen(false);
    clearAuthSession();
    window.dispatchEvent(new Event('skysirv-auth-changed'));
    window.location.href = '/';
  }

  function openSigninModal() {
    setAccountMenuOpen(false);
    setCreateAccountModalOpen(true);
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
        expireSessionAndReturnHome();
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

        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/account') ||
          pathname.startsWith('/admin')
        ) {
          window.location.href = '/';
        }

        return;
      }

      const lastActivity = sessionStorage.getItem(AUTH_LAST_ACTIVITY_KEY);

      if (lastActivity) {
        const inactiveFor = Date.now() - Number(lastActivity);

        if (inactiveFor > SESSION_TIMEOUT_MS) {
          expireSessionAndReturnHome();
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

          if (
            pathname.startsWith('/dashboard') ||
            pathname.startsWith('/account') ||
            pathname.startsWith('/admin')
          ) {
            window.location.href = '/';
          }

          return;
        }

        const data = await res.json();
        const loggedIn = !!data.user?.id;
        const admin = data.user?.is_admin === true;
        const nextDashboardHref = getDashboardHrefFromPlan(data.subscription?.plan_id);

        if (!isMounted) return;

        setIsLoggedIn(loggedIn);
        setIsAdmin(admin);
        setDashboardHref(nextDashboardHref);
        setIsSessionReady(true);
        setAuthAdmin(admin);
      } catch {
        if (!isMounted) return;

        setIsLoggedIn(false);
        setIsAdmin(false);
        clearAuthSession();
        setIsSessionReady(true);

        if (
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/account') ||
          pathname.startsWith('/admin')
        ) {
          window.location.href = '/';
        }
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
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current) return;

      if (!dropdownRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSessionReady) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get('signin') !== '1') return;

    const authMode = params.get('auth');
    const resetToken = params.get('token');
    const isPasswordResetFlow = authMode === 'reset-password' && !!resetToken;

    if (!isPasswordResetFlow) {
      const cleanUrl = `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState({}, '', cleanUrl || '/');
    }

    setAccountMenuOpen(false);

    if (isLoggedIn && !isPasswordResetFlow) {
      window.location.href = isAdmin ? '/admin' : dashboardHref;
      return;
    }

    setCreateAccountModalOpen(true);
  }, [isSessionReady, isLoggedIn, isAdmin, dashboardHref]);

  return (
    <>
      <div className="pointer-events-auto pt-4 md:pt-5">
        <div
          className={`relative mx-auto flex max-w-5xl items-center justify-between rounded-full px-6 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.10)] ${isDark
            ? 'border border-white/10 bg-slate-900/80 backdrop-blur'
            : 'border border-white/50 bg-white/75 backdrop-blur-xl'
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

          <div className="relative flex items-center" ref={dropdownRef}>
            {isSessionReady && (
              <>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((current) => !current)}
                  aria-label="Open navigation menu"
                  aria-expanded={accountMenuOpen}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isLoggedIn
                    ? isDark
                      ? 'border-white/20 bg-white text-slate-950 hover:bg-slate-200'
                      : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-700'
                    : isDark
                      ? 'border-white/15 bg-white/10 text-white hover:bg-white/15'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                    }`}
                >
                  <svg
                    className="md:hidden"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 7H20M4 12H20M4 17H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <svg
                    className="hidden md:block"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21C20 17.6863 16.4183 15 12 15C7.58172 15 4 17.6863 4 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                {accountMenuOpen && (
                  <div
                    className={`absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border py-2 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.18)] ${isDark
                      ? 'border-white/10 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-800'
                      }`}
                  >
                    {!isLoggedIn && (
                      <div className="md:hidden">
                        <Link
                          href="/pricing"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Pricing
                        </Link>

                        <Link
                          href="/booking"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Booking
                        </Link>

                        <Link
                          href="/flight-attendant"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Flight Attendant
                        </Link>

                        <Link
                          href="/beta"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Beta
                        </Link>

                        <div className={`my-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />
                      </div>
                    )}

                    {!isLoggedIn ? (
                      <button
                        type="button"
                        onClick={openSigninModal}
                        className={`block w-full px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                          }`}
                      >
                        Sign In
                      </button>
                    ) : (
                      <>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountMenuOpen(false)}
                            className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                              }`}
                          >
                            Admin
                          </Link>
                        )}

                        {!isAdmin && !isChoosePlanPage && (
                          <Link
                            href={dashboardHref}
                            onClick={() => setAccountMenuOpen(false)}
                            className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                              }`}
                          >
                            Dashboard
                          </Link>
                        )}

                        {!isAdmin && (
                          <Link
                            href={ACCOUNT_HREF}
                            onClick={() => setAccountMenuOpen(false)}
                            className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                              }`}
                          >
                            Account
                          </Link>
                        )}

                        <div className={`my-1 h-px ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />

                        <button
                          type="button"
                          onClick={signOutAndReturnHome}
                          className={`block w-full px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
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
          onSigninComplete={async (payload) => {
            setCreateAccountModalOpen(false);

            if (payload.user?.is_admin === true) {
              setIsLoggedIn(true);
              setIsAdmin(true);
              setAuthAdmin(true);
              window.location.assign('/admin');
              return;
            }

            window.dispatchEvent(new Event('skysirv-auth-changed'));

            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
                headers: {
                  Authorization: `Bearer ${payload.token}`,
                },
              });

              const data = await res.json().catch(() => null);

              if (!res.ok || !data?.user) {
                window.location.href = '/choose-plan';
                return;
              }

              window.location.href = getDashboardHrefFromPlan(data.subscription?.plan_id);
            } catch {
              window.location.href = '/choose-plan';
            }
          }}
          onSignupComplete={() => setCreateAccountModalOpen(false)}
        />
      </AuthModal>
    </>
  );
}