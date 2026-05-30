"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function HomepageLabFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-28 pt-16 sm:pb-32 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_75px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12"
      >
        <div className="relative mx-auto max-w-3xl">
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Let Lucy guide your next flight decision.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Start with a flight search, create your account, or let Skysirv help
            you understand fare movement before you book.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Find flights
            </Link>

            <Link
              href="/create-account"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              Create account
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}