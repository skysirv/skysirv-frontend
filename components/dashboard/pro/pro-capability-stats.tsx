"use client"

import { motion } from "framer-motion"

type ProCapabilityStatsProps = {
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

function InfoCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </motion.div>
  )
}

export default function ProCapabilityStats({ fadeUp }: ProCapabilityStatsProps) {
  return (
    <motion.section
      {...fadeUp}
      className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <InfoCard
        label="Price Behavior™"
        value="30–90 Day Window"
        description="Pro supports deeper historical monitoring windows once your tracked routes begin collecting enough data."
      />
      <InfoCard
        label="Skysirv Signals™"
        value="Pro Access"
        description="Signal visibility becomes available as monitored routes build real pricing history over time."
      />
      <InfoCard
        label="Skyscore™"
        value="Included"
        description="Pro includes full scoring access when enough real monitoring data exists to generate it."
      />
      <InfoCard
        label="Forecast Visibility"
        value="Available"
        description="Forward-looking guidance appears once monitored routes have enough live data to support it."
      />
    </motion.section>
  )
}