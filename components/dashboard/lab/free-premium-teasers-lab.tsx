"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type FadeUp = {
  initial: { opacity: number; y: number }
  whileInView: { opacity: number; y: number }
  viewport: { once: boolean; amount: number }
  transition: { duration: number; ease: "easeOut" }
}

type FreePreviewUpgradeSectionProps = {
  fadeUp?: FadeUp
}

const proTeasers = [
  {
    eyebrow: "Pro",
    title: "Lucy route guidance",
    description:
      "Ask Lucy why a route is worth watching, how saved flights compare, and when a fare may need attention.",
    tags: ["Route explanations", "Saved-flight context", "Booking timing"],
    cta: "Unlock Lucy",
  },
  {
    eyebrow: "Pro + Business",
    title: "Flight Intelligence Portfolio",
    description:
      "See ranked booking opportunities, saved fare changes, and a compact decision brief across your travel plans.",
    tags: ["Decision stack", "Fare movement", "Daily route brief"],
    cta: "Preview portfolio",
  },
]

export default function FreePreviewUpgradeSection({
  fadeUp,
}: FreePreviewUpgradeSectionProps) {
  return (
    <motion.section {...(fadeUp ?? {})} className="pb-10">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT SIDE */}
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Unlock more intelligence
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950">
              Free gives you the basics. Pro unlocks the intelligence layer.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Upgrade when you want Lucy guidance, deeper route context, larger
              tracking limits, portfolio-level decision support, and yearly
              travel intelligence with the Skysirv Travel Globe.
            </p>

            <div className="mt-6 space-y-4">
              {proTeasers.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      {item.eyebrow}
                    </p>

                    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Locked
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      {item.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/choose-plan"
                className="inline-flex items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                Upgrade to Pro
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                Compare plans
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-[linear-gradient(180deg,#020617_0%,#020617_35%,#020b24_100%)] p-5 sm:p-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_18px_50px_rgba(2,6,23,0.38)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    Intelligence Wrapped Preview
                  </p>

                  <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    Travel Globe + Airport Intelligence
                  </h3>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  Pro Preview
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <PreviewImageCard
                  label="Satellite Globe View"
                  imageSrc="/images/free-dashboard/globe-preview-1.jpg"
                  imageAlt="Skysirv satellite globe preview"
                />

                <PreviewImageCard
                  label="Airport Intelligence Card"
                  imageSrc="/images/free-dashboard/globe-preview-2.jpg"
                  imageAlt="Skysirv airport intelligence preview"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Locked preview
                </p>

                <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Intelligence Wrapped unlocks with Pro and Business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function PreviewImageCard({
  label,
  imageSrc,
  imageAlt,
}: {
  label: string
  imageSrc: string
  imageAlt: string
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          {label}
        </p>

        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          Preview
        </span>
      </div>

      <div className="group overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  )
}