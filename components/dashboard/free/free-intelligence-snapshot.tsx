"use client"

import { motion } from "framer-motion"

type FreeIntelligenceSnapshotProps = {
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

function LightFeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
      <p className="text-base font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>
    </div>
  )
}

export default function FreeIntelligenceSnapshot({
  fadeUp,
}: FreeIntelligenceSnapshotProps) {
  return (
    <motion.section {...fadeUp} className="mt-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          Free Intelligence Snapshot
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          A clean starting point for smarter flight decisions
        </h2>

        <p className="mt-4 text-base leading-8 text-slate-600">
          Your Free dashboard keeps the experience intentionally focused:
          track a few routes, learn how Skysirv reads airfare movement, and
          upgrade when you are ready for deeper intelligence.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <LightFeatureCard
          title="Basic price memory"
          description="Skysirv begins building context around the routes you monitor so future insights can become more useful over time."
        />
        <LightFeatureCard
          title="Simple route tracking"
          description="Keep an eye on a limited number of trips without needing to manually check fares every day."
        />
        <LightFeatureCard
          title="Introductory guidance"
          description="Use preview signals and route summaries to understand how the platform turns price movement into action."
        />
      </div>
    </motion.section>
  )
}