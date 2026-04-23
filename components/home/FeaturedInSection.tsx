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

        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Featured in
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Skysirv™ is proud to be featured across respected travel, technology, and business media. We are your go-to source for the best flight intelligence and insights.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50/70 py-4">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            className="flex w-max items-center gap-4"
          >
            {repeatedItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex h-20 min-w-[240px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400 shadow-sm"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}