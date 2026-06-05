import { motion } from "framer-motion"
import Link from "next/link"

export default function OnboardingPanel({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="fixed right-6 top-20 z-40 hidden h-[calc(100vh-7.25rem)] w-[420px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.12)] xl:block"
    >
      <div className="flex h-full flex-col">
        <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/stock/onboarding-hero.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/10 to-blue-700/25" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-2xl leading-none text-slate-500 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
            aria-label="Close onboarding panel"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col p-7">
          <p className="text-sm font-semibold text-slate-600">
            You are using limited trial planning.
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-orange-500">
            Unlock more planning with Lucy.
          </h2>

          <div className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
            <p>✓ Save planning sessions to your Skysirv dashboard.</p>
            <p>✓ Let Lucy remember preferences across future trips.</p>
            <p>✓ Unlock deeper itinerary, route, hotel, car, and cruise planning.</p>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex min-h-[50px] w-full items-center justify-center rounded-xl bg-gradient-to-r bg-blue-700 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            Or continue with email
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-h-[48px] w-full rounded-xl border border-slate-100 bg-slate-100 px-4 text-sm font-semibold outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="password"
              placeholder="Password"
              className="min-h-[48px] w-full rounded-xl border border-slate-100 bg-slate-100 px-4 text-sm font-semibold outline-none transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="button"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-700 px-6 text-sm font-bold text-white hover:border-blue-600 hover:bg-blue-600"
            >
              Sign up / Sign in
            </button>
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-500">
            By continuing, you agree to Skysirv’s{" "}
            <Link
              href="/terms"
              className="font-semibold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-blue-700 underline underline-offset-2 transition hover:text-blue-800"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </motion.aside>
  )
}