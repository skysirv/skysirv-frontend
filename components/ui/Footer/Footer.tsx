"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isDark = pathname === "/pricing";

  return (
    <footer
      className={
        isDark
          ? "bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white"
          : "border-t border-slate-200 bg-white"
      }
    >
      <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
          {/* Brand */}
          <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
            <Link
              href="/"
              className={
                isDark
                  ? "text-xl font-bold leading-none text-white transition hover:text-slate-300"
                  : "text-xl font-bold leading-none text-slate-900 transition hover:text-slate-700"
              }
            >
              Skysirv™
            </Link>

            <p
              className={
                isDark
                  ? "mt-4 text-sm leading-6 text-slate-400"
                  : "mt-4 text-sm leading-6 text-slate-600"
              }
            >
              Flight intelligence that helps travelers understand pricing and
              book with more confidence.
            </p>
          </div>

          {/* Products */}
          <div className="text-center md:text-left">
            <h3
              className={
                isDark
                  ? "text-sm font-bold uppercase tracking-[0.14em] text-white"
                  : "text-sm font-bold uppercase tracking-[0.14em] text-slate-900"
              }
            >
              Products
            </h3>

            <ul
              className={
                isDark
                  ? "mt-4 space-y-3 text-sm text-slate-400"
                  : "mt-4 space-y-3 text-sm text-slate-600"
              }
            >
              <li>
                <Link
                  href="/pricing"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="/booking"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Booking
                </Link>
              </li>

              <li>
                <Link
                  href="/ai-assistant"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Skysirv Flight Attendant™
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3
              className={
                isDark
                  ? "text-sm font-bold uppercase tracking-[0.14em] text-white"
                  : "text-sm font-bold uppercase tracking-[0.14em] text-slate-900"
              }
            >
              Company
            </h3>

            <ul
              className={
                isDark
                  ? "mt-4 space-y-3 text-sm text-slate-400"
                  : "mt-4 space-y-3 text-sm text-slate-600"
              }
            >
              <li>
                <Link
                  href="/about"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/beta"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Beta Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3
              className={
                isDark
                  ? "text-sm font-bold uppercase tracking-[0.14em] text-white"
                  : "text-sm font-bold uppercase tracking-[0.14em] text-slate-900"
              }
            >
              Legal
            </h3>

            <ul
              className={
                isDark
                  ? "mt-4 space-y-3 text-sm text-slate-400"
                  : "mt-4 space-y-3 text-sm text-slate-600"
              }
            >
              <li>
                <Link
                  href="/privacy"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Terms
                </Link>
              </li>

              <li>
                <Link
                  href="/refund-policy"
                  className={
                    isDark
                      ? "transition hover:text-white"
                      : "transition hover:text-slate-400"
                  }
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 text-center">
          <p
            className={
              isDark ? "text-sm text-slate-300" : "text-sm text-slate-900"
            }
          >
            &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}