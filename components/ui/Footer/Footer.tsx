import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl md:max-w-4xl px-6 py-16 text-center md:text-left">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">

          {/* Brand */}
          <div className="max-w-xs text-center md:text-left">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Skysirv"
            >
              <img
                src="/branding/logo/skysirv-logo.svg"
                alt="Skysirv"
                className="h-40 w-auto"
              />
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Flight intelligence that helps travelers understand pricing and
              book with more confidence.
            </p>
          </div>

          {/* Product */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Product
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">

              <li>
                <Link href="/" className="transition hover:text-slate-400">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/signin" className="transition hover:text-slate-400">
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  href="/create-account"
                  className="transition hover:text-slate-400"
                >
                  Create account
                </Link>
              </li>

            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">

              <li>
                <Link href="/about" className="transition hover:text-slate-400">
                  About
                </Link>
              </li>

              <li>
                <Link href="/beta" className="transition hover:text-slate-400">
                  Beta Program
                </Link>
              </li>

            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-900">
              Legal
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-600">

              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-slate-400"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="transition hover:text-slate-400"
                >
                  Terms
                </Link>
              </li>

              <li>
                <Link
                  href="/refund-policy"
                  className="transition hover:text-slate-400"
                >
                  Refund Policy
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-900">
            &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}