"use client"

import { motion, type Variants } from "framer-motion"

type ProStackSectionProps = {
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
  staggerContainer: Variants
  staggerItem: Variants
}

const proIntelligenceItems = [
  {
    title: "Skysirv Monitor™",
    stat: "25 route capacity",
    description:
      "High-frequency route monitoring designed for travelers with a more active booking strategy.",
  },
  {
    title: "Skysirv Signals™",
    stat: "Smart drop detection",
    description:
      "Stronger signal visibility with more actionable fare timing and booking opportunity awareness.",
  },
  {
    title: "Skysirv Price Behavior™",
    stat: "30–90 day analysis",
    description:
      "Expanded lookback windows to understand pricing direction, route pressure, and volatility patterns.",
  },
  {
    title: "Skysirv Predict™",
    stat: "Forecast signals",
    description:
      "Forward-looking guidance designed to help you avoid weak timing and identify stronger buy windows.",
  },
  {
    title: "Skyscore™",
    stat: "Full intelligence scoring",
    description:
      "A complete scoring layer that reflects booking quality, timing confidence, and decision discipline.",
  },
  {
    title: "Skysirv Route Digest™",
    stat: "Included",
    description:
      "A richer route summary layer with digest-style intelligence across your monitored activity.",
  },
]

function DarkWrappedCard({
  item,
  index,
}: {
  item: {
    title: string
    stat: string
    description: string
  }
  index: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.55,
            ease: "easeOut",
          },
        },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_45%)]" />
      </div>

      <div className="relative">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-sm font-semibold text-white">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Active
          </div>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-white">
          {item.title}
        </h3>

        <p className="mt-3 text-sm font-medium text-sky-200">{item.stat}</p>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function ProStackSection({
  fadeUp,
  staggerContainer,
  staggerItem,
}: ProStackSectionProps) {
  return (
    <motion.section
      {...fadeUp}
      className="relative mb-12 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-5 py-10 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:px-7 md:px-8 md:py-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-[-60px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-80px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mb-9 max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            Pro Intelligence Stack
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            More signal, stronger route awareness
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Pro gives you access to the core intelligence layers that transform
            tracked routes into better timing decisions.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {proIntelligenceItems.map((item, index) => (
            <motion.div key={item.title} variants={staggerItem}>
              <DarkWrappedCard item={item} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}