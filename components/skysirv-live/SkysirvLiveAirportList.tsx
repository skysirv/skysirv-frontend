"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  getSeverityStyles,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"
import { searchAirports } from "@/lib/airports/major-airports"

const regionOptions = [
  { key: "all", label: "All" },
  { key: "north-america", label: "North America" },
  { key: "europe", label: "Europe" },
  { key: "asia", label: "Asia" },
  { key: "africa", label: "Africa" },
  { key: "south-america", label: "South America" },
  { key: "middle-east", label: "Middle East" },
  { key: "pacific", label: "Pacific" },
]

export type AirportTypeFilter = "major" | "regional"

const airportTypeFilterOptions: Array<{
  key: AirportTypeFilter
  label: string
}> = [
    { key: "major", label: "Major airports" },
    { key: "regional", label: "Regional airports" },
  ]

export default function SkysirvLiveAirportList({
  airports,
  onAirportSelect,
  activeRegion = "north-america",
  onRegionSelect,
  activeAirportTypeFilters = ["major", "regional"],
  onAirportTypeFilterToggle,
  mobileDrawerExpanded,
  onMobileDrawerExpandedChange,
}: {
  airports: SkysirvLiveAirport[]
  onAirportSelect?: (airport: SkysirvLiveAirport) => void
  activeRegion?: string
  onRegionSelect?: (regionKey: string) => void
  activeAirportTypeFilters?: AirportTypeFilter[]
  onAirportTypeFilterToggle?: (airportTypeFilter: AirportTypeFilter) => void
  mobileDrawerExpanded?: boolean
  onMobileDrawerExpandedChange?: (isExpanded: boolean) => void
}) {
  const touchStartYRef = useRef<number | null>(null)
  const [internalMobileDrawerExpanded, setInternalMobileDrawerExpanded] =
    useState(true)
  const isMobileDrawerExpanded =
    mobileDrawerExpanded ?? internalMobileDrawerExpanded
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false)
  const [mobileAirportSearchValue, setMobileAirportSearchValue] = useState("")
  const [isMobileAirportSearchOpen, setIsMobileAirportSearchOpen] =
    useState(false)

  const activeRegionLabel = useMemo(() => {
    return (
      regionOptions.find((region) => region.key === activeRegion)?.label ??
      "North America"
    )
  }, [activeRegion])

  const mobileAirportSearchResults = useMemo(() => {
    if (!mobileAirportSearchValue.trim()) return []

    return searchAirports(mobileAirportSearchValue, 6)
  }, [mobileAirportSearchValue])

  function setMobileDrawerExpanded(
    nextExpanded: boolean | ((current: boolean) => boolean),
  ) {
    const resolvedExpanded =
      typeof nextExpanded === "function"
        ? nextExpanded(isMobileDrawerExpanded)
        : nextExpanded

    setInternalMobileDrawerExpanded(resolvedExpanded)
    onMobileDrawerExpandedChange?.(resolvedExpanded)
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const startY = touchStartYRef.current
    const endY = event.changedTouches[0]?.clientY ?? null

    touchStartYRef.current = null

    if (startY === null || endY === null) return

    const distance = startY - endY

    if (distance > 36) {
      setMobileDrawerExpanded(true)
    }

    if (distance < -36) {
      setMobileDrawerExpanded(false)
      setIsRegionMenuOpen(false)
    }
  }

  function handleRegionSelect(regionKey: string) {
    setIsRegionMenuOpen(false)
    setIsMobileAirportSearchOpen(false)
    onRegionSelect?.(regionKey)
  }

  return (
    <>
      <aside className="pointer-events-auto absolute bottom-[76px] left-5 top-[118px] z-20 hidden w-[390px] max-w-[calc(100vw-40px)] md:block">
        <div className="flex h-full flex-col gap-3">
          <div className="shrink-0 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_16px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                Airport filters
              </p>

              <p className="text-[11px] font-black text-slate-400">
                Visible airports
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {airportTypeFilterOptions.map((filterOption) => {
                const isActive = activeAirportTypeFilters.includes(filterOption.key)

                return (
                  <button
                    key={filterOption.key}
                    type="button"
                    onClick={() => onAirportTypeFilterToggle?.(filterOption.key)}
                    className={`flex h-9 items-center justify-center rounded-xl px-3 text-xs font-black transition ${isActive
                      ? "bg-blue-700 text-white shadow-[0_10px_22px_rgba(29,78,216,0.22)]"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                      }`}
                  >
                    {filterOption.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-10 [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-72px),transparent_100%)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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

      <aside
        className={`pointer-events-auto absolute inset-x-0 bottom-0 z-40 rounded-t-[2rem] bg-white shadow-[0_-18px_55px_rgba(15,23,42,0.22)] transition-[height] duration-300 ease-out md:hidden ${isMobileDrawerExpanded ? "h-[54svh]" : "h-[104px]"
          }`}
      >
        <div className="flex h-full flex-col overflow-visible px-5 pb-5 pt-3">
          <button
            type="button"
            onClick={() => setMobileDrawerExpanded((current) => !current)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-slate-300"
            aria-label="Resize live disruptions drawer"
          />

          <div className="mt-4">
            <h2 className="w-full whitespace-nowrap text-center text-[26px] font-black tracking-tight text-slate-950">
              Live Disruptions
            </h2>

            {isMobileDrawerExpanded && (
              <>
                <div className="relative mx-auto mt-4 w-full max-w-[320px]">
                  <div className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-slate-800">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21 21-4.35-4.35" />
                      <circle cx="11" cy="11" r="7" />
                    </svg>

                    <input
                      type="search"
                      value={mobileAirportSearchValue}
                      onChange={(event) => {
                        setMobileAirportSearchValue(event.target.value)
                        setIsMobileAirportSearchOpen(true)
                        setIsRegionMenuOpen(false)
                      }}
                      onFocus={() => {
                        setIsMobileAirportSearchOpen(true)
                        setIsRegionMenuOpen(false)
                      }}
                      placeholder="Search airports (e.g. BOS or Logan...)"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm font-light text-slate-800 outline-none placeholder:text-slate-500"
                    />
                  </div>

                  {isMobileAirportSearchOpen &&
                    mobileAirportSearchValue.trim() && (
                      <div className="absolute left-0 right-0 top-[48px] z-50 overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white text-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.22)]">
                        {mobileAirportSearchResults.length > 0 ? (
                          mobileAirportSearchResults.map((airport) => (
                            <Link
                              key={airport.code}
                              href={`/skysirv-live/${airport.code.toLowerCase()}`}
                              onClick={() => {
                                setMobileAirportSearchValue("")
                                setIsMobileAirportSearchOpen(false)
                              }}
                              className="block px-4 py-3 text-left transition hover:bg-slate-50"
                            >
                              <span className="block truncate text-sm font-semibold text-slate-950">
                                {airport.displayName ?? airport.name}
                              </span>

                              <span className="block truncate text-xs font-light text-slate-500">
                                {airport.city}, {airport.country}
                              </span>
                            </Link>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-sm font-bold text-slate-500">
                            No airports found.
                          </div>
                        )}
                      </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="relative min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegionMenuOpen((current) => !current)
                        setIsMobileAirportSearchOpen(false)
                      }}
                      className="inline-flex h-9 w-[150px] items-center justify-between rounded-2xl bg-slate-100 px-3 text-xs font-black text-slate-500"
                    >
                      <span className="truncate">{activeRegionLabel}</span>

                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 shrink-0 transition ${isRegionMenuOpen ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    {isRegionMenuOpen && (
                      <div className="absolute bottom-[48px] left-0 z-50 w-[270px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.24)]">
                        {regionOptions.map((region) => {
                          const isActive = activeRegion === region.key

                          return (
                            <button
                              key={region.key}
                              type="button"
                              onClick={() => handleRegionSelect(region.key)}
                              className={`flex w-full items-center justify-between rounded-2xl px-4 py-2 text-left text-base font-semibold transition ${isActive
                                ? "bg-slate-100 text-slate-950"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                            >
                              {region.label}

                              {isActive && (
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                  <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="m5 12 4 4 10-10" />
                                  </svg>
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex h-9 shrink-0 items-center rounded-2xl bg-slate-100 p-1">
                    <button
                      type="button"
                      className="inline-flex h-7 items-center gap-1.5 rounded-2xl bg-white px-2.5 text-xs font-black text-slate-950 shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Live
                    </button>

                    <button
                      type="button"
                      className="h-7 rounded-2xl px-2.5 text-xs font-black text-slate-400"
                    >
                      Today
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {isMobileDrawerExpanded && (
            <>
              <div className="mt-5 flex items-center justify-between border-b border-slate-200 pb-3 text-sm font-black text-slate-400">
                <span>Airport</span>
                <span>City</span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {airports.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm font-black text-slate-950">
                      No tracked airports in view
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      Pan or zoom the map to bring monitored airports into view.
                    </p>
                  </div>
                )}

                {airports.map((airport) => {
                  const styles = getSeverityStyles(airport.severity)

                  return (
                    <Link
                      key={airport.code}
                      href={`/skysirv-live/${airport.code.toLowerCase()}`}
                      onClick={() => onAirportSelect?.(airport)}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 py-3.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${styles.dot} shadow-[0_0_0_6px_rgba(251,191,36,0.14)]`}
                        />

                        <span className="shrink-0 text-sm font-black text-slate-950">
                          {airport.code}
                        </span>

                        <span className="min-w-0 truncate text-sm font-semibold text-slate-950">
                          {airport.name}
                        </span>
                      </div>

                      <span className="max-w-[96px] truncate text-right text-sm font-semibold text-slate-500">
                        {airport.city}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}