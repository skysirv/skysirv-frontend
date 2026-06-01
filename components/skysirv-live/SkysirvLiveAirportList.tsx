"use client"

import Link from "next/link"
import {
  getSeverityStyles,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"

export default function SkysirvLiveAirportList({
  airports,
  onAirportSelect,
}: {
  airports: SkysirvLiveAirport[]
  onAirportSelect?: (airport: SkysirvLiveAirport) => void
}) {
  return (
    <aside className="pointer-events-auto absolute bottom-[76px] left-5 top-[118px] z-20 w-[390px] max-w-[calc(100vw-40px)]">
      <div className="relative h-full">
        <div className="h-full space-y-3 overflow-y-auto pb-10 [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-72px),transparent_100%)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {airports.length === 0 && (
            <div className="rounded-2xl border border-white/70 bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <p className="text-sm font-black text-slate-950">
                No tracked airports in view
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pan or zoom the map to bring monitored airports into view.
              </p>
            </div>
          )}

          {airports.map((airport) => {
            const styles = getSeverityStyles(airport.severity)
            const pressure = Math.min(
              100,
              airport.departuresDelay + airport.arrivalsDelay
            )

            return (
              <Link
                key={airport.code}
                href={`/skysirv-live/${airport.code.toLowerCase()}`}
                onClick={() => onAirportSelect?.(airport)}
                className="block rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_48px_rgba(15,23,42,0.16)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <p className="w-12 text-xl font-black text-slate-500">
                      {airport.code}
                    </p>

                    <div>
                      <p className="text-lg font-black leading-6 text-slate-950">
                        {airport.city}
                      </p>

                      <p className={`mt-1 text-xs font-bold ${styles.text}`}>
                        {styles.label}
                      </p>
                    </div>
                  </div>

                  <span className={`mt-1 h-3 w-3 rounded-full ${styles.dot}`} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-bold">
                  <div>
                    <p className="text-slate-400">Departures</p>
                    <p className="mt-1 text-xl text-slate-950">
                      {airport.departuresDelay}m
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">Arrivals</p>
                    <p className="mt-1 text-xl text-slate-950">
                      {airport.arrivalsDelay}m
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${styles.bar}`}
                    style={{ width: `${pressure}%` }}
                  />
                </div>
              </Link>
            )
          })}

          <div className="h-10" />
        </div>
      </div>
    </aside>
  )
}