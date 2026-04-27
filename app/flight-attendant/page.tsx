"use client"

import Link from "next/link"
import { useEffect } from "react"
import { motion } from "framer-motion"

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function FlightAttendantPage() {
  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background =
      "linear-gradient(to bottom, rgb(2 6 23), rgb(2 6 23), rgb(15 23 42))"
    document.body.style.backgroundColor = "rgb(2 6 23)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  return (
    <section className="relative -mt-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pt-32 text-white">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%)]"
        />
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-40px] top-[-20px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
          transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-40px] left-[-20px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12">
        {/* HERO */}
        <div className="mx-auto max-w-5xl text-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm"
            >
              Skysirv Flight Attendant™
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
              className="mt-8 text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Your AI travel companion
              <span className="block">inside Skysirv</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl"
            >
              Skysirv's Lucy is the conversational AI intelligence layer being built to help travelers understand route behavior, fare signals,
              Skyscore™, watchlists, and booking confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.58, ease: "easeOut" }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <MarketingPill label="Built for flight decisions" />
              <MarketingPill label="Dashboard-aware by plan" />
              <MarketingPill label="Powered by Skysirv intelligence" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.58, ease: "easeOut" }}
              className="mt-12 text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                3 Layers of AI Intelligence
              </h2>
            </motion.div>
          </div>
        </div>

        {/* VALUE STRIP */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
          <ValuePanel
            title="Limited AI"
            text="Free users get basic guidance for understanding Skysirv, starter monitoring, plan features, and simple fare intelligence concepts."
          />
          <ValuePanel
            title="Standard AI"
            text="Pro users get a more capable assistant for route timing, Skyscore™, watchlist signals, and booking confidence."
          />
          <ValuePanel
            title="Advanced AI"
            text="Business users get the deepest assistant layer for premium intelligence, saved flights, route behavior, and advanced decision support."
          />
        </div>

        {/* AI DECISION PANEL */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  AI decision layer
                </div>

                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Built to explain the why behind your flight decisions.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Most travel tools show prices. Skysirv is being built to
                  interpret pricing behavior over time. Lucy sits on top of that
                  intelligence layer to help explain route movement, booking
                  timing, alert meaning, and decision confidence.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <SlateMetricCard
                    label="Route"
                    value="Aware"
                    subtext="Connected to monitored routes"
                  />
                  <SlateMetricCard
                    label="Signal"
                    value="Skyscore™"
                    subtext="Built around fare intelligence"
                  />
                  <SlateMetricCard
                    label="Guidance"
                    value="Personal"
                    subtext="Designed around travel style"
                  />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-7 shadow-[0_20px_60px_rgba(2,6,23,0.35)]">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Where Lucy lives
                </p>

                <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">
                  Inside your dashboard, right where decisions happen.
                </h3>

                <div className="mt-6 space-y-3">
                  <DarkInsightRow
                    label="Visitors"
                    text="Public site visitors can use a lightweight Lucy bubble for basic Skysirv information, plan guidance, and account creation help."
                  />
                  <DarkInsightRow
                    label="Dashboard users"
                    text="Signed-in users get Lucy directly inside their dashboard, tailored to Free, Pro, or Business access."
                  />
                  <DarkInsightRow
                    label="Future intelligence"
                    text="Lucy will become more Skysirv-aware as route history, watchlists, saved flights, preferences, and alerts are connected."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM STORY */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
              Why this matters
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              This is not generic AI. It is a specialized travel intelligence assistant.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Skysirv Flight Attendant™ is being designed to sit on top of the
              Skysirv Intelligence Engine™ — helping travelers understand price
              movement, timing signals, route behavior, alerts, and confidence
              before they book.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <SlateMetricCard
                label="Watchlist"
                value="Aware"
                subtext="Knows what routes matter"
              />
              <SlateMetricCard
                label="Pricing"
                value="Historic"
                subtext="Uses fare behavior context"
              />
              <SlateMetricCard
                label="Decisions"
                value="Guided"
                subtext="Explains when to act"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SlateFeatureCard
              title="Explains"
              text="Translates fare movement and route signals into plain-language guidance."
            />
            <SlateFeatureCard
              title="Compares"
              text="Helps evaluate timing, routes, plan features, and future booking options."
            />
            <SlateFeatureCard
              title="Personalizes"
              text="Designed to learn from your monitored routes, saved flights, and travel preferences."
            />
            <SlateFeatureCard
              title="Guides"
              text="Supports calmer, more confident booking decisions through Skysirv intelligence."
            />
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="mx-auto mt-20 max-w-6xl">
          <FlightAttendantComparisonTable />
        </div>

        {/* FINAL CTA */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center shadow-[0_25px_70px_rgba(2,6,23,0.38)] backdrop-blur-sm sm:px-8 sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                animate={{ opacity: [0.12, 0.2, 0.12], scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%)]"
              />
            </div>

            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Meet Lucy inside your Skysirv dashboard.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Skysirv Flight Attendant™ brings conversational guidance to
                route monitoring, price behavior, alerts, Skyscore™, and future
                booking decisions.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  View Skysirv plans
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FlightAttendantFooter />
    </section>
  )
}

function MarketingPill({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
      {label}
    </div>
  )
}

function ValuePanel({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function SlateMetricCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="flex min-h-[156px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold leading-tight text-white">{value}</p>
      <p className="mt-2 text-center text-xs leading-5 text-slate-400">{subtext}</p>
    </div>
  )
}

function SlateFeatureCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="flex min-h-[210px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 max-w-xs text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function DarkInsightRow({
  label,
  text,
}: {
  label: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  )
}

function FlightAttendantComparisonTable() {
  const rows = [
    {
      label: "General travel questions",
      chatgpt: "Strong",
      skysirv: "Strong",
    },
    {
      label: "Understands your monitored routes",
      chatgpt: "Limited unless manually provided",
      skysirv: "Connected to your Skysirv watchlist",
    },
    {
      label: "Uses airfare history",
      chatgpt: "Not connected by default",
      skysirv: "Built around route pricing history",
    },
    {
      label: "Interprets Skyscore™",
      chatgpt: "Not available",
      skysirv: "Native Skyscore™ explanation",
    },
    {
      label: "Explains booking timing",
      chatgpt: "General guidance",
      skysirv: "Route-specific timing guidance",
    },
    {
      label: "Connects to alerts and signals",
      chatgpt: "Not connected",
      skysirv: "Designed for Skysirv Signals™",
    },
    {
      label: "Future booking workflow",
      chatgpt: "External workflow",
      skysirv: "Planned inside Skysirv experience",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <h3 className="text-center text-5xl font-semibold text-white">
        ChatGPT vs. Skysirv Flight Attendant™
      </h3>

      <p className="mx-auto mt-3 max-w-3xl text-center text-lg leading-8 text-slate-400">
        ChatGPT is a powerful general assistant. Skysirv Flight Attendant™ is
        being designed as a specialized travel intelligence assistant connected
        to the Skysirv platform.
      </p>

      <div className="mt-10 overflow-x-auto">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-sm">
          <div className="grid min-w-[760px] grid-cols-3 border-b border-white/10 bg-white/[0.04] text-sm font-medium text-slate-300">
            <div className="px-6 py-4">Capability</div>
            <div className="px-6 py-4 text-center">ChatGPT</div>
            <div className="px-6 py-4 text-center">Skysirv Flight Attendant™</div>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "grid min-w-[760px] grid-cols-3 border-t border-white/5 text-sm",
                index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
              )}
            >
              <div className="px-6 py-4 font-medium text-slate-200">
                {row.label}
              </div>

              <div className="px-6 py-4 text-center text-slate-400">
                {row.chatgpt}
              </div>

              <div className="px-6 py-4 text-center text-slate-200">
                {row.skysirv}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FlightAttendantFooter() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
        <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
          <Link
            href="/"
            className="text-xl font-bold leading-none text-white transition hover:text-slate-300"
          >
            Skysirv™
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Flight intelligence that helps travelers understand pricing and
            book with more confidence.
          </p>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Products
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/pricing" className="transition hover:text-white">
                Pricing
              </Link>
            </li>

            <li>
              <Link href="/booking" className="transition hover:text-white">
                Booking
              </Link>
            </li>

            <li>
              <Link href="/flight-attendant" className="transition hover:text-white">
                Skysirv Flight Attendant™
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Company
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
            </li>

            <li>
              <Link href="/beta" className="transition hover:text-white">
                Skysirv™ Beta
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
            Legal
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link href="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
            </li>

            <li>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
            </li>

            <li>
              <Link href="/refund-policy" className="transition hover:text-white">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 text-center">
        <p className="text-sm text-slate-300">
          &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
        </p>
      </div>
    </div>
  )
}