"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname === "/pricing" ||
    pathname === "/dev/pricing-lab" ||
    pathname.startsWith("/dev/plan-with-lucy-lab") ||
    pathname === "/booking" ||
    pathname === "/beta" ||
    pathname.startsWith("/skysirv-live")
  ) {
    return null;
  }

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:justify-items-center md:text-center">
          {/* Brand */}
          <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
            <Link
              href="/"
              className="text-xl font-bold leading-none text-slate-800 transition hover:text-slate-700"
            >
              Skysirv
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              AI-powered travel intelligence that helps travelers compare trips,
              understand signals, and plan with more confidence.
            </p>
          </div>

          {/* Book */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
              Book
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <Link href="/booking" className="transition hover:text-slate-400">
                  Flights
                </Link>
              </li>

              <li>
                <Link href="/hotels" className="transition hover:text-slate-400">
                  Hotels
                </Link>
              </li>

              <li>
                <Link href="/car-rentals" className="transition hover:text-slate-400">
                  Car rentals
                </Link>
              </li>

              <li>
                <Link href="/cruises" className="transition hover:text-slate-400">
                  Cruises
                </Link>
              </li>
            </ul>
          </div>

          {/* Plan */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
              Plan
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <Link href="/dev/plan-with-lucy-lab/itinerary" className="transition hover:text-slate-400">
                  Generate itinerary
                </Link>
              </li>

              <li>
                <Link href="/dev/plan-with-lucy-lab/itinerary" className="transition hover:text-slate-400">
                  Travel preferences
                </Link>
              </li>

              <li>
                <Link href="/dev/plan-with-lucy-lab/itinerary" className="transition hover:text-slate-400">
                  Lucy memory
                </Link>
              </li>

              <li>
                <Link href="/dev/plan-with-lucy-lab/itinerary" className="transition hover:text-slate-400">
                  Trip ideas
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <Link href="/skysirv-live" className="transition hover:text-slate-400">
                  Skysirv Live
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="transition hover:text-slate-400">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/about" className="transition hover:text-slate-400">
                  About
                </Link>
              </li>

              <li>
                <Link href="/pricing" className="transition hover:text-slate-400">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-800">
              Legal
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <Link href="/privacy" className="transition hover:text-slate-400">
                  Privacy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="transition hover:text-slate-400">
                  Terms
                </Link>
              </li>

              <li>
                <Link href="/refund-policy" className="transition hover:text-slate-400">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 text-center">
          <p className="text-sm text-slate-800">
            &copy; {new Date().getFullYear()} Skysirv. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}