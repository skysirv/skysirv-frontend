"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" as const },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
}

export default function HomePage() {
  const intelligenceCards = [
    {
      title: "Skysirv Monitor™",
      text: "Continuous monitoring engine tracking airfare activity across routes with stability controls and adaptive cooldown protection.",
    },
    {
      title: "Skysirv Signals™",
      text: "Milestone-based alerts identifying meaningful fare drops rather than routine price fluctuations.",
    },
    {
      title: "Skysirv Price Behavior™",
      text: "Historical analysis of fare movement patterns across monitored time windows.",
    },
    {
      title: "Skysirv Predict™",
      text: "Forecast modeling estimating likely fare movement windows using route volatility and historical behavior.",
    },
    {
      title: "Skysirv Insights™",
      text: "Structured intelligence summaries translating fare data into actionable travel guidance.",
    },
    {
      title: "Skysirv Route Digest™",
      text: "Condensed route intelligence briefs summarizing monitoring cycles and pricing activity.",
    },
    {
      title: "Skyscore™",
      text: "Adaptive intelligence score evaluating opportunity quality across price positioning, volatility, and route behavior.",
    },
    {
      title: "Skysirv Intelligence Engine™",
      text: "The core architecture orchestrating monitoring, prediction, scoring, and signals into a unified airfare intelligence platform.",
    },
  ]

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, 28, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-120px] top-10 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -36, 0], y: [0, -24, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-140px] top-12 h-[28rem] w-[28rem] rounded-full bg-indigo-100/60 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 24, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl"
          />
          <motion.div
            animate={{ opacity: [0.18, 0.32, 0.18] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_38%)]"
          />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-32 text-center sm:px-8 sm:pb-28 sm:pt-36 lg:px-12 lg:pb-32 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.05, duration: 0.55 }}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur"
            >
              Premium Airfare Intelligence
            </motion.div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
              Intelligent monitoring for
              premium air travel
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Skysirv™ helps travelers track routes, understand fare movement, and
              make smarter booking decisions with calm, clear travel intelligence.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.65 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <HeroStatPill label="Routes monitored" value="24/7" />
            <HeroStatPill label="Signal quality" value="Adaptive" />
            <HeroStatPill label="Intelligence layer" value="Live" />
          </motion.div>

          {/* TICKER STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.28, duration: 0.75 }}
            className="relative mt-12 w-full max-w-5xl overflow-hidden rounded-full border border-slate-200 bg-white/80 py-3 shadow-sm backdrop-blur"
          >
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

            <div className="ticker-track text-sm text-slate-600">
              <div className="flex items-center gap-4 px-6">
                <span>PTY → VVI</span>
                <span>$882</span>
                <span className="font-medium">Skyscore™ 76</span>
                <span className="font-medium text-amber-600">WATCH</span>

                <span className="text-slate-300">•</span>

                <span>LAX → MIA</span>
                <span>$544</span>
                <span className="font-medium">Skyscore™ 88</span>
                <span className="font-medium text-emerald-600">BUY</span>

                <span className="text-slate-300">•</span>

                <span>BOS → PTY</span>
                <span>$712</span>
                <span className="font-medium">Skyscore™ 69</span>
                <span className="font-medium text-amber-600">WAIT</span>

                <span className="text-slate-300">•</span>

                <span>JFK → CDG</span>
                <span>$631</span>
                <span className="font-medium">Skyscore™ 82</span>
                <span className="font-medium text-emerald-600">BUY</span>
              </div>

              <div className="flex items-center gap-4 px-6">
                <span>$882</span>
                <span className="font-medium">Skyscore™ 76</span>
                <span className="font-medium text-amber-600">WATCH</span>

                <span className="text-slate-300">•</span>

                <span>PTY → VVI</span>
                <span>$544</span>
                <span className="font-medium">Skyscore™ 95</span>
                <span className="font-medium text-emerald-600">BUY</span>

                <span className="text-slate-300">•</span>

                <span>BOS → PTY</span>
                <span>$712</span>
                <span className="font-medium">Skyscore™ 69</span>
                <span className="font-medium text-amber-600">WAIT</span>

                <span className="text-slate-300">•</span>

                <span>JFK → CDG</span>
                <span>$631</span>
                <span className="font-medium">Skyscore™ 82</span>
                <span className="font-medium text-emerald-600">BUY</span>
              </div>
            </div>
          </motion.div>

          {/* FEATURE BULLETS */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg text-slate-500"
          >
            <motion.span variants={staggerItem}>Real-time monitoring engine</motion.span>
            <motion.span variants={staggerItem} className="text-slate-300">
              •
            </motion.span>

            <motion.span variants={staggerItem}>Milestone-based price alerts</motion.span>
            <motion.span variants={staggerItem} className="text-slate-300">
              •
            </motion.span>

            <motion.span variants={staggerItem}>Adaptive fare scoring</motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/create-account"
                className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
              >
                Start Monitoring Flights
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/beta"
                className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Explore Beta Program
              </Link>
            </motion.div>
          </motion.div>

          {/* HERO CINEMATIC PANEL */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.38, duration: 0.85, ease: "easeOut" }}
            className="mt-16 w-full max-w-6xl"
          >
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative p-8 sm:p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-sky-50/70" />
                  <div className="relative">
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium tracking-[0.14em] text-slate-600 uppercase shadow-sm">
                      Live Intelligence Snapshot
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                      Read the market before you book
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                      Skysirv™ transforms noisy fare movement into a calmer, more
                      structured decision layer — so travelers know when to act,
                      when to wait, and what the market is really saying.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <MiniHeroMetric label="Skyscore™" value="87" subtext="Buy window" />
                      <MiniHeroMetric label="Delta vs Avg" value="- $138" subtext="30-day baseline" />
                      <MiniHeroMetric label="Signal" value="High" subtext="Confidence" />
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-10">
                  <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
                    transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-[-18px] top-[-18px] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
                  />
                  <motion.div
                    animate={{ x: [0, -14, 0], y: [0, 16, 0] }}
                    transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-28px] left-[-18px] h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl"
                  />

                  <div className="relative">
                    <p className="text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                      Example route
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-white">
                            BOS → CDG
                          </h3>
                          <p className="mt-2 text-sm text-slate-300">
                            Current Price <span className="font-medium text-white">$412</span>
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Down $138 vs 30-day average
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                            SKYSCORE™
                          </p>
                          <p className="mt-1 text-4xl font-semibold text-emerald-400">
                            87
                          </p>
                          <p className="mt-2 text-xs font-medium text-emerald-300">
                            BUY WINDOW
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <DarkInsightRow
                        label="Price behavior"
                        text="Recent movement suggests a stronger booking pocket before volatility returns."
                      />
                      <DarkInsightRow
                        label="Signal quality"
                        text="Multiple indicators align on value relative to the route’s recent baseline."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FEATURE CARDS */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-20 grid w-full gap-6 md:grid-cols-3"
          >
            <motion.div variants={staggerItem}>
              <HeroFeatureCard
                title="Track routes and watch fares with less guesswork"
                text="Follow the routes that matter to you and keep pricing movement in one clean, readable place."
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <HeroFeatureCard
                title="Read the market and understand timing signals"
                text="Turn raw fare changes into a clearer picture of what may be worth booking now versus waiting on."
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <HeroFeatureCard
                title="Travel smarter and have more booking confidence"
                text="Skysirv™ is being rebuilt into a brighter, cleaner travel experience designed around confidence, clarity, and timing."
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Preview Section */}
      <motion.section
        {...fadeUp}
        className="relative w-full overflow-hidden bg-white py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_42%)]"
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Intelligence Preview
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600 sm:text-xl">
            A live snapshot of the Skysirv™ intelligence engine. Monitor price behavior,
            track fare trends, and evaluate real-time opportunity signals before booking.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mx-auto mt-12 grid max-w-6xl gap-6 px-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          {/* LEFT COLUMN */}
          <motion.div
            variants={staggerItem}
            className="grid h-[540px] gap-6"
            style={{ gridTemplateRows: "1fr 1fr" }}
          >
            <PreviewCard
              route="MIA → LAX"
              subtitle="30-Day Average: $420"
              metricLabel="SKYSCORE™"
              metricValue="80"
              metricColor="text-emerald-500"
              footerLabel="Trend"
              footerValue="down"
              lines={[
                { label: "Current Price", value: "$350" },
              ]}
            />

            <PreviewCard
              route="PTY → VVI"
              subtitle="30-Day Average: $689"
              metricLabel="SKYSCORE™"
              metricValue="82"
              metricColor="text-emerald-500"
              footerLabel="Trend"
              footerValue="stable"
              lines={[
                { label: "Current Price", value: "$631" },
              ]}
            />
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div variants={staggerItem} className="h-[540px]">
            <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                Opportunity signal
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      Boston → Paris
                    </h3>

                    <p className="mt-2 text-sm text-slate-300">
                      Price: <span className="font-medium text-white">$412</span>
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      ↓ $138 vs 30-day average
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold tracking-wide text-slate-400">
                      SKYSCORE™
                    </p>

                    <p className="mt-1 text-4xl font-semibold text-emerald-400">
                      87
                    </p>

                    <p className="mt-2 text-xs font-medium text-emerald-300">
                      BUY WINDOW
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid flex-1 gap-3">
                <DarkInsightRow
                  label="Snapshot"
                  text="Market conditions are pricing below recent baseline with a stronger opportunity profile."
                />
                <DarkInsightRow
                  label="Why it matters"
                  text="This is the kind of route signal Skysirv™ is built to surface before the market shifts back."
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Skysirv Intelligence */}
      <motion.section
        {...fadeUp}
        className="relative w-full bg-white py-24"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Skysirv™ Intelligence
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600 sm:text-xl">
            Built like a system — not a landing page.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className="mx-auto mt-16 grid max-w-6xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {intelligenceCards.map((card, index) => (
            <motion.div key={card.title} variants={staggerItem}>
              <IntelligenceCard
                title={card.title}
                text={card.text}
                delay={index * 0.12}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Dark contrast section */}
      <motion.section
        {...fadeUp}
        className="relative overflow-hidden bg-slate-950 py-24 text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.20),transparent_38%)]"
          />
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
            transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-20px] top-[-20px] h-44 w-44 rounded-full bg-sky-500/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -14, 0], y: [0, 18, 0] }}
            transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-24px] left-[-16px] h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
              A calmer decision layer
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Not another search tool. A structured intelligence experience.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Skysirv™ is being built for travelers who want more than fare listings.
              It is a decision environment designed around timing, price behavior,
              clarity, and confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DarkFeatureCard
              title="Clarity"
              text="Organize route behavior into signals that are easier to understand and act on."
            />
            <DarkFeatureCard
              title="Timing"
              text="Spot meaningful market moments instead of reacting blindly to every fare change."
            />
            <DarkFeatureCard
              title="Confidence"
              text="Use scoring, summaries, and signals to travel with less uncertainty."
            />
            <DarkFeatureCard
              title="Discipline"
              text="Turn a noisy airfare market into a cleaner booking workflow."
            />
          </div>
        </div>
      </motion.section>

      {/* How Skysirv Works */}
      <motion.section
        {...fadeUp}
        className="relative w-full bg-white py-24"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            A disciplined airfare intelligence pipeline
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600 sm:text-xl">
            How it works — Skysirv™ continuously monitors airfare markets, evaluates price behavior,
            and surfaces meaningful opportunity signals through a structured
            intelligence engine.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="mx-auto mt-16 grid max-w-6xl gap-6 px-6 md:grid-cols-3"
        >
          <motion.div variants={staggerItem}>
            <StepCard
              step="Step 01"
              title="Monitor"
              text="Skysirv Monitor™ continuously tracks airfare pricing across routes using real-time fare snapshots and structured historical baselines."
              bullets={[
                "Live fare monitoring engine",
                "30–90 day historical baselines",
                "Route-level monitoring cadence",
              ]}
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <StepCard
              step="Step 02"
              title="Detect & Predict"
              text="Skysirv Signals™ and Skysirv Predict™ analyze price movement, volatility patterns, and timing behavior to detect meaningful opportunities."
              bullets={[
                "Milestone-based drop detection",
                "Volatility-aware signal logic",
                "Predictive price movement modeling",
              ]}
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <StepCard
              step="Step 03"
              title="Score & Notify"
              text="Skyscore™ evaluates opportunity quality and alerts you only when conditions suggest a meaningful booking window."
              bullets={[
                "Adaptive Skyscore™ evaluation",
                "Noise-reduced alert routing",
                "Signal-driven booking intelligence",
              ]}
            />
          </motion.div>
        </motion.div>
      </motion.section>


      {/* CTA Bridge */}
      <motion.section
        {...fadeUp}
        className="relative w-full overflow-hidden bg-slate-950 py-20 text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.20),transparent_38%)]"
          />
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
            transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-20px] top-[-20px] h-44 w-44 rounded-full bg-sky-500/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -14, 0], y: [0, 18, 0] }}
            transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-24px] left-[-16px] h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Ready to start tracking airfare intelligently?
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-300 sm:text-xl">
            Join travelers using Skysirv™ to monitor routes, detect price signals,
            and book flights with confidence.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/create-account"
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-slate-200"
              >
                Start Monitoring Flights
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  )
}

/* ================= COMPONENTS ================= */

function HeroStatPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur"
    >
      <span className="font-medium text-slate-900">{value}</span>{" "}
      <span>{label}</span>
    </motion.div>
  )
}

function MiniHeroMetric({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
      <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{subtext}</p>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {text}
      </p>
    </div>
  )
}

function HeroFeatureCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-shadow"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50">
        <motion.span
          animate={{ scale: [1, 1.12, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-600 shadow-[0_0_14px_rgba(14,165,233,0.45)]"
        />
      </div>

      <h2 className="mt-3 text-xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </motion.div>
  )
}

function PreviewCard({
  route,
  subtitle,
  metricLabel,
  metricValue,
  metricColor,
  footerLabel,
  footerValue,
  badge,
  lines,
}: {
  route: string
  subtitle?: string
  metricLabel: string
  metricValue: string
  metricColor: string
  footerLabel?: string
  footerValue?: string
  badge?: string
  lines: { label: string; value: string; muted?: boolean }[]
}) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {route}
          </h3>

          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            {metricLabel}
          </p>

          <p className={`mt-1 text-4xl font-semibold ${metricColor}`}>
            {metricValue}
          </p>

          {badge ? (
            <p className="mt-2 text-xs font-medium text-emerald-700">
              {badge}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 space-y-3 text-slate-700">
        {lines.map((line) => (
          <p
            key={`${line.label}-${line.value}`}
            className={line.muted ? "text-slate-500" : ""}
          >
            {line.value ? (
              <>
                {line.label}: <span className="font-medium">{line.value}</span>
              </>
            ) : (
              line.label
            )}
          </p>
        ))}

        {footerLabel && footerValue ? (
          <p className="text-slate-500">
            {footerLabel}: {footerValue}
          </p>
        ) : null}
      </div>
    </motion.div>
  )
}

function IntelligenceCard({
  title,
  text,
  delay,
}: {
  title: string
  text: string
  delay: number
}) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-shadow"
    >
      <div className="flex h-full flex-col">
        <div className="flex min-h-[84px] items-start gap-3">
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.55, 1, 0.55] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
            className="mt-1 block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-600 shadow-[0_0_14px_rgba(14,165,233,0.45)]"
          />

          <h3 className="text-[1.95rem] leading-tight font-bold text-slate-900 sm:text-xl">
            {title}
          </h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {text}
        </p>
      </div>
    </motion.div>
  )
}

function DarkFeatureCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        {text}
      </p>
    </motion.div>
  )
}

function StepCard({
  step,
  title,
  text,
  bullets,
}: {
  step: string
  title: string
  text: string
  bullets: string[]
}) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-shadow"
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {step}
      </p>

      <h3 className="mt-3 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        {text}
      </p>

      <ul className="mt-6 space-y-2 text-sm text-slate-600">
        {bullets.map((bullet) => (
          <li key={bullet}>• {bullet}</li>
        ))}
      </ul>
    </motion.div>
  )
}