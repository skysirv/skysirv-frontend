"use client"

import Link from "next/link"

type BottomNavMode = "regions" | "airport" | "aircraft"

type RegionTab = {
  key: string
  label: string
}

type AirportTab = {
  key: string
  label: string
}

type AircraftViewKey =
  | "overview"
  | "origin"
  | "destination"
  | "schedule"
  | "duration"
  | "delay-risk"
  | "route"

type AircraftTab = {
  key: AircraftViewKey
  label: string
}

const regionTabs: RegionTab[] = [
  { key: "all", label: "Global" },
  { key: "north-america", label: "North America" },
  { key: "europe", label: "Europe" },
  { key: "asia", label: "Asia" },
  { key: "africa", label: "Africa" },
  { key: "south-america", label: "South America" },
  { key: "middle-east", label: "Middle East" },
  { key: "pacific", label: "Pacific" },
]

const airportTabs: AirportTab[] = [
  { key: "overview", label: "Summary" },
  { key: "delays", label: "Delays" },
  { key: "departures", label: "Departures" },
  { key: "arrivals", label: "Arrivals" },
  { key: "weather", label: "Weather Conditions" },
  { key: "routes", label: "Route Pressure" },
  { key: "airlines", label: "Airline Impact" },
]

const aircraftTabs: AircraftTab[] = [
  { key: "overview", label: "Summary" },
  { key: "origin", label: "Origin Airport" },
  { key: "destination", label: "Destination Airport" },
  { key: "schedule", label: "Scheduled Times" },
  { key: "duration", label: "Duration" },
  { key: "delay-risk", label: "Delay Risk" },
  { key: "route", label: "Route" },
]

export default function SkysirvLiveBottomNav({
  mode,
  activeKey,
  airportCode,
  onRegionSelect,
  onAircraftViewSelect,
}: {
  mode: BottomNavMode
  activeKey: string
  airportCode?: string
  onRegionSelect?: (regionKey: string) => void
  onAircraftViewSelect?: (aircraftViewKey: AircraftViewKey) => void
}) {
  const tabs =
    mode === "regions"
      ? regionTabs
      : mode === "aircraft"
        ? aircraftTabs
        : airportTabs

  return (
    <nav className="pointer-events-auto absolute bottom-0 left-0 right-0 z-30 border-t border-slate-200/70 bg-white/78 px-6 backdrop-blur-xl">
      <div className="flex min-h-[56px] items-center gap-7 overflow-x-auto text-medium font-black uppercase tracking-[0.12em] text-slate-400">
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key

          if (mode === "regions") {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onRegionSelect?.(tab.key)}
                className={`shrink-0 uppercase transition ${isActive ? "text-slate-950" : "hover:text-slate-700"
                  }`}
              >
                {tab.label}
              </button>
            )
          }

          if (mode === "aircraft") {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onAircraftViewSelect?.(tab.key as AircraftViewKey)}
                className={`shrink-0 uppercase transition ${isActive ? "text-slate-950" : "hover:text-slate-700"
                  }`}
              >
                {tab.label}
              </button>
            )
          }

          return (
            <Link
              key={tab.key}
              href={`/skysirv-live/${airportCode?.toLowerCase()}?view=${tab.key}`}
              className={`shrink-0 uppercase transition ${isActive ? "text-slate-950" : "hover:text-slate-700"
                }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}