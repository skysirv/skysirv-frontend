"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import LargeChevron from "@/components/ui/LargeChevron"

const airportPins = [
  {
    code: "SFO",
    city: "San Francisco",
    status: "Minor issues",
    delay: "39m",
    tone: "bg-orange-500",
    className: "left-[45%] top-[50%]",
  },
  {
    code: "OAK",
    city: "Oakland",
    status: "Moving well",
    delay: "12m",
    tone: "bg-emerald-500",
    className: "left-[68%] top-[25%]",
  },
]

const liveSignals = [
  {
    label: "Airport pressure",
    value: "SFO",
    text: "Arrivals are carrying the stronger delay signal right now.",
  },
  {
    label: "Live delay",
    value: "39m",
    text: "Landing delays are elevated, while cancellations remain low.",
  },
  {
    label: "Lucy reads",
    value: "Watch",
    text: "Connections through SFO may need extra breathing room today.",
  },
]

export default function HomepageLabSkysirvLive() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-28">
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center lg:order-2 lg:mx-0 lg:text-left"
        >
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            Live airport intelligence, explained by Lucy.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
            Skysirv Live will help travelers see airport disruption, delay
            pressure, weather impact, and route risk in one calm view — with
            Lucy translating the signal before travel gets messy.
          </p>

          <div className="mt-7 grid gap-2">
            {liveSignals.map((signal) => (
              <div
                key={signal.label}
                className="flex items-center justify-between gap-4 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {signal.label}
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                    {signal.text}
                  </p>
                </div>

                <p className="shrink-0 text-lg font-bold text-slate-950">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/skysirv-live"
            className="mt-7 inline-flex items-center gap-2 text-xl font-bold text-blue-600 transition hover:gap-3 hover:text-blue-700"
          >
            View Skysirv Live
            <LargeChevron direction="right" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
          className="relative mx-auto w-full max-w-3xl pb-28 lg:order-1"
        >
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_75px_rgba(15,23,42,0.10)]">
            <div className="flex h-[70px] items-center justify-between bg-blue-700 px-5 py-0 text-white sm:px-6">
              <span className="relative flex h-12 w-[230px] items-center overflow-visible">
                <img
                  src="/branding/logo/skysirv-live-logo-white.svg"
                  alt="Skysirv Live"
                  className="relative -left-8 top-1 h-auto w-[240px]"
                />
              </span>

              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                Today’s airport pulse
              </h3>
            </div>

            <div className="flex items-center gap-3 overflow-hidden bg-orange-500 px-5 py-2 text-sm font-semibold text-white sm:px-6">
              <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
              <span className="whitespace-nowrap">
                Minor issues · SFO arrivals are averaging 39m late · OAK and SJC are moving cleanly nearby
              </span>
            </div>

            <div className="grid min-h-[390px] gap-0 lg:grid-cols-[220px_1fr]">
              <div className="space-y-3 border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
                {airportPins.slice(0, 4).map((airport) => (
                  <div
                    key={airport.code}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${airport.tone}`}
                        />

                        <p className="text-sm font-bold text-slate-950">
                          {airport.code}
                        </p>
                      </div>

                      <p className="text-xs font-semibold text-slate-500">
                        {airport.delay}
                      </p>
                    </div>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {airport.city}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden bg-slate-100">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      "url('/images/stock/skysirv-live-map.png')",
                  }}
                />

                <div className="absolute inset-0 bg-white/35" />
                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/60 to-transparent" />

                <div className="absolute bottom-2 left-2 z-20 rounded-md bg-white/85 px-2 py-1 text-[9px] font-semibold text-slate-500 shadow-sm backdrop-blur">
                  © Mapbox © OpenStreetMap
                </div>

                <div className="absolute inset-0">
                  {airportPins.map((airport) => (
                    <div
                      key={airport.code}
                      className={`absolute ${airport.className}`}
                    >
                      <div className="relative flex flex-col items-center">
                        <span
                          className={`absolute h-10 w-10 animate-ping rounded-full ${airport.tone} opacity-20`}
                        />

                        <span
                          className={`relative h-4 w-4 rounded-full border-2 border-white ${airport.tone} shadow-[0_8px_18px_rgba(15,23,42,0.20)]`}
                        />

                        <span className="mt-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
                          {airport.code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-14 left-6 right-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:left-12 sm:right-12">
            <img
              src="/images/stock/lucy/lucy-headset.png"
              alt="Lucy explaining live airport intelligence"
              className="h-24 w-24 shrink-0 object-contain drop-shadow-[0_12px_26px_rgba(15,23,42,0.18)]"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                Lucy live read
              </p>

              <p className="mt-1 text-sm font-semibold italic leading-6 text-slate-900">
                “SFO is showing arrival pressure, but cancellations are still
                low. I’d watch connection timing more than airport closure risk.”
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}