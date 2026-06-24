"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  getAirportByCode,
  type SkysirvLiveAircraft,
} from "@/components/skysirv-live/skysirv-live-data"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

const regionOptions = [
  { key: "all", label: "Global" },
  { key: "north-america", label: "North America" },
  { key: "europe", label: "Europe" },
  { key: "asia", label: "Asia" },
  { key: "africa", label: "Africa" },
  { key: "south-america", label: "South America" },
  { key: "middle-east", label: "Middle East" },
  { key: "pacific", label: "Pacific" },
]

type AircraftViewKey =
  | "overview"
  | "origin"
  | "destination"
  | "schedule"
  | "duration"
  | "delay-risk"
  | "route"

const aircraftTabs: Array<{
  key: AircraftViewKey
  label: string
}> = [
    { key: "overview", label: "Summary" },
    { key: "origin", label: "Origin Airport" },
    { key: "destination", label: "Destination Airport" },
    { key: "schedule", label: "Scheduled Times" },
    { key: "duration", label: "Duration" },
    { key: "delay-risk", label: "Delay Risk" },
    { key: "route", label: "Route" },
  ]

type AircraftAirportWeatherSnapshot = {
  temperatureC: number | null
  windSpeedKmh: number | null
  windGustKmh: number | null
  humidityPercent: number | null
  weatherSummary: string
  aviationRisk: "normal" | "minor" | "moderate" | "major"
  riskReason: string | null
}

type AircraftAirportWeatherResponse = {
  ok: boolean
  weather?: AircraftAirportWeatherSnapshot
  error?: string
}

type AircraftAirportWeatherState = {
  weather: AircraftAirportWeatherSnapshot | null
  loading: boolean
  error: string | null
}

function getAircraftStatusLabel(status: SkysirvLiveAircraft["status"]) {
  if (status === "climbing") return "Climbing"
  if (status === "cruising") return "Cruising"
  if (status === "descending") return "Descending"
  if (status === "approaching") return "Approaching"

  return "Airborne"
}

function getDelayTone(delayMinutes: number) {
  if (delayMinutes >= 30) return "text-red-600 bg-red-50"
  if (delayMinutes >= 15) return "text-orange-600 bg-orange-50"
  if (delayMinutes > 0) return "text-amber-600 bg-amber-50"

  return "text-emerald-600 bg-emerald-50"
}

function getDelayRiskLabel(delayMinutes: number) {
  if (delayMinutes >= 30) return "High delay risk"
  if (delayMinutes >= 15) return "Moderate delay risk"
  if (delayMinutes > 0) return "Light delay risk"

  return "Low delay risk"
}

function AircraftMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex min-h-[74px] flex-col justify-center rounded-2xl bg-slate-50 px-3 py-3">
      <p className="whitespace-nowrap text-[9px] font-black uppercase leading-none tracking-[0.08em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 whitespace-nowrap text-sm font-black leading-none text-slate-950">
        {value}
      </p>
    </div>
  )
}

function formatNullableWeatherNumber(value: number | null) {
  if (value === null) return "—"

  return Math.round(value).toString()
}

function getWeatherRiskBadgeClass(
  risk: "normal" | "minor" | "moderate" | "major",
) {
  if (risk === "major") return "bg-red-100 text-red-700"
  if (risk === "moderate") return "bg-orange-100 text-orange-700"
  if (risk === "minor") return "bg-amber-100 text-amber-700"

  return "bg-emerald-100 text-emerald-700"
}

function AircraftAirportWeatherCard({
  title,
  weatherState,
}: {
  title: string
  weatherState?: AircraftAirportWeatherState
}) {
  if (!weatherState) return null

  if (weatherState.loading) {
    return (
      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          {title}
        </p>

        <p className="mt-2 text-sm font-bold text-slate-500">
          Loading live weather...
        </p>
      </div>
    )
  }

  if (weatherState.error || !weatherState.weather) {
    return (
      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          {title}
        </p>

        <p className="mt-2 text-sm font-bold text-slate-500">
          Weather data is temporarily unavailable.
        </p>
      </div>
    )
  }

  const weather = weatherState.weather

  return (
    <div className="mt-3 rounded-2xl bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            {title}
          </p>

          <p className="mt-1 truncate text-sm font-black text-slate-950">
            {weather.weatherSummary}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${getWeatherRiskBadgeClass(
            weather.aviationRisk,
          )}`}
        >
          {weather.aviationRisk}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <AircraftMetric
          label="Temp"
          value={`${formatNullableWeatherNumber(weather.temperatureC)}°C`}
        />

        <AircraftMetric
          label="Wind"
          value={`${formatNullableWeatherNumber(weather.windSpeedKmh)} km/h`}
        />

        <AircraftMetric
          label="Humidity"
          value={`${formatNullableWeatherNumber(weather.humidityPercent)}%`}
        />
      </div>

      {weather.riskReason && (
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
          {weather.riskReason}
        </p>
      )}
    </div>
  )
}

function renderAircraftViewDetails(
  item: SkysirvLiveAircraft,
  activeAircraftView: AircraftViewKey,
  weatherState?: AircraftAirportWeatherState,
) {
  if (activeAircraftView === "origin") {
    return (
      <div className="mt-4 space-y-3">
        <AircraftMetric
          label="Origin airport"
          value={`${item.originCode} · ${item.originCity}`}
        />

        <p className="text-sm font-semibold leading-6 text-slate-500">
          This aircraft departed from {item.originCity}. Skysirv will use the
          origin airport as one part of the flight pressure signal once provider
          data is connected.
        </p>

        <AircraftAirportWeatherCard
          title="Origin weather"
          weatherState={weatherState}
        />
      </div>
    )
  }

  if (activeAircraftView === "destination") {
    return (
      <div className="mt-4 space-y-3">
        <AircraftMetric
          label="Destination airport"
          value={`${item.destinationCode} · ${item.destinationCity}`}
        />

        <p className="text-sm font-semibold leading-6 text-slate-500">
          This aircraft is tracking toward {item.destinationCity}. Arrival timing,
          destination airport pressure, and downstream disruption will live here.
        </p>

        <AircraftAirportWeatherCard
          title="Destination weather"
          weatherState={weatherState}
        />
      </div>
    )
  }

  if (activeAircraftView === "schedule") {
    return (
      <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-3">
        <AircraftMetric
          label="Scheduled departure"
          value={item.scheduledDepartureLocal}
        />

        <AircraftMetric
          label="Scheduled arrival"
          value={item.scheduledArrivalLocal}
        />

        <AircraftMetric
          label="Estimated arrival"
          value={item.estimatedArrivalLocal}
        />

        <AircraftMetric
          label="Current delay"
          value={item.delayMinutes > 0 ? `+${item.delayMinutes}m` : "On time"}
        />
      </div>
    )
  }

  if (activeAircraftView === "duration") {
    return (
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <AircraftMetric
            label="Progress"
            value={`${item.routeProgressPercent}%`}
          />

          <AircraftMetric
            label="Altitude"
            value={`${item.altitudeFeet.toLocaleString()} ft`}
          />

          <AircraftMetric
            label="Speed"
            value={`${item.groundSpeedKnots} kt`}
          />
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-700"
            style={{ width: `${item.routeProgressPercent}%` }}
          />
        </div>
      </div>
    )
  }

  if (activeAircraftView === "delay-risk") {
    const delayTone = getDelayTone(item.delayMinutes)

    return (
      <div className="mt-4 space-y-3">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${delayTone}`}
        >
          {getDelayRiskLabel(item.delayMinutes)}
        </span>

        <div className="grid grid-cols-2 gap-3">
          <AircraftMetric
            label="Delay minutes"
            value={item.delayMinutes > 0 ? `+${item.delayMinutes}m` : "0m"}
          />

          <AircraftMetric
            label="Flight status"
            value={getAircraftStatusLabel(item.status)}
          />
        </div>

        <p className="text-sm font-semibold leading-6 text-slate-500">
          Delay risk will combine aircraft timing, origin pressure, destination
          pressure, route weather, and provider flight status once live aircraft
          data is connected.
        </p>
      </div>
    )
  }

  if (activeAircraftView === "route") {
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Origin
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-950">
              {item.originCode} · {item.originCity}
            </p>
          </div>

          <div className="h-px flex-1 bg-slate-200" />

          <div className="min-w-0 text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Destination
            </p>
            <p className="mt-1 truncate text-sm font-black text-slate-950">
              {item.destinationCode} · {item.destinationCity}
            </p>
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-700"
            style={{ width: `${item.routeProgressPercent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Origin
          </p>
          <p className="mt-1 truncate text-sm font-black text-slate-950">
            {item.originCode} · {item.originCity}
          </p>
        </div>

        <div className="h-px flex-1 bg-slate-200" />

        <div className="min-w-0 text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
            Destination
          </p>
          <p className="mt-1 truncate text-sm font-black text-slate-950">
            {item.destinationCode} · {item.destinationCity}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm font-bold">
        <div>
          <p className="text-slate-400">Altitude</p>
          <p className="mt-1 text-slate-950">
            {item.altitudeFeet.toLocaleString()} ft
          </p>
        </div>

        <div>
          <p className="text-slate-400">Speed</p>
          <p className="mt-1 text-slate-950">
            {item.groundSpeedKnots} kt
          </p>
        </div>

        <div>
          <p className="text-slate-400">Status</p>
          <p className="mt-1 text-slate-950">
            {getAircraftStatusLabel(item.status)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-700"
          style={{ width: `${item.routeProgressPercent}%` }}
        />
      </div>
    </>
  )
}

export default function SkysirvLiveAircraftList({
  aircraft,
  aircraftErrorMessage,
  selectedAircraftId,
  activeAircraftView = "overview",
  activeRegion = "north-america",
  onAircraftSelect,
  onRegionSelect,
  onAircraftViewSelect,
}: {
  aircraft: SkysirvLiveAircraft[]
  aircraftErrorMessage?: string | null
  selectedAircraftId?: string | null
  activeAircraftView?: AircraftViewKey
  activeRegion?: string
  onAircraftSelect?: (aircraft: SkysirvLiveAircraft) => void
  onRegionSelect?: (regionKey: string) => void
  onAircraftViewSelect?: (aircraftViewKey: AircraftViewKey) => void
}) {
  const touchStartYRef = useRef<number | null>(null)
  const mobileAircraftTabsRef = useRef<HTMLDivElement | null>(null)
  const [isMobileDrawerExpanded, setIsMobileDrawerExpanded] = useState(true)
  const [isRegionMenuOpen, setIsRegionMenuOpen] = useState(false)
  const [mobileAircraftSearchValue, setMobileAircraftSearchValue] = useState("")
  const [showMobileAircraftTabsLeftHint, setShowMobileAircraftTabsLeftHint] =
    useState(false)
  const [showMobileAircraftTabsRightHint, setShowMobileAircraftTabsRightHint] =
    useState(true)
  const selectedAircraft = useMemo(() => {
    if (!selectedAircraftId) return null

    return aircraft.find((item) => item.id === selectedAircraftId) ?? null
  }, [aircraft, selectedAircraftId])

  const activeWeatherAirportCode =
    selectedAircraft && activeAircraftView === "origin"
      ? selectedAircraft.originCode
      : selectedAircraft && activeAircraftView === "destination"
        ? selectedAircraft.destinationCode
        : null

  const activeWeatherAirport = useMemo(() => {
    if (!activeWeatherAirportCode) return null

    return getAirportByCode(activeWeatherAirportCode)
  }, [activeWeatherAirportCode])

  const activeRegionLabel = useMemo(() => {
    return (
      regionOptions.find((region) => region.key === activeRegion)?.label ??
      "North America"
    )
  }, [activeRegion])

  const mobileAircraft = useMemo(() => {
    const query = mobileAircraftSearchValue.trim().toLowerCase()

    if (!query) return aircraft

    return aircraft.filter((item) => {
      return [
        item.flightNumber,
        item.airlineName,
        item.originCode,
        item.originCity,
        item.destinationCode,
        item.destinationCity,
        item.aircraftType,
        item.registration,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [aircraft, mobileAircraftSearchValue])

  function updateMobileAircraftTabScrollHints() {
    const tabsElement = mobileAircraftTabsRef.current

    if (!tabsElement) return

    setShowMobileAircraftTabsLeftHint(tabsElement.scrollLeft > 6)
    setShowMobileAircraftTabsRightHint(
      tabsElement.scrollLeft + tabsElement.clientWidth <
      tabsElement.scrollWidth - 6,
    )
  }

  const [airportWeatherState, setAirportWeatherState] =
    useState<AircraftAirportWeatherState>({
      weather: null,
      loading: false,
      error: null,
    })

  useEffect(() => {
    if (!selectedAircraft || !activeWeatherAirport) {
      setAirportWeatherState({
        weather: null,
        loading: false,
        error: null,
      })
      return
    }

    const weatherAirport = activeWeatherAirport
    let isMounted = true

    async function loadAirportWeather() {
      try {
        setAirportWeatherState({
          weather: null,
          loading: true,
          error: null,
        })

        const response = await fetch(
          `${API_BASE_URL}/api/skysirv-live/weather?latitude=${weatherAirport.latitude}&longitude=${weatherAirport.longitude}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        )

        if (!response.ok) {
          throw new Error(`Weather request failed with ${response.status}`)
        }

        const data = (await response.json()) as AircraftAirportWeatherResponse

        if (!isMounted) return

        if (!data.ok || !data.weather) {
          throw new Error(data.error ?? "Weather data unavailable")
        }

        setAirportWeatherState({
          weather: data.weather,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Failed to load aircraft airport weather", error)

        if (isMounted) {
          setAirportWeatherState({
            weather: null,
            loading: false,
            error: "Weather data is temporarily unavailable.",
          })
        }
      }
    }

    void loadAirportWeather()

    return () => {
      isMounted = false
    }
  }, [
    activeWeatherAirport,
    activeWeatherAirportCode,
    selectedAircraft,
  ])

  useEffect(() => {
    if (!isMobileDrawerExpanded || !selectedAircraft) return

    updateMobileAircraftTabScrollHints()
    window.addEventListener("resize", updateMobileAircraftTabScrollHints)

    return () => {
      window.removeEventListener("resize", updateMobileAircraftTabScrollHints)
    }
  }, [activeAircraftView, isMobileDrawerExpanded, selectedAircraft])

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
      setIsMobileDrawerExpanded(true)
    }

    if (distance < -36) {
      setIsMobileDrawerExpanded(false)
      setIsRegionMenuOpen(false)
    }
  }

  function handleRegionSelect(regionKey: string) {
    setIsRegionMenuOpen(false)
    onRegionSelect?.(regionKey)
  }

  return (
    <>
      <aside className="pointer-events-auto absolute bottom-[76px] left-5 top-[118px] z-20 hidden w-[390px] max-w-[calc(100vw-40px)] md:block">
        <div className="relative h-full">
          <div className="h-full space-y-3 overflow-y-auto pb-10 [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-72px),transparent_100%)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {aircraft.length === 0 && (
              <div className="rounded-2xl border border-white/70 bg-white/90 p-5 text-center shadow-[0_16px_42px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <p className="text-sm font-black text-slate-950">
                  {aircraftErrorMessage
                    ? "Live aircraft unavailable"
                    : "No aircraft in view"}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {aircraftErrorMessage ??
                    "Pan or zoom the map to bring tracked aircraft into view."}
                </p>
              </div>
            )}

            {(selectedAircraft ? [selectedAircraft] : aircraft).map((item) => {
              const isSelected = selectedAircraftId === item.id
              const delayTone = getDelayTone(item.delayMinutes)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAircraftSelect?.(item)}
                  className={`block w-full rounded-2xl border p-4 text-left backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_48px_rgba(15,23,42,0.16)] ${isSelected
                    ? "border-blue-300 bg-white shadow-[0_18px_48px_rgba(29,78,216,0.18)]"
                    : "border-white/70 bg-white/90 shadow-[0_16px_42px_rgba(15,23,42,0.12)]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xl font-black tracking-tight text-slate-950">
                        {item.flightNumber}
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-slate-500">
                        {item.airlineName}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${delayTone}`}
                    >
                      {item.delayMinutes > 0 ? `+${item.delayMinutes}m` : "On time"}
                    </span>
                  </div>

                  {renderAircraftViewDetails(
                    item,
                    isSelected ? activeAircraftView : "overview",
                    isSelected ? airportWeatherState : undefined,
                  )}
                </button>
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
            onClick={() => setIsMobileDrawerExpanded((current) => !current)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-slate-300"
            aria-label="Resize live aircraft drawer"
          />

          {selectedAircraft ? (
            <>
              <div className="mt-4 flex min-h-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">
                      {selectedAircraft.flightNumber}
                    </h2>

                    {isMobileDrawerExpanded && (
                      <p className="mt-1 truncate text-sm font-bold text-slate-500">
                        {selectedAircraft.airlineName}
                      </p>
                    )}
                  </div>

                  <span
                    className={`mt-1 shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${getDelayTone(
                      selectedAircraft.delayMinutes,
                    )}`}
                  >
                    {selectedAircraft.delayMinutes > 0
                      ? `+${selectedAircraft.delayMinutes}m`
                      : "On time"}
                  </span>
                </div>

                {isMobileDrawerExpanded && (
                  <>
                    <div className="relative mt-3 border-b border-slate-200 pb-2">
                      {showMobileAircraftTabsLeftHint && (
                        <div className="pointer-events-none absolute bottom-2 left-0 top-0 z-10 flex items-center bg-gradient-to-r from-white via-white to-transparent pr-5">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </div>
                      )}

                      {showMobileAircraftTabsRightHint && (
                        <div className="pointer-events-none absolute bottom-2 right-0 top-0 z-10 flex items-center bg-gradient-to-l from-white via-white to-transparent pl-5">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      )}

                      <div
                        ref={mobileAircraftTabsRef}
                        onScroll={updateMobileAircraftTabScrollHints}
                        className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                      >
                        <div className="flex min-w-max items-center gap-5">
                          {aircraftTabs.map((tab) => {
                            const isActive = activeAircraftView === tab.key

                            return (
                              <button
                                key={tab.key}
                                type="button"
                                onClick={() => onAircraftViewSelect?.(tab.key)}
                                className={`inline-flex h-5 shrink-0 items-center text-[11px] font-semibold uppercase tracking-[0.1em] transition ${isActive ? "text-blue-700" : "text-slate-400"
                                  }`}
                              >
                                {tab.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-10 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <div className="rounded-[1.4rem] bg-white pb-8">
                        {renderAircraftViewDetails(
                          selectedAircraft,
                          activeAircraftView,
                          airportWeatherState,
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mt-4">
                <h2 className="w-full whitespace-nowrap text-center text-[26px] font-black tracking-tight text-slate-950">
                  Live Aircraft
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
                          value={mobileAircraftSearchValue}
                          onChange={(event) => {
                            setMobileAircraftSearchValue(event.target.value)
                            setIsRegionMenuOpen(false)
                          }}
                          placeholder="Search aircraft..."
                          className="h-full min-w-0 flex-1 bg-transparent text-sm font-light text-slate-800 outline-none placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="relative min-w-0">
                        <button
                          type="button"
                          onClick={() =>
                            setIsRegionMenuOpen((current) => !current)
                          }
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
                    <span>Aircraft</span>
                    <span>Route</span>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {mobileAircraft.length === 0 && (
                      <div className="py-8 text-center">
                        <p className="text-sm font-black text-slate-950">
                          {aircraftErrorMessage
                            ? "Live aircraft unavailable"
                            : "No aircraft in view"}
                        </p>

                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                          {aircraftErrorMessage ??
                            "Pan or zoom the map to bring tracked aircraft into view."}
                        </p>
                      </div>
                    )}

                    {mobileAircraft.map((item) => {
                      const isSelected = selectedAircraftId === item.id
                      const delayTone = getDelayTone(item.delayMinutes)

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setIsMobileDrawerExpanded(true)
                            onAircraftSelect?.(item)
                          }}
                          className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 py-3.5 text-left ${isSelected ? "text-blue-700" : "text-slate-950"
                            }`}
                        >
                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="shrink-0 text-sm font-black">
                                {item.flightNumber}
                              </span>

                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] ${delayTone}`}
                              >
                                {item.delayMinutes > 0
                                  ? `+${item.delayMinutes}m`
                                  : "On time"}
                              </span>
                            </div>

                            <span className="mt-1 block truncate text-xs font-semibold text-slate-500">
                              {item.airlineName}
                            </span>
                          </div>

                          <span className="max-w-[120px] truncate text-right text-xs font-black text-slate-500">
                            {item.originCode} → {item.destinationCode}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  )
} 