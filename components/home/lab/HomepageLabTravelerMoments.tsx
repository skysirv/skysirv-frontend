"use client"

import { motion } from "framer-motion"

const travelerMoments = [
  {
    label: "Frequent travelers",
    code: "FREQ",
    quote: "I want to know if this fare is actually worth booking.",
    title: "Understand the why behind the price.",
    text: "Track important routes and let Lucy explain whether movement looks strong, high, stable, or worth watching.",
  },
  {
    label: "Families",
    code: "FAM",
    quote: "I need flights that work for how my family actually travels.",
    title: "Plan around real preferences.",
    text: "Lucy can remember nonstop flights, comfortable layovers, home airports, and the way your family likes to travel.",
  },
  {
    label: "Business travelers",
    code: "BIZ",
    quote: "I do not want to keep checking the same routes every day.",
    title: "Monitor important routes calmly.",
    text: "Skysirv helps keep an eye on recurring routes so travelers and teams can make faster decisions with less noise.",
  },
]

export default function HomepageLabTravelerMoments() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-28">
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            For travelers who want the why behind the price.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            Skysirv is built for people who do not just want another list of
            fares. Lucy helps bring context, timing, and personal travel style
            into the decision before you book.
          </p>

          <button
            type="button"
            className="mt-7 inline-flex items-center gap-2 text-medium font-bold text-blue-600 transition hover:gap-3 hover:text-blue-700"
          >
            See who Skysirv is for
            <span aria-hidden="true">→</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="relative mx-auto w-full max-w-3xl"
        >
          <div className="grid gap-3">
            {travelerMoments.map((item, index) => (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.48,
                  ease: "easeOut",
                  delay: index * 0.08,
                }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.10)]"
              >
                <div className="pointer-events-none absolute left-[112px] top-[-10px] h-5 w-5 rounded-full border border-slate-200 bg-white" />
                <div className="pointer-events-none absolute left-[112px] bottom-[-10px] h-5 w-5 rounded-full border border-slate-200 bg-white" />

                <div className="grid min-h-[104px] grid-cols-[96px_1fr]">
                  <div className="relative flex flex-col justify-between bg-blue-700 px-3 py-3 text-white">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                        Boarding
                      </p>

                      <p className="mt-2 text-2xl font-bold tracking-tight">
                        {item.code}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                        Skysirv
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white/75">
                        Lucy guided
                      </p>
                    </div>
                  </div>

                  <div className="relative border-l border-dashed border-slate-200 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.label}
                        </p>

                        <p className="mt-2 text-sm font-semibold italic leading-6 text-slate-950 sm:text-base">
                          “{item.quote}”
                        </p>
                      </div>

                      <div className="hidden shrink-0 rounded-full bg-blue-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:block">
                        Seat {index + 1}A
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-[0.9fr_1.1fr] sm:items-start">
                      <h3 className="text-base font-bold tracking-tight text-slate-950">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}