"use client"

import { motion } from "framer-motion"

type FreeQuickStatsProps = {
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

export default function FreeQuickStats({ fadeUp }: FreeQuickStatsProps) {
  return (
    <motion.section
      {...fadeUp}
      className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <InfoCard
        label="Monitoring Cadence"
        value="Standard"
        description="Steady route tracking for users getting started."
      />
      <InfoCard
        label="Price History"
        value="Basic"
        description="Light fare snapshots instead of deep historical analysis."
      />
      <InfoCard
        label="Alerts"
        value="Limited"
        description="Essential signals without the advanced intelligence stack."
      />
      <InfoCard
        label="Skyscore™"
        value="Preview"
        description="A teaser of your intelligence profile, not the full readout."
      />
    </motion.section>
  )
}