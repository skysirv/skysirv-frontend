"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  searchAirports,
  type AirportOption,
} from "@/lib/airports/major-airports"

type SkysirvLiveHeaderProps = {
  mode?: "overview" | "airport"
  airportName?: string
  airportCode?: string
  localTimeLabel?: string
  tickerItems?: string[]
  alertBarClassName?: string
  lastUpdatedAt?: string
}

function formatLocalUpdateTime(timestamp?: string) {
  if (!timestamp) return "Loading..."

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return "Loading..."
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export default function SkysirvLiveHeader({
  mode = "overview",
  airportName,
  airportCode,
  localTimeLabel,
  tickerItems = [],
  alertBarClassName = "bg-red-600",
  lastUpdatedAt,
}: SkysirvLiveHeaderProps) {
  const router = useRouter()
  const mobileAirportSearchRef = useRef<HTMLDivElement | null>(null)
  const desktopAirportSearchRef = useRef<HTMLDivElement | null>(null)
  const [airportSearchValue, setAirportSearchValue] = useState("")
  const [isAirportSearchOpen, setIsAirportSearchOpen] = useState(false)

  const airportSearchResults = useMemo(() => {
    if (mode === "airport") return []
    if (!airportSearchValue.trim()) return []

    return searchAirports(airportSearchValue, 7)
  }, [airportSearchValue, mode])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        !mobileAirportSearchRef.current?.contains(target) &&
        !desktopAirportSearchRef.current?.contains(target)
      ) {
        setIsAirportSearchOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [])

  function handleAirportSearchSelect(airport: AirportOption) {
    setAirportSearchValue("")
    setIsAirportSearchOpen(false)
    router.push(`/skysirv-live/${airport.code}`)
  }

  return (
    <>
      {mode !== "airport" && (
        <header className="pointer-events-auto absolute left-4 right-4 top-4 z-50 md:hidden">
          <div className="mx-auto flex w-full max-w-[360px] items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full bg-blue-700 py-0 pl-2 pr-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>

              Home
            </Link>

            <div
              ref={mobileAirportSearchRef}
              className="relative min-w-0 flex-1"
            >
              <div className="flex h-10 items-center gap-2 rounded-full border border-white/70 bg-white/95 px-3 text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl">
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
                  value={airportSearchValue}
                  onChange={(event) => {
                    setAirportSearchValue(event.target.value)
                    setIsAirportSearchOpen(true)
                  }}
                  onFocus={() => setIsAirportSearchOpen(true)}
                  placeholder="Search airports..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-light text-slate-800 outline-none placeholder:text-slate-500"
                />
              </div>

              {isAirportSearchOpen && airportSearchValue.trim() && (
                <div className="absolute left-0 right-0 top-[48px] z-[60] overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white text-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.28)]">
                  {airportSearchResults.length > 0 ? (
                    airportSearchResults.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => handleAirportSearchSelect(airport)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-slate-950">
                            {airport.displayName ?? airport.name}
                          </span>

                          <span className="block truncate text-xs font-light text-slate-500">
                            {airport.city}, {airport.country}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm font-bold text-slate-500">
                      No airports found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <header
        className={`pointer-events-auto absolute left-5 right-5 top-5 z-30 ${mode === "airport" ? "" : "hidden md:block"
          }`}
      >
        <div className="rounded-[1.35rem] shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
          <div
            className={`flex min-h-[76px] flex-col gap-3 bg-blue-700 px-4 py-4 text-white backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-6 md:py-0 ${mode === "airport" ? "rounded-t-[1.35rem]" : "rounded-[1.35rem]"
              }`}
          >
            <div className="flex items-center gap-4">
              <Link
                href={mode === "airport" ? "/skysirv-live" : "/"}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white py-0 pl-3 pr-4 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>

                {mode === "airport" ? "Live" : "Home"}
              </Link>

              <div>
                {mode === "airport" ? (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                      {airportName}
                    </h1>

                    {localTimeLabel && (
                      <span className="text-sm font-bold text-white/55 sm:text-base">
                        {localTimeLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/branding/icon/skysirv-icon-white-32.png"
                      alt=""
                      width={32}
                      height={32}
                      priority
                      className="h-8 w-8 shrink-0"
                    />

                    <h1 className="text-2xl tracking-tight sm:text-3xl">
                      <span className="font-black">Skysirv</span>{" "}
                      <span className="font-normal">Live</span>
                    </h1>
                  </div>
                )}
              </div>
            </div>

            {mode !== "airport" && (
              <div
                ref={desktopAirportSearchRef}
                className="relative w-full md:ml-auto md:mr-5 md:w-[430px] md:flex-none"
              >
                <div className="flex h-11 items-center gap-3 rounded-full border border-white/25 bg-white/95 px-4 text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
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
                    value={airportSearchValue}
                    onChange={(event) => {
                      setAirportSearchValue(event.target.value)
                      setIsAirportSearchOpen(true)
                    }}
                    onFocus={() => setIsAirportSearchOpen(true)}
                    placeholder="Search airports..."
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-light text-slate-800 outline-none placeholder:text-slate-700"
                  />
                </div>

                {isAirportSearchOpen && airportSearchValue.trim() && (
                  <div className="absolute left-0 right-0 top-[52px] z-50 overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white text-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.28)]">
                    {airportSearchResults.length > 0 ? (
                      airportSearchResults.map((airport) => (
                        <button
                          key={airport.code}
                          type="button"
                          onClick={() => handleAirportSearchSelect(airport)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-sm font-black tracking-tight text-white">
                            {airport.code}
                          </span>

                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black text-slate-950">
                              {airport.displayName ?? airport.name}
                            </span>

                            <span className="block truncate text-xs font-bold text-slate-500">
                              {airport.city}, {airport.country}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-sm font-bold text-slate-500">
                        No airports found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="hidden items-center gap-3 text-xl font-bold text-white md:flex">
              <span className="h-4 w-4 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
              {mode === "airport"
                ? "SKYSIRV.COM/LIVE"
                : `Live FAA Data · Last update: ${formatLocalUpdateTime(lastUpdatedAt)}`}
            </div>
          </div>

          {mode === "airport" && (
            <div
              className={`flex h-9 items-center overflow-hidden rounded-b-[1.35rem] px-5 text-sm font-bold text-white ${alertBarClassName}`}
            >
              <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-white" />

              <span className="whitespace-nowrap">
                {tickerItems.length > 0
                  ? tickerItems.join(" · ")
                  : `${airportCode} is showing elevated airport pressure right now.`}
              </span>
            </div>
          )}
        </div>
      </header>
    </>
  )
}