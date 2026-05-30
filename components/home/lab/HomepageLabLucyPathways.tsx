"use client"

import { motion } from "framer-motion"

const pathwayItems = [
  {
    label: "Find flights",
    title: "Start with live flight options.",
    text: "Search flight options when you are ready to book, then let Lucy help you think beyond price alone.",
    image: "/images/stock/find-flights.jpg",
  },
  {
    label: "Track a route",
    title: "Watch the routes that matter.",
    text: "Monitor important routes before prices move, so your travel decisions are not rushed or reactive.",
    image: "/images/stock/track-route-2.jpg",
  },
  {
    label: "Watch fare movement",
    title: "Understand what prices are doing.",
    text: "Lucy helps explain whether a fare looks strong, high, stable, or worth watching a little longer.",
    image: "/images/stock/fare-movement.jpg",
  },
  {
    label: "Remember my travel style",
    title: "Let Lucy learn how you fly.",
    text: "Over time, Lucy can use your travel preferences to make future planning feel more personal.",
    image: "/images/stock/travel-style.jpg",
  },
]

export default function HomepageLabLucyPathways() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-12 pt-24 sm:pb-16 sm:pt-28">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Let Lucy guide the way you fly.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            From finding flights to watching fare movement, Lucy helps turn travel
            decisions into a calmer, more informed experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >

          <div className="relative grid gap-4 md:grid-cols-2">
            {pathwayItems.map((item, index) => (
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
                className="group relative isolate aspect-square overflow-hidden rounded-[1.75rem] border border-white/70 bg-slate-950 p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.7] transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/72 via-slate-950/28 to-slate-950/10" />

                <div className="relative z-10 flex h-full flex-col justify-start">
                  <span className="w-fit rounded-full border border-blue-700 bg-blue-700 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {item.label}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-white drop-shadow-[0_3px_14px_rgba(2,6,23,0.45)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-medium font-semibold leading-6 text-white/90 drop-shadow-[0_3px_14px_rgba(2,6,23,0.45)]">
                    {item.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
          className="mx-auto mt-16 max-w-4xl text-center"
        >
        </motion.div>
      </div>
    </section>
  )
}