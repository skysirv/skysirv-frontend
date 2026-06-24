"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  searchAirports,
  type AirportOption,
} from "@/lib/airports/major-airports"
import LargeChevron from "@/components/ui/LargeChevron"

export type SkysirvLiveMode = "disruptions" | "aircraft"

type SkysirvLiveHeaderProps = {
  mode?: "overview" | "airport"
  airportName?: string
  airportCode?: string
  localTimeLabel?: string
  tickerItems?: string[]
  alertBarClassName?: string
  lastUpdatedAt?: string
  activeLiveMode?: SkysirvLiveMode
  onLiveModeChange?: (liveMode: SkysirvLiveMode) => void
  overviewBackLabel?: string
  onOverviewBackClick?: () => void
}

const liveModeOptions: Array<{
  key: SkysirvLiveMode
  label: string
}> = [
    { key: "disruptions", label: "Live Disruptions" },
    { key: "aircraft", label: "Live Aircraft" },
  ]

const liveModeLogoSrc: Record<SkysirvLiveMode, string> = {
  disruptions: "/branding/logo/skysirv-live-disruptions-white.svg",
  aircraft: "/branding/logo/skysirv-live-aircraft-white.svg",
}

function BetaText() {
  return (
    <span className="relative top-[4px] inline-flex items-center text-[16px] font-black uppercase tracking-[0.14em] text-orange-500">
      Beta
    </span>
  )
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
  activeLiveMode: controlledLiveMode,
  onLiveModeChange,
  overviewBackLabel,
  onOverviewBackClick,
}: SkysirvLiveHeaderProps) {
  const router = useRouter()
  const mobileAirportSearchRef = useRef<HTMLDivElement | null>(null)
  const desktopAirportSearchRef = useRef<HTMLDivElement | null>(null)
  const mobileLiveModePickerRef = useRef<HTMLDivElement | null>(null)
  const desktopLiveModePickerRef = useRef<HTMLDivElement | null>(null)
  const [airportSearchValue, setAirportSearchValue] = useState("")
  const [isAirportSearchOpen, setIsAirportSearchOpen] = useState(false)
  const [internalLiveMode, setInternalLiveMode] =
    useState<SkysirvLiveMode>("disruptions")
  const activeLiveMode = controlledLiveMode ?? internalLiveMode
  const [isLiveModePickerOpen, setIsLiveModePickerOpen] = useState(false)

  const airportSearchResults = useMemo(() => {
    if (mode === "airport" || activeLiveMode === "aircraft") return []
    if (!airportSearchValue.trim()) return []

    return searchAirports(airportSearchValue, 7)
  }, [activeLiveMode, airportSearchValue, mode])

  const activeLiveModeLabel = useMemo(() => {
    return (
      liveModeOptions.find((option) => option.key === activeLiveMode)?.label ??
      "Live disruptions"
    )
  }, [activeLiveMode])

  const isLiveAircraftMode = activeLiveMode === "aircraft"

  const liveSearchPlaceholder = isLiveAircraftMode
    ? "Search aircraft (e.g. flight number)"
    : "Search airports..."

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        !mobileAirportSearchRef.current?.contains(target) &&
        !desktopAirportSearchRef.current?.contains(target) &&
        !mobileLiveModePickerRef.current?.contains(target) &&
        !desktopLiveModePickerRef.current?.contains(target)
      ) {
        setIsAirportSearchOpen(false)
        setIsLiveModePickerOpen(false)
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

  function handleLiveModeSelect(nextLiveMode: SkysirvLiveMode) {
    setInternalLiveMode(nextLiveMode)
    onLiveModeChange?.(nextLiveMode)
  }

  const airportTickerText =
    tickerItems.length > 0
      ? tickerItems.join(" · ")
      : `${airportCode} is showing elevated airport pressure right now.`

  return (
    <>
      <style>{`
        @keyframes skysirv-mobile-airport-ticker-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }

          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
      {mode !== "airport" && (
        <header className="pointer-events-auto absolute left-4 right-4 top-4 z-50 md:hidden">
          <div className="mx-auto flex w-full max-w-[360px] items-center gap-2">
            {onOverviewBackClick ? (
              <button
                type="button"
                onClick={onOverviewBackClick}
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full bg-blue-700 py-0 pl-2 pr-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-blue-800"
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

                {overviewBackLabel ?? "Live"}
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full bg-blue-700 py-0 pl-2 pr-3 text-xs font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition hover:bg-blue-800"
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
            )}

            <div ref={mobileLiveModePickerRef} className="relative min-w-0 flex-1">
              <button
                type="button"
                onClick={() =>
                  setIsLiveModePickerOpen((current) => !current)
                }
                className="flex h-10 w-full items-center justify-between rounded-full border border-white/70 bg-white/95 pl-4 pr-3 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl"
              >
                <span className="truncate">{activeLiveModeLabel}</span>

                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-blue-700">
                  <LargeChevron
                    direction={isLiveModePickerOpen ? "up" : "down"}
                  />
                </span>
              </button>

              {isLiveModePickerOpen && (
                <div className="absolute left-0 right-0 top-[48px] z-[60] overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white p-2 text-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.28)]">
                  {liveModeOptions.map((option) => {
                    const isActive = activeLiveMode === option.key

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          handleLiveModeSelect(option.key)
                          setIsLiveModePickerOpen(false)
                          setAirportSearchValue("")
                          setIsAirportSearchOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition ${isActive
                          ? "bg-slate-100 text-slate-950"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                          }`}
                      >
                        {option.label}

                        {isActive && (
                          <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <header
        className={`pointer-events-auto absolute z-30 ${mode === "airport"
          ? "left-4 right-4 top-4 md:left-5 md:right-5 md:top-5"
          : "left-5 right-5 top-5 hidden md:block"
          }`}
      >
        <div className="rounded-[1.35rem] shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
          <div
            className={`flex min-h-[62px] flex-col gap-2 bg-blue-700 px-4 py-3 text-white backdrop-blur-xl md:min-h-[76px] md:flex-row md:items-center md:justify-between md:gap-3 md:px-6 md:py-0 ${mode === "airport" ? "rounded-t-[1.35rem]" : "rounded-[1.35rem]"
              }`}
          >
            <div className="flex items-center gap-4">
              {mode !== "airport" && onOverviewBackClick ? (
                <button
                  type="button"
                  onClick={onOverviewBackClick}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-white py-0 pl-2 pr-3 text-xs font-bold text-slate-800 transition hover:bg-slate-100 md:h-11 md:gap-1.5 md:pl-3 md:pr-4 md:text-sm"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 md:h-6 md:w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>

                  {overviewBackLabel ?? "Live"}
                </button>
              ) : (
                <Link
                  href={mode === "airport" ? "/skysirv-live" : "/"}
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-white py-0 pl-2 pr-3 text-xs font-bold text-slate-800 transition hover:bg-slate-100 md:h-11 md:gap-1.5 md:pl-3 md:pr-4 md:text-sm"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 md:h-6 md:w-6"
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
              )}

              <div>
                {mode === "airport" ? (
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h1 className="text-[18px] font-black leading-[1.04] tracking-tight sm:text-4xl sm:leading-tight">
                      {airportName}
                    </h1>

                    {localTimeLabel && (
                      <span className="hidden text-sm font-bold text-white/55 sm:inline sm:text-base">
                        {localTimeLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div ref={desktopLiveModePickerRef} className="relative hidden md:block">
                      <button
                        type="button"
                        onClick={() =>
                          setIsLiveModePickerOpen((current) => !current)
                        }
                        className="inline-flex h-11 w-[190px] items-center justify-between rounded-full border border-white/25 bg-white/95 py-0 pl-4 pr-3 text-sm font-bold text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:bg-white"
                      >
                        <span className="min-w-0 truncate">
                          {activeLiveModeLabel}
                        </span>

                        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-blue-700">
                          <LargeChevron
                            direction={isLiveModePickerOpen ? "up" : "down"}
                          />
                        </span>
                      </button>

                      {isLiveModePickerOpen && (
                        <div className="absolute left-0 top-[52px] z-50 w-[220px] overflow-hidden rounded-[1.15rem] border border-slate-200 bg-white p-2 text-slate-950 shadow-[0_20px_55px_rgba(15,23,42,0.28)]">
                          {liveModeOptions.map((option) => {
                            const isActive = activeLiveMode === option.key

                            return (
                              <button
                                key={option.key}
                                type="button"
                                onClick={() => {
                                  handleLiveModeSelect(option.key)
                                  setIsLiveModePickerOpen(false)
                                }}
                                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition ${isActive
                                  ? "bg-slate-100 text-slate-950"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                                  }`}
                              >
                                {option.label}

                                {isActive && (
                                  <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex h-12 w-[340px] items-center gap-2 overflow-visible">
                      <Image
                        src={liveModeLogoSrc[activeLiveMode]}
                        alt={
                          activeLiveMode === "aircraft"
                            ? "Skysirv Live Aircraft"
                            : "Skysirv Live Disruptions"
                        }
                        width={1740}
                        height={184}
                        priority
                        className="h-[38px] w-auto max-w-none shrink-0 object-contain"
                      />

                      <BetaText />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {mode !== "airport" && (
              <div
                ref={desktopAirportSearchRef}
                className="relative w-full md:order-3 md:w-[430px] md:flex-none"
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
                    placeholder={liveSearchPlaceholder}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-light text-slate-800 outline-none placeholder:text-slate-700"
                  />
                </div>

                {!isLiveAircraftMode && isAirportSearchOpen && airportSearchValue.trim() && (
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

            <div className="hidden items-center gap-3 md:order-2 md:ml-auto md:mr-5 md:flex">
              {mode === "airport" ? (
                <Link
                  href={
                    airportCode
                      ? `/skysirv-live/airports/${airportCode}`
                      : "/skysirv-live/airports/JFK"
                  }
                  className="inline-flex h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-black text-blue-700 shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition hover:bg-blue-50"
                >
                  <span className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
                  Skysirv Live Airports
                </Link>
              ) : (
                <>
                  <span className="h-4 w-4 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
                  <span className="text-xl font-bold text-white">
                    {activeLiveMode === "aircraft"
                      ? "Live Aircraft Data"
                      : "Live FAA Data"}{" "}
                    · Last update: {formatLocalUpdateTime(lastUpdatedAt)}
                  </span>
                </>
              )}
            </div>

            {mode === "airport" && (
              <div
                className={`flex h-8 items-center overflow-hidden rounded-b-[1.35rem] px-4 text-xs font-bold text-white md:h-9 md:px-5 md:text-sm ${alertBarClassName}`}
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div
                    className="flex w-max md:hidden"
                    style={{
                      animation: "skysirv-mobile-airport-ticker-marquee 58s linear infinite",
                    }}
                  >
                    <span className="inline-flex items-center whitespace-nowrap pr-10">
                      <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-white" />
                      {airportTickerText}
                    </span>

                    <span
                      className="inline-flex items-center whitespace-nowrap pr-10"
                      aria-hidden="true"
                    >
                      <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-white" />
                      {airportTickerText}
                    </span>
                  </div>

                  <span className="hidden items-center whitespace-nowrap md:inline-flex">
                    <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-white" />
                    {airportTickerText}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header >
    </>
  )
}