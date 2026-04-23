"use client"

import { motion } from "framer-motion"

const featuredInItems = [
  "TechCrunch",
  "Forbes",
  "The Points Guy",
  "Condé Nast Traveler",
  "Travel + Leisure",
  "PhocusWire",
  "Skift",
  "Business Insider",
]

export default function FeaturedInSection() {
  const repeatedItems = [...featuredInItems, ...featuredInItems]

  return (
    <section className="relative w-full overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm">
          Featured In
        </div>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Built for the next era of flight intelligence
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          As Skysirv grows, this section will showcase the publications, platforms,
          and travel voices helping spotlight the new intelligence layer behind smarter booking.
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-4"
        >
          {repeatedItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex h-16 min-w-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm"
            >
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}