"use client"

import { motion } from "framer-motion"

const userStories = [
  {
    person: "The frequent flyer",
    route: "BOS → MIA",
    quote: "A Miami fare drops overnight, but Lucy helps explain whether it is a real opportunity or just normal movement.",
    title: "Lucy helps turn route movement into clearer timing guidance.",
    details:
      "Instead of checking prices over and over, travelers can watch a route and understand whether the market looks calm, high, moving, or worth waiting on.",
  },
  {
    person: "The family planner",
    route: "BOS → MCO",
    quote: "A family trip starts with preferences Lucy already understands: fewer stops, better timing, and less airport stress.",
    title: "Skysirv can account for comfort, timing, layovers, and preferences.",
    details:
      "Lucy can remember how a family likes to travel, then help make future searches feel less repetitive and less stressful.",
  },
  {
    person: "The business traveler",
    route: "NYC → SFO",
    quote: "A recurring business route stays on watch while Skysirv surfaces the moments that actually need attention.",
    title: "Recurring travel decisions become easier to follow.",
    details:
      "Skysirv helps surface route signals, airport pressure, and changing travel conditions so decisions can happen faster and with less noise.",
  },
]

export default function HomepageLabUserStories() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Built around the moments travelers actually feel.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Skysirv is being designed for the questions travelers ask before
            they book, while they monitor routes, and when travel conditions
            start changing.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 lg:grid-cols-3">
          {userStories.map((story, index) => (
            <motion.article
              key={story.person}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.52,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                  {story.person}
                </p>
              </div>

              <p className="mt-8 text-xl font-bold italic leading-8 tracking-tight text-slate-950">
                “{story.quote}”
              </p>

              <div className="mt-7 border-t border-slate-200 pt-5">
                <h3 className="text-base font-bold leading-6 text-slate-950">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {story.details}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}