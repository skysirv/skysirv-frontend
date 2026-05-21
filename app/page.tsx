"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import AuthModal from "@/components/auth/AuthModal"
import CreateAccountForm from "@/components/auth/CreateAccountForm"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import FeaturedInSection from "@/components/home/FeaturedInSection"
import SmsOptInModal from "@/components/sms/SmsOptInModal"

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
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false)
  const [createAccountSuccess, setCreateAccountSuccess] = useState(false)

  useEffect(() => {
    if (!createAccountModalOpen || !createAccountSuccess) return

    const timer = window.setTimeout(() => {
      setCreateAccountModalOpen(false)
      setCreateAccountSuccess(false)
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [createAccountModalOpen, createAccountSuccess])

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

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-32 text-center sm:px-8 sm:pb-28 sm:pt-36 lg:px-12 lg:pb-32 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:mt-8 sm:text-6xl md:text-7xl">
              Intelligent AI monitoring for
              premium air travel
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
            >
              Skysirv™ helps travelers track routes, understand fare movement, and
              make smarter booking decisions with calm, clear AI travel intelligence.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.65 }}
            className="mx-auto mt-8 w-full max-w-6xl"
          >
            <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-5 py-5 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <motion.div
                animate={{ x: [0, 34, 0], y: [0, -18, 0], opacity: [0.18, 0.38, 0.18] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[-40px] top-[-36px] h-40 w-40 rounded-full bg-sky-200/60 blur-3xl"
              />

              <motion.div
                animate={{ x: [0, -24, 0], y: [0, 22, 0], opacity: [0.12, 0.28, 0.12] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-42px] left-[-36px] h-44 w-44 rounded-full bg-indigo-200/50 blur-3xl"
              />

              <motion.div
                animate={{ opacity: [0.06, 0.12, 0.06] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_48%)]"
              />

              <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                <div className="flex flex-col justify-center text-center lg:text-left">
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                    The AI that guides the entire Skysirv experience across all devices.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                    Lucy is being built to help travelers plan, monitor, compare, save,
                    adjust, and understand every part of their trip — from route behavior
                    and fare timing to booking confidence and dashboard actions.
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      "Plan trips: Get route insights and personalized guidance on when to book.",
                      "Track routes: Monitor flight status and gate changes in real-time.",
                      "Explain fare signals: Understand price fluctuations and booking opportunities.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-medium text-slate-700 lg:text-left"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-[320px] items-stretch">
                  <LucyCommandDemo />
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO CINEMATIC PANEL */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.38, duration: 0.85, ease: "easeOut" }}
            className="mt-10 w-full max-w-6xl sm:mt-16"
          >
            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
              <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative p-5 text-center sm:p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-sky-50/70" />

                  <div className="relative">
                    <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                      Live Intelligence Snapshot
                    </p>

                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:mt-6 sm:text-4xl">
                      Read the market before you book.
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:leading-7 sm:text-base">
                      Skysirv™ transforms noisy fare movement into a calmer, more
                      structured decision layer — so travelers know when to act,
                      when to wait, and what the market is really saying.
                    </p>

                    <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                      <MiniHeroMetric label="Skyscore™" value="87" subtext="Buy window" />
                      <MiniHeroMetric label="Delta vs Avg" value="- $138" subtext="30-day baseline" />
                      <MiniHeroMetric label="Signal" value="High" subtext="Confidence" />
                    </div>
                  </div>
                </div>

                <div className="relative p-5 sm:p-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-sky-50/70" />

                  <div className="relative text-center">
                    <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                      Example route
                    </p>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-6 text-left">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                            BOS → CDG
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">
                            Current Price <span className="font-medium text-slate-950">$412</span>
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Down $138 vs 30-day average
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold tracking-[0.14em] text-slate-400">
                            SKYSCORE™
                          </p>
                          <p className="mt-1 text-4xl font-semibold text-emerald-600">
                            87
                          </p>
                          <p className="mt-2 text-xs font-medium text-emerald-600">
                            BUY WINDOW
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <LightInsightRow
                        label="Price behavior"
                        text="Recent movement suggests a stronger booking pocket before volatility returns."
                      />
                      <LightInsightRow
                        label="Signal quality"
                        text="Multiple indicators align on value relative to the route’s recent baseline."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                <span className="font-medium text-red-500">OVERPRICED</span>

                <span className="text-slate-300">•</span>

                <span>LAX → MIA</span>
                <span>$544</span>
                <span className="font-medium">Skyscore™ 88</span>
                <span className="font-medium text-emerald-600">GOOD DEAL</span>

                <span className="text-slate-300">•</span>

                <span>BOS → PTY</span>
                <span>$712</span>
                <span className="font-medium">Skyscore™ 69</span>
                <span className="font-medium text-amber-600">WAIT</span>

                <span className="text-slate-300">•</span>

                <span>JFK → CDG</span>
                <span>$631</span>
                <span className="font-medium">Skyscore™ 82</span>
                <span className="font-medium text-emerald-600">GOOD DEAL</span>

                <span className="text-slate-300">•</span>

                <span>MDW → EWR</span>
                <span>$882</span>
                <span className="font-medium">Skyscore™ 76</span>
                <span className="font-medium text-red-500">OVERPRICED</span>

                <span className="text-slate-300">•</span>

                <span>PTY → VVI</span>
                <span>$544</span>
                <span className="font-medium">Skyscore™ 95</span>
                <span className="font-medium text-emerald-600">GOOD DEAL</span>

                <span className="text-slate-300">•</span>

                <span>BOS → PTY</span>
                <span>$712</span>
                <span className="font-medium">Skyscore™ 69</span>
                <span className="font-medium text-amber-600">WAIT</span>

                <span className="text-slate-300">•</span>

                <span>JFK → CDG</span>
                <span>$631</span>
                <span className="font-medium">Skyscore™ 82</span>
                <span className="font-medium text-emerald-600">GOOD DEAL</span>
              </div>
            </div>
          </motion.div>

          {/* FEATURE CARDS */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid w-full gap-3 sm:mt-20 sm:gap-6 md:grid-cols-3"
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
        className="relative w-full overflow-hidden bg-slate-950 py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_45%)]"
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Intelligence Preview
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-300 sm:text-xl">
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
            className="grid h-auto gap-6 lg:h-[620px]"
            style={{ gridTemplateRows: "1fr 1fr" }}
          >
            <PreviewCard
              route="BOS → LAX"
              subtitle="30-Day Average: $420"
              metricLabel="SKYSCORE™"
              metricValue="80"
              metricColor="text-emerald-500"
              footerLabel="Trend"
              footerValue="down"
              backgroundImage="/images/stock/bos-lax-card.jpg"
              textTheme="light"
              lines={[
                { label: "Current Price", value: "$350" },
              ]}
            />

            <PreviewCard
              route="BOS → MIA"
              subtitle="30-Day Average: $285"
              metricLabel="SKYSCORE™"
              metricValue="82"
              metricColor="text-emerald-300"
              footerLabel="Trend"
              footerValue="down"
              backgroundImage="/images/stock/bos-mia-card.jpg"
              textTheme="light"
              lines={[
                { label: "Current Price", value: "$214" },
              ]}
            />
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div variants={staggerItem} className="h-auto lg:h-[620px]">
            <div className="flex h-full flex-col rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                Opportunity signal
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      BOS → MIA
                    </h3>

                    <p className="mt-2 text-sm text-slate-300">
                      Price: <span className="font-medium text-white">$214</span>
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      ↓ $71 vs 30-day average
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold tracking-wide text-slate-400">
                      SKYSCORE™
                    </p>

                    <p className="mt-1 text-4xl font-semibold text-emerald-400">
                      82
                    </p>

                    <p className="mt-2 text-xs font-medium text-emerald-300">
                      BUY WINDOW
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid flex-1 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                    Snapshot
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    BOS → MIA is pricing below its recent baseline with a stronger opportunity profile.
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        Current
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">$214</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        Avg
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">$285</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        Delta
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-300">-$71</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs font-medium tracking-[0.14em] text-slate-400 uppercase">
                    Why it matters
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This route is showing a cleaner booking window than its recent average, giving travelers a stronger reason to monitor or book before fares normalize.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Buy window
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      Below average
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                      Strong signal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Skysirv Intelligence */}
      <motion.section
        {...fadeUp}
        className="relative w-full bg-white pt-24 pb-10"
      >
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Skysirv™ Intelligence
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-600 sm:text-xl">
            Built like a system — not a landing page. Skysirv™ is a collection of integrated intelligence features working together to help travelers read the market and make smarter booking decisions with less stress and more clarity.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-6 sm:mt-14">
          <div className="relative overflow-hidden py-2">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 80,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex w-max gap-4"
            >
              {[...intelligenceCards, ...intelligenceCards].map((card, index) => (
                <IntelligenceCarouselCard
                  key={`${card.title}-${index}`}
                  title={card.title}
                  text={card.text}
                  delay={index * 0.08}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Dark contrast section */}
      <motion.section
        {...fadeUp}
        className="relative w-full bg-white pt-10 pb-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-14 lg:px-10 lg:py-16">
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

            <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                  A calmer decision layer
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
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
          </div>
        </div>
      </motion.section>

      {/* How Skysirv Works */}
      <motion.section
        {...fadeUp}
        className="relative w-full overflow-hidden bg-slate-950 py-24"
      >
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_42%)]"
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
            A disciplined airfare intelligence pipeline
          </h2>

          <p className="mt-8 text-lg leading-8 text-slate-300 sm:text-xl">
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
          className="relative mx-auto mt-16 grid max-w-6xl gap-6 px-6 md:grid-cols-3"
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

      <TestimonialsSection />
      <FeaturedInSection />

      {/* CTA Bridge */}
      <motion.section
        {...fadeUp}
        className="relative w-full bg-white py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:px-8 sm:py-16">
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

            <div className="relative mx-auto max-w-4xl text-center">
              <h2 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Ready to start tracking airfare intelligently?
              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-300 sm:text-xl">
                Join travelers using Skysirv™ to monitor routes, detect price signals,
                and book flights with confidence.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateAccountSuccess(false)
                      setCreateAccountModalOpen(true)
                    }}
                    className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-slate-200"
                  >
                    Start Monitoring Flights
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <AuthModal
        open={createAccountModalOpen}
        onClose={() => {
          setCreateAccountModalOpen(false)
          setCreateAccountSuccess(false)
        }}
        title={createAccountSuccess ? undefined : "Create your Skysirv™ account"}
        description={
          createAccountSuccess
            ? undefined
            : "Start monitoring airfare with real travel intelligence"
        }
        maxWidthClassName="max-w-sm"
        disableBackdropClose={createAccountSuccess}
        hideCloseButton={createAccountSuccess}
        headerContent={
          createAccountSuccess ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Account Created
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Thank you for creating your Skysirv account.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                You should receive an activation email shortly.
              </p>
            </div>
          ) : undefined
        }
      >
        {createAccountSuccess ? (
          <div className="text-sm leading-6 text-slate-600">
            <p>Please check your inbox and click the activation link to continue.</p>
            <p className="mt-3">If you don’t see the email, check your spam folder.</p>
          </div>
        ) : (
          <CreateAccountForm
            onSuccess={() => {
              setCreateAccountSuccess(true)
            }}
          />
        )}
      </AuthModal>

      <SmsOptInModal sourcePage="homepage" delayMs={4200} />
    </>
  )
}

/* ================= COMPONENTS ================= */

function LucyCommandDemo() {
  const scenarios = [
    {
      user: "Lucy, watch Boston to Miami and tell me if fares look strong.",
      lucy: "I’ll monitor BOS → MIA and flag meaningful price movement. Right now, the route is below its recent baseline, so this looks like a stronger booking window.",
    },
    {
      user: "Can you compare my saved flights and explain the best option?",
      lucy: "Yes. I can compare price position, route quality, timing signals, stops, and confidence level so you are not choosing from price alone.",
    },
    {
      user: "Lucy, search New York to Frankfurt, and add it to my watchlist.",
      lucy: "Absolutely. I’ll search JFK → FRA, prepare the route for monitoring, and add it to your watchlist so Skysirv can track fare movement, signal changes, and stronger booking windows.",
    },
    {
      user: "Lucy, alert me if Miami to Los Angeles drops into a strong booking window.",
      lucy: "Done. I’ll watch MIA → LAX and notify you when the route shows a meaningful fare drop, stronger Skyscore™, or pricing behavior that suggests it may be a good time to book.",
    },
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenarios.length)
    }, 7200)

    return () => window.clearInterval(timer)
  }, [scenarios.length])

  const scenario = scenarios[index]

  return (
    <div className="relative flex min-h-[320px] w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Lucy</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Skysirv Flight Attendant™
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
          Online
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.user}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-3"
          >
            <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-md border border-sky-300/20 bg-sky-300/10 px-4 py-3 text-sm leading-6 text-sky-50">
              {scenario.user}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]" />
              Lucy is thinking
              <span className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  •
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                >
                  •
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  •
                </motion.span>
              </span>
            </div>

            <div className="mr-auto max-w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] px-4 py-3 text-sm leading-6 text-slate-200">
              {scenario.lucy}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm text-slate-400">
            Ask Lucy about your trip...
          </span>

          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-sky-300 px-4 text-xs font-semibold text-slate-950"
          >
            Send
          </button>
        </div>
      </div>
    </div>
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
    <div className="flex items-center justify-between gap-3 rounded-full border border-slate-200 bg-white/85 px-4 py-2 shadow-sm sm:block sm:rounded-2xl sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 sm:text-xs sm:tracking-[0.14em]">
        {label}
      </p>

      <div className="flex items-center gap-2 sm:block">
        <p className="text-lg font-semibold tracking-tight text-slate-950 sm:mt-2 sm:text-2xl">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-700 sm:mt-1">{subtext}</p>
      </div>
    </div>
  )
}

function LightInsightRow({
  label,
  text,
}: {
  label: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
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
      className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow sm:rounded-3xl sm:p-6 sm:shadow-md"
    >

      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-5 text-slate-600 sm:mt-3 sm:leading-6">
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
  backgroundImage,
  textTheme,
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
  backgroundImage?: string
  textTheme?: "dark" | "light"
  lines: { label: string; value: string; muted?: boolean }[]
}) {
  const isLightText = textTheme === "light"

  const overlayClass = isLightText
    ? "bg-slate-950/34"
    : "bg-white/28"

  const titleClass = isLightText
    ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
    : "text-black"

  const subtitleClass = isLightText
    ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
    : "text-black"

  const labelClass = isLightText
    ? "text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
    : "text-black"

  const bodyClass = isLightText
    ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
    : "text-black"

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(15,23,42,0.09)" }}
      transition={{ duration: 0.22 }}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-shadow"
    >
      {backgroundImage ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 brightness-[0.78] saturate-[0.90]"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />

          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 blur-[10px] [mask-image:linear-gradient(to_top,black_0%,black_5%,transparent_50%)]"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />

          <div className={`pointer-events-none absolute inset-0 ${overlayClass}`} />
        </>
      ) : null}

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className={`text-2xl font-bold ${titleClass}`}>
              {route}
            </h3>

            {subtitle ? (
              <p className={`mt-1 text-sm font-bold ${subtitleClass}`}>
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="text-right">
            <p className={`text-xs font-bold tracking-wide ${labelClass}`}>
              {metricLabel}
            </p>

            <p className={`mt-1 text-4xl font-bold ${metricColor}`}>
              {metricValue}
            </p>

            {badge ? (
              <p className="mt-2 text-xs font-medium text-emerald">
                {badge}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 w-fit min-w-[240px] space-y-3">
          {lines.map((line) => (
            <p
              key={`${line.label}-${line.value}`}
              className={`font-bold ${bodyClass}`}
            >
              {line.value ? (
                <>
                  {line.label}:{" "}
                  <span className={`font-bold ${bodyClass}`}>
                    {line.value}
                  </span>
                </>
              ) : (
                line.label
              )}
            </p>
          ))}

          {footerLabel && footerValue ? (
            <p className={`font-bold ${bodyClass}`}>
              {footerLabel}: {footerValue}
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

function IntelligenceCarouselCard({
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
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22 }}
      className="flex w-[280px] shrink-0 flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-5 text-center shadow-sm sm:w-[320px]"
    >
      <div className="flex items-center justify-center gap-2">
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className="block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-600 shadow-[0_0_14px_rgba(14,165,233,0.45)]"
        />

        <h3 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {text}
      </p>
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
      whileHover={{ y: -5, boxShadow: "0 20px 50px rgba(2,6,23,0.38)" }}
      transition={{ duration: 0.22 }}
      className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.28)] backdrop-blur-sm transition-shadow"
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {step}
      </p>

      <h3 className="mt-3 text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-slate-300">
        {text}
      </p>

      <ul className="mt-6 space-y-2 text-sm text-slate-300">
        {bullets.map((bullet) => (
          <li key={bullet}>• {bullet}</li>
        ))}
      </ul>
    </motion.div>
  )
}