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
import LargeChevron from "@/components/ui/LargeChevron"

interface NavlinksProps {
  user?: any;
  isDark?: boolean;
  hasScrolled?: boolean;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const ACCOUNT_HREF = '/account';

const PLAN_WITH_LUCY_DIRECT_LINK_ONLY = true;

const bookMenuItems = [
  {
    label: 'Flights',
    href: '/booking/flights',
    iconSrc: '/images/stock/icons/booking/flights-icon.png',
    description: 'Search smarter flight options with Lucy-powered travel intelligence.',
  },
  {
    label: 'Hotels',
    href: '/booking/hotels',
    iconSrc: '/images/stock/icons/booking/hotels-icon.png',
    description: 'Compare stays by location, comfort, flexibility, and total trip value.',
  },
  {
    label: 'Car rentals',
    href: '/booking/car-rentals',
    iconSrc: '/images/stock/icons/booking/car-icon.png',
    description: 'Plan airport or city pickup with smarter pricing context.',
  },
  {
    label: 'Cruises',
    href: '/booking/cruises',
    iconSrc: '/images/stock/icons/booking/cruises-icon.png',
    description: 'Explore cruise options and future Skysirv cruise planning.',
  },
  {
    label: 'Featured Experiences',
    href: '/booking/featured-experiences',
    iconSrc: '/images/stock/icons/booking/experiences-icon.png',
    description: 'Discover curated travel companies, hidden gems, local experiences, and premium partners.',
  },
];

const planMenuItems = [
  {
    label: 'Generate itinerary',
    href: '/plan-with-lucy/itinerary',
    iconSrc: '/images/stock/icons/lucy-plan/itinerary-icon.png',
    description: 'Build smarter trip flow around flights, stays, cars, cruises, and activities.',
  },
  {
    label: 'Travel preferences',
    href: '/plan-with-lucy/itinerary',
    iconSrc: '/images/stock/icons/lucy-plan/preferences-icon.png',
    description: 'Let Lucy understand how you like to travel and what matters most.',
  },
  {
    label: 'Lucy memory',
    href: '/plan-with-lucy/itinerary',
    iconSrc: '/images/stock/icons/lucy-plan/lucy-memory-icon.png',
    description: 'Personalized planning that improves as Lucy learns your travel style.',
  },
  {
    label: 'Trip ideas',
    href: '/plan-with-lucy/itinerary',
    iconSrc: '/images/stock/icons/lucy-plan/trip-ideas-icon.png',
    description: 'Explore destination ideas, timing strategy, and smarter travel inspiration.',
  },
];

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

export default function Navlinks({
  isDark = false,
  hasScrolled = false,
}: NavlinksProps) {
  const pathname = usePathname();
  const isSkysirvLivePage = pathname.startsWith('/skysirv-live');
  const isPlanWithLucyLabPage = pathname.startsWith('/plan-with-lucy');
  const isBookingLabPage = pathname.startsWith('/booking');
  const isPlanSmarterLabPage = pathname.startsWith('/plan-smarter');
  const isLucyTripLabPage = pathname.startsWith('/lucy-trip');
  const isHomepageLab = pathname === '/';
  const isChoosePlanPage = pathname === '/choose-plan';

  const isBookActive =
    pathname.startsWith('/booking') ||
    pathname === '/hotels' ||
    pathname === '/car-rentals' ||
    pathname === '/cruises';

  const isPlanActive =
    pathname.startsWith('/plan-with-lucy') ||
    pathname === '/itinerary' ||
    pathname === '/travel-preferences' ||
    pathname === '/lucy-memory' ||
    pathname === '/trip-ideas';

  const isLiveActive = pathname.startsWith('/skysirv-live');

  const isPricingActive = pathname === '/pricing';

  const navItemClass = (active: boolean) =>
    `transition ${active
      ? 'text-blue-700'
      : isDark
        ? 'hover:text-white'
        : 'hover:text-slate-900'
    }`;

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const bookMenuCloseTimerRef = useRef<number | null>(null);
  const planMenuCloseTimerRef = useRef<number | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setAuthMode('signin');
    setCreateAccountModalOpen(true);
  }

  function openSignupModal() {
    setAccountMenuOpen(false);
    setAuthMode('signup');
    setCreateAccountModalOpen(true);
  }

  function clearBookMenuCloseTimer() {
    if (bookMenuCloseTimerRef.current) {
      window.clearTimeout(bookMenuCloseTimerRef.current);
      bookMenuCloseTimerRef.current = null;
    }
  }

  function toggleBookMenu() {
    clearBookMenuCloseTimer();
    clearPlanMenuCloseTimer();

    setPlanMenuOpen(false);
    setBookMenuOpen((current) => !current);
  }

  function scheduleCloseBookMenu() {
    clearBookMenuCloseTimer();

    bookMenuCloseTimerRef.current = window.setTimeout(() => {
      setBookMenuOpen(false);
      bookMenuCloseTimerRef.current = null;
    }, 260);
  }

  function clearPlanMenuCloseTimer() {
    if (planMenuCloseTimerRef.current) {
      window.clearTimeout(planMenuCloseTimerRef.current);
      planMenuCloseTimerRef.current = null;
    }
  }

  function togglePlanMenu() {
    clearPlanMenuCloseTimer();
    clearBookMenuCloseTimer();

    setBookMenuOpen(false);
    setPlanMenuOpen((current) => !current);
  }

  function scheduleClosePlanMenu() {
    clearPlanMenuCloseTimer();

    planMenuCloseTimerRef.current = window.setTimeout(() => {
      setPlanMenuOpen(false);
      planMenuCloseTimerRef.current = null;
    }, 260);
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
    setBookMenuOpen(false);
    setPlanMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOpenAuthModal(event: Event) {
      const customEvent = event as CustomEvent<{ mode?: 'signin' | 'signup' }>;

      if (customEvent.detail?.mode === 'signup') {
        openSignupModal();
        return;
      }

      openSigninModal();
    }

    window.addEventListener('skysirv-open-auth-modal', handleOpenAuthModal as EventListener);

    return () => {
      window.removeEventListener('skysirv-open-auth-modal', handleOpenAuthModal as EventListener);
    };
  }, []);

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

  if (
    isSkysirvLivePage ||
    isPlanWithLucyLabPage ||
    isBookingLabPage ||
    isPlanSmarterLabPage ||
    isLucyTripLabPage
  ) {
    return null;
  }

  return (
    <div className="pointer-events-auto">
      <div
        className={`relative w-full border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${hasScrolled
          ? isDark
            ? 'border-white/10 bg-slate-800 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
            : 'border-slate-200/70 bg-white/94 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
          : 'border-transparent bg-transparent shadow-none backdrop-blur-0'
          }`}
      >
        <div className="relative mx-auto flex min-h-[72px] w-full max-w-5xl items-center justify-between px-6 sm:px-8 lg:px-0">
          <div className="flex items-center translate-y-[5px] -translate-x-3 md:translate-y-[1px]">
            <Link href="/" className={s.logo} aria-label="Skysirv" style={{ marginLeft: '-22px' }}>
              <span style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <img
                  src={isDark ? '/branding/logo/skysirv-logo-white.svg' : '/branding/logo/skysirv-logo.svg'}
                  alt="Skysirv"
                  style={{ width: '220px', height: 'auto', display: 'block' }}
                />
              </span>
            </Link>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
            <div
              className={`flex items-center gap-8 text-[16px] font-semibold ${isHomepageLab
                ? 'text-slate-800'
                : isDark
                  ? 'text-white/70'
                  : 'text-slate-600'
                }`}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleBookMenu}
                  className={`inline-flex items-center gap-1.5 ${navItemClass(isBookActive)}`}
                  aria-expanded={bookMenuOpen}
                >
                  Book
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform ${bookMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {bookMenuOpen && (
                  <div
                    onMouseEnter={clearBookMenuCloseTimer}
                    onMouseLeave={scheduleCloseBookMenu}
                    className="absolute left-1/2 top-16 z-50 w-[680px] -translate-x-1/2 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {bookMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setBookMenuOpen(false)}
                          className="group flex items-start gap-4 rounded-[1.1rem] border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                            <img
                              src={item.iconSrc}
                              alt=""
                              aria-hidden="true"
                              className="h-9 w-9 object-contain"
                            />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-slate-950">
                              {item.label}
                            </span>

                            <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                {PLAN_WITH_LUCY_DIRECT_LINK_ONLY ? (
                  <Link
                    href="/plan-with-lucy/itinerary"
                    onClick={() => {
                      setBookMenuOpen(false);
                      setPlanMenuOpen(false);
                    }}
                    className={navItemClass(isPlanActive)}
                  >
                    Plan with Lucy
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={togglePlanMenu}
                    className={`inline-flex items-center gap-1.5 ${navItemClass(isPlanActive)}`}
                    aria-expanded={planMenuOpen}
                  >
                    Plan with Lucy
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform ${planMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}

                {!PLAN_WITH_LUCY_DIRECT_LINK_ONLY && planMenuOpen && (
                  <div
                    onMouseEnter={clearPlanMenuCloseTimer}
                    onMouseLeave={scheduleClosePlanMenu}
                    className="absolute left-1/2 top-16 z-50 w-[680px] -translate-x-1/2 rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {planMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setPlanMenuOpen(false)}
                          className="group flex items-start gap-4 rounded-[1.1rem] border border-transparent p-4 transition hover:border-slate-200 hover:bg-slate-50"
                        >
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                            <img
                              src={item.iconSrc}
                              alt=""
                              aria-hidden="true"
                              className="h-9 w-9 object-contain"
                            />
                          </span>

                          <span className="min-w-0">
                            <span className="block text-sm font-bold text-slate-800">
                              {item.label}
                            </span>

                            <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/skysirv-live"
                className={navItemClass(isLiveActive)}
              >
                Skysirv Live
              </Link>

              <Link href="/pricing" className={navItemClass(isPricingActive)}>
                Pricing
              </Link>
            </div>
          </div>

          <div className="relative hidden translate-x-10 items-center gap-2 md:flex" ref={dropdownRef}>
            {isSessionReady && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openSigninModal()
                      return
                    }

                    setAccountMenuOpen((current) => !current)
                  }}
                  aria-label={isLoggedIn ? "Open account menu" : "Sign in"}
                  aria-expanded={isLoggedIn ? accountMenuOpen : undefined}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
                >
                  <span>{isLoggedIn ? "Dashboard" : "Sign in"}</span>
                </button>

                <Link
                  href="/plan-smarter"
                  className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-orange-500 bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-600 hover:bg-orange-600"
                >
                  Plan smarter
                  <LargeChevron direction="right" />
                </Link>

                {accountMenuOpen && (
                  <div
                    className={`absolute right-0 top-16 z-50 w-64 overflow-hidden rounded-2xl border py-2 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.18)] ${isDark
                      ? 'border-white/10 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-800'
                      }`}
                  >
                    {!isLoggedIn && (
                      <div className="md:hidden">
                        <Link
                          href="/booking/flights"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Book
                        </Link>

                        <Link
                          href="/plan-with-lucy/itinerary"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Plan with Lucy
                        </Link>

                        <Link
                          href="/skysirv-live"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Skysirv Live
                        </Link>

                        <Link
                          href="/pricing"
                          onClick={() => setAccountMenuOpen(false)}
                          className={`block px-4 py-2.5 text-center font-medium transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
                            }`}
                        >
                          Pricing
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

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center text-slate-800 transition hover:text-slate-800"
            >
              <span className="sr-only">Open menu</span>
              <span className="relative h-5 w-5">
                <span
                  className={`absolute left-0 top-[4px] h-0.5 w-5 rounded-full bg-current transition-transform ${mobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
                    }`}
                />
                <span
                  className={`absolute left-0 top-[10px] h-0.5 w-5 rounded-full bg-current transition-opacity ${mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`absolute left-0 top-[16px] h-0.5 w-5 rounded-full bg-current transition-transform ${mobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
                    }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="mx-auto w-full max-w-5xl px-4 pb-4">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
              <div className="grid gap-1 p-3">
                <Link
                  href="/booking/flights"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Book
                </Link>

                <Link
                  href="/plan-with-lucy/itinerary"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Plan with Lucy
                </Link>

                <Link
                  href="/skysirv-live"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Skysirv Live
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  Pricing
                </Link>
              </div>

              <div className="border-t border-slate-100 p-3">
                {isLoggedIn ? (
                  <Link
                    href={isAdmin ? "/admin" : dashboardHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    {isAdmin ? "Admin" : "Dashboard"}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openSigninModal()
                    }}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    Sign in
                  </button>
                )}

                <Link
                  href="/plan-smarter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Plan smarter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        open={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
        heroImageSrc="/images/stock/onboarding-hero.jpg"
        heroImageAlt="Ready for adventure"
      >
        <AuthPanel
          initialMode={authMode}
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
    </div>
  );
}