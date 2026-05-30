"use client"

import { motion } from "framer-motion"

const memoryCards = [
  {
    label: "Panama",
    image: "/images/stock/memory-panama.jpg",
    className:
      "left-[2%] top-[33%] h-[150px] w-[210px] sm:h-[170px] sm:w-[240px]",
    labelClassName: "right-[-42px] top-[52%]",
  },
  {
    label: "Tokyo",
    image: "/images/stock/memory-tokyo.jpg",
    className:
      "left-[22%] top-[2%] h-[150px] w-[170px] sm:h-[175px] sm:w-[195px]",
    labelClassName: "right-[-48px] top-[54%]",
  },
  {
    label: "Sydney",
    image: "/images/stock/memory-sydney.jpg",
    className:
      "right-[10%] top-[5%] h-[155px] w-[195px] sm:h-[180px] sm:w-[225px]",
    labelClassName: "right-[-44px] top-[18%]",
  },
  {
    label: "Family trips",
    image: "/images/stock/memory-family.jpg",
    className:
      "left-[8%] bottom-[4%] h-[150px] w-[220px] sm:h-[175px] sm:w-[250px]",
    labelClassName: "right-[-50px] top-[20%]",
  },
  {
    label: "Beach escapes",
    image: "/images/stock/memory-beach.jpg",
    className:
      "right-[20%] bottom-[2%] h-[155px] w-[170px] sm:h-[180px] sm:w-[195px]",
    labelClassName: "right-[-72px] top-[62%]",
  },
]

export default function HomepageLabLucyMemory() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-28">
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative mx-auto h-[520px] w-full max-w-3xl sm:h-[600px]"
        >
          {memoryCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              className={`absolute overflow-visible ${card.className}`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-slate-200 shadow-[0_22px_60px_rgba(15,23,42,0.13)]">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.9] transition duration-700 hover:scale-105"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/18" />
              </div>

              <div
                className={`absolute z-20 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_12px_35px_rgba(15,23,42,0.12)] ${card.labelClassName}`}
              >
                {card.label}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.18 }}
            className="absolute left-[50%] top-[28%] z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <img
              src="/images/stock/lucy/lucy-pos-1.png"
              alt="Lucy"
              className="h-52 w-auto object-contain drop-shadow-[0_22px_45px_rgba(15,23,42,0.18)] sm:h-60"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Lucy learns how you like to travel.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            From home airports and preferred airlines to nonstop flights, family
            trips, cabin preferences, and favorite destinations, Lucy can use
            your travel style to make future planning feel more personal.
          </p>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            The more Lucy understands your preferences, the more Skysirv can
            help shape flight search, route tracking, and travel decisions around
            the way you actually fly.
          </p>

          <button
            type="button"
            className="mt-7 inline-flex items-center gap-2 text-medium font-bold text-blue-600 transition hover:gap-3 hover:text-blue-700"
          >
            Explore Lucy’s memory
            <span aria-hidden="true">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}