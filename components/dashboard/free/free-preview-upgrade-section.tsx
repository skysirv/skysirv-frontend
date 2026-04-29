"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type FreePreviewUpgradeSectionProps = {
  fadeUp: {
    initial: { opacity: number; y: number }
    whileInView: { opacity: number; y: number }
    viewport: { once: boolean; amount: number }
    transition: { duration: number; ease: "easeOut" }
  }
}

function PreviewRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function UpgradeFeature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  )
}

export default function FreePreviewUpgradeSection({
  fadeUp,
}: FreePreviewUpgradeSectionProps) {
  return (
    <motion.section
      {...fadeUp}
      className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
    >
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
          Skyscore™ Preview
        </p>

        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          64
        </h3>

        <p className="mt-3 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Preview only on Free
        </p>

        <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
          You can preview your intelligence standing, but deeper scoring,
          stronger signal interpretation, and richer behavior analysis are
          unlocked on paid plans.
        </p>

        <div className="mt-8 space-y-4">
          <PreviewRow
            label="Decision confidence"
            value="Visible in preview"
          />
          <PreviewRow
            label="Advanced scoring logic"
            value="Unlock on Pro"
          />
          <PreviewRow
            label="Route-level intelligence depth"
            value="Unlock on Pro / Business"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-8 text-white shadow-[0_24px_60px_rgba(2,6,23,0.18)]">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">
          What you unlock next
        </p>

        <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Upgrade when intelligence starts to matter more
        </h3>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Pro and Business open up deeper forecasting, richer route
          behavior analysis, stronger alerting, and full access to more of
          the Skysirv intelligence stack.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <UpgradeFeature
            title="Pro"
            description="Full Skyscore™, stronger signals, forecast visibility, and up to 25 monitored routes."
          />
          <UpgradeFeature
            title="Business"
            description="Full intelligence engine access, enhanced analysis, broader history, and premium monitoring depth."
          />
        </div>

        <div className="mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Compare Plans
          </Link>
        </div>
      </div>
    </motion.section>
  )
}