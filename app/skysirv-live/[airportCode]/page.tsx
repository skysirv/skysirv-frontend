"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox"
import SkysirvLiveBottomNav from "@/components/skysirv-live/SkysirvLiveBottomNav"
import SkysirvLiveHeader from "@/components/skysirv-live/SkysirvLiveHeader"
import {
  getAirportByCode,
  getSeverityStyles,
  mergeAirportPressureWithAirports,
  type SkysirvAirportPressureResponse,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

const validViews = [
  "overview",
  "delays",
  "departures",
  "arrivals",
  "weather",
  "routes",
  "airlines",
]

const airportViewTabs = [
  { key: "overview", label: "Summary" },
  { key: "delays", label: "Delays" },
  { key: "departures", label: "Departures" },
  { key: "arrivals", label: "Arrivals" },
  { key: "weather", label: "Weather" },
  { key: "routes", label: "Routes" },
  { key: "airlines", label: "Airlines" },
]

type SkysirvLiveWeatherSnapshot = {
  source: "Open-Meteo"
  observedAt: string
  latitude: number
  longitude: number
  temperatureC: number | null
  feelsLikeC: number | null
  humidityPercent: number | null
  precipitationMm: number | null
  cloudCoverPercent: number | null
  pressureHpa: number | null
  windSpeedKmh: number | null
  windGustKmh: number | null
  windDirectionDegrees: number | null
  weatherCode: number | null
  weatherSummary: string
  aviationRisk: "normal" | "minor" | "moderate" | "major"
  riskReason: string | null
}

type SkysirvLiveWeatherResponse = {
  ok: boolean
  weather?: SkysirvLiveWeatherSnapshot
  error?: string
}

export default function SkysirvLiveAirportPage({
  params,
}: {
  params: { airportCode: string }
}) {
  const searchParams = useSearchParams()
  const requestedView = searchParams.get("view") || "overview"
  const activeView = validViews.includes(requestedView)
    ? requestedView
    : "overview"

  const [mobileActiveView, setMobileActiveView] = useState(activeView)

  const airport = getAirportByCode(params.airportCode)

  const [weather, setWeather] = useState<SkysirvLiveWeatherSnapshot | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  const [pressureAirport, setPressureAirport] =
    useState<SkysirvLiveAirport | null>(null)

  useEffect(() => {
    setMobileActiveView(activeView)
  }, [activeView])

  const airportDrawerTouchStartYRef = useRef<number | null>(null)
  const mobileAirportTabsRef = useRef<HTMLDivElement | null>(null)
  const [isAirportDrawerExpanded, setIsAirportDrawerExpanded] = useState(false)
  const [showMobileTabsLeftHint, setShowMobileTabsLeftHint] = useState(false)
  const [showMobileTabsRightHint, setShowMobileTabsRightHint] = useState(true)

  function updateMobileAirportTabScrollHints() {
    const tabsElement = mobileAirportTabsRef.current

    if (!tabsElement) return

    setShowMobileTabsLeftHint(tabsElement.scrollLeft > 6)
    setShowMobileTabsRightHint(
      tabsElement.scrollLeft + tabsElement.clientWidth < tabsElement.scrollWidth - 6,
    )
  }

  function handleAirportDrawerTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    airportDrawerTouchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  function handleAirportDrawerTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const startY = airportDrawerTouchStartYRef.current
    const endY = event.changedTouches[0]?.clientY ?? null

    airportDrawerTouchStartYRef.current = null

    if (startY === null || endY === null) return

    const distance = startY - endY

    if (distance > 36) {
      setIsAirportDrawerExpanded(true)
    }

    if (distance < -36) {
      setIsAirportDrawerExpanded(false)
    }
  }

  useEffect(() => {
    if (!isAirportDrawerExpanded) return

    updateMobileAirportTabScrollHints()
    window.addEventListener("resize", updateMobileAirportTabScrollHints)

    return () => {
      window.removeEventListener("resize", updateMobileAirportTabScrollHints)
    }
  }, [isAirportDrawerExpanded, mobileActiveView])

  useEffect(() => {
    if (!airport) return

    const selectedAirport = airport
    let isMounted = true

    async function loadAirportPressure() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/skysirv-live/airports/pressure`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        )

        if (!response.ok) {
          throw new Error(`Airport pressure request failed with ${response.status}`)
        }

        const data = (await response.json()) as SkysirvAirportPressureResponse

        if (!isMounted || !data.ok) return

        const [mergedAirport] = mergeAirportPressureWithAirports(
          [selectedAirport],
          data.airports ?? [],
          data.observedAt,
        )

        setPressureAirport(mergedAirport ?? null)
      } catch (error) {
        console.error("Failed to load Skysirv Live airport pressure", error)

        if (isMounted) {
          setPressureAirport(null)
        }
      }
    }

    loadAirportPressure()

    const intervalId = window.setInterval(loadAirportPressure, 60_000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [airport])

  useEffect(() => {
    if (!airport) return

    const selectedAirport = airport
    let isMounted = true

    async function loadAirportWeather() {
      try {
        setWeatherLoading(true)
        setWeatherError(null)

        const response = await fetch(
          `${API_BASE_URL}/api/skysirv-live/weather?latitude=${selectedAirport.latitude}&longitude=${selectedAirport.longitude}`,
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

        const data = (await response.json()) as SkysirvLiveWeatherResponse

        if (!isMounted) return

        if (!data.ok || !data.weather) {
          throw new Error(data.error ?? "Weather data unavailable")
        }

        setWeather(data.weather)
      } catch (error) {
        console.error("Failed to load Skysirv Live weather", error)

        if (isMounted) {
          setWeather(null)
          setWeatherError("Weather data is temporarily unavailable.")
        }
      } finally {
        if (isMounted) {
          setWeatherLoading(false)
        }
      }
    }

    loadAirportWeather()

    const intervalId = window.setInterval(loadAirportWeather, 10 * 60_000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [airport])

  if (!airport) {
    return (
      <main className="fixed inset-0 flex h-[100dvh] w-screen items-center justify-center overflow-hidden bg-slate-100 px-6 text-slate-950">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Skysirv Live
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Airport not found
          </h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            This airport is not currently available in Skysirv Live.
          </p>
        </div>
      </main>
    )
  }

  const displayAirport = pressureAirport ?? airport
  const styles = getSeverityStyles(displayAirport.severity)

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden overscroll-none bg-slate-100 text-slate-950">
      <div className="absolute inset-x-0 top-0 bottom-[56px]">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: displayAirport.longitude,
            latitude: displayAirport.latitude,
            zoom: 8.25,
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          projection="mercator"
          attributionControl
          reuseMaps
          style={{ height: "100%", width: "100%" }}
        >
          <NavigationControl position="bottom-right" />

          <Marker
            longitude={displayAirport.longitude}
            latitude={displayAirport.latitude}
            anchor="bottom"
          >
            <div className="relative flex flex-col items-center">
              <span
                className={`absolute top-[-14px] h-20 w-20 rounded-full ${styles.dot} opacity-15`}
              />
              <span
                className={`relative h-12 w-12 rounded-full border-[6px] border-white ${styles.dot} shadow-[0_16px_36px_rgba(15,23,42,0.24)]`}
              />
              <span className="mt-1 rounded-full bg-slate-900 px-3 py-1 text-sm font-black tracking-tight text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)]">
                {displayAirport.code}
              </span>
            </div>
          </Marker>
        </Map>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[56px] bg-gradient-to-r from-white/78 via-white/22 to-transparent" />

      <SkysirvLiveHeader
        mode="airport"
        airportName={displayAirport.name}
        airportCode={displayAirport.code}
        localTimeLabel="Live now"
        alertBarClassName={styles.alertBar}
        tickerItems={[
          `${displayAirport.statusLabel ?? styles.label}`,
          ...(displayAirport.disruptionReason
            ? [`Reason: ${displayAirport.disruptionReason}`]
            : []),
          `Departures are taking off ${displayAirport.departuresDelay}m late on average`,
          `Arrivals are landing ${displayAirport.arrivalsDelay}m late on average`,
          `Cancellations remain at ${displayAirport.cancellationRate}%`,
        ]}
      />

      <aside className="pointer-events-auto absolute bottom-[76px] left-5 top-[150px] z-20 hidden w-[390px] max-w-[calc(100vw-40px)] md:block">
        <div className="h-full overflow-y-auto pb-10 [mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-72px),transparent_100%)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {renderAirportPanel(activeView, displayAirport, {
            weather,
            weatherLoading,
            weatherError,
          })}
        </div>
      </aside>

      <aside
        className={`pointer-events-auto absolute inset-x-0 bottom-0 z-40 rounded-t-[2rem] bg-white shadow-[0_-18px_55px_rgba(15,23,42,0.22)] transition-[height] duration-300 ease-out md:hidden ${isAirportDrawerExpanded ? "h-[48svh]" : "h-[92px]"
          }`}
      >
        <div className="flex h-full flex-col overflow-hidden px-5 pb-5 pt-3">
          <div
            onTouchStart={handleAirportDrawerTouchStart}
            onTouchEnd={handleAirportDrawerTouchEnd}
          >
            <button
              type="button"
              onClick={() => setIsAirportDrawerExpanded((current) => !current)}
              className="mx-auto block h-1.5 w-12 rounded-full bg-slate-400"
              aria-label="Resize airport details drawer"
            />

            <button
              type="button"
              onClick={() => setIsAirportDrawerExpanded((current) => !current)}
              className="mt-4 flex w-full items-center justify-between gap-4 text-left"
            >
              <h2 className="min-w-0 truncate text-xl font-black tracking-tight text-slate-800">
                {displayAirport.name}
              </h2>

              <span className={`h-4 w-4 shrink-0 rounded-full ${styles.dot}`} />
            </button>
          </div>

          {isAirportDrawerExpanded && (
            <>
              <div className="relative mt-3 border-b border-slate-200 pb-2">
                {showMobileTabsLeftHint && (
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

                {showMobileTabsRightHint && (
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
                  ref={mobileAirportTabsRef}
                  onScroll={updateMobileAirportTabScrollHints}
                  className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  <div className="flex min-w-max items-center gap-5">
                    {airportViewTabs.map((tab) => {
                      const isActive = mobileActiveView === tab.key

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setMobileActiveView(tab.key)}
                          className={`inline-flex h-5 shrink-0 items-center text-[11px] font-semibold uppercase tracking-[0.1em] transition ${isActive
                            ? "text-blue-700"
                            : "text-slate-400"
                            }`}
                        >
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pt-3 [zoom:0.78] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {renderAirportPanel(mobileActiveView, displayAirport, {
                  weather,
                  weatherLoading,
                  weatherError,
                })}
              </div>
            </>
          )}
        </div>
      </aside>

      <div className="pointer-events-auto absolute right-5 top-[150px] z-20 hidden max-w-sm rounded-[1.35rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Lucy live read
        </p>

        <p className="mt-2 text-sm font-semibold italic leading-6 text-slate-800">
          “{getLucyRead(activeView, displayAirport)}”
        </p>
      </div>

      <div className="hidden md:block">
        <SkysirvLiveBottomNav
          mode="airport"
          airportCode={displayAirport.code}
          activeKey={activeView}
        />
      </div>
    </main>
  )
}

function renderAirportPanel(
  activeView: string,
  airport: SkysirvLiveAirport,
  weatherState?: {
    weather: SkysirvLiveWeatherSnapshot | null
    weatherLoading: boolean
    weatherError: string | null
  },
) {
  const styles = getSeverityStyles(airport.severity)

  if (activeView === "delays") {
    return (
      <div className="space-y-4">
        <DelayChartCard
          title="Live takeoff delay"
          value={`${airport.departuresDelay}m`}
          toneClassName={styles.bar}
        />

        <DelayChartCard
          title="Live landing delay"
          value={`${airport.arrivalsDelay}m`}
          toneClassName={airport.arrivalsDelay > 20 ? styles.bar : "bg-emerald-500"}
        />
      </div>
    )
  }

  if (activeView === "departures") {
    const delayedPercent = Math.min(88, Math.max(6, airport.departuresDelay))
    const onTimePercent = 100 - delayedPercent

    return (
      <StatusBreakdownCard
        title="Departures"
        rows={[
          { label: "On time", percent: onTimePercent, count: 91, tone: "bg-emerald-500" },
          { label: "Delayed", percent: delayedPercent, count: 6, tone: styles.bar },
          { label: "Canceled", percent: airport.cancellationRate, count: 0, tone: "bg-slate-300" },
        ]}
      />
    )
  }

  if (activeView === "arrivals") {
    const delayedPercent = Math.min(88, Math.max(7, airport.arrivalsDelay))
    const onTimePercent = 100 - delayedPercent

    return (
      <StatusBreakdownCard
        title="Arrivals"
        rows={[
          { label: "On time", percent: onTimePercent, count: 81, tone: "bg-emerald-500" },
          { label: "Delayed", percent: delayedPercent, count: 6, tone: styles.bar },
          { label: "Canceled", percent: airport.cancellationRate, count: 0, tone: "bg-slate-300" },
          { label: "Diverted", percent: 0, count: 0, tone: "bg-slate-300" },
        ]}
      />
    )
  }

  if (activeView === "weather") {
    const currentWeather = weatherState?.weather

    if (weatherState?.weatherLoading) {
      return (
        <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
          <p className="text-2xl font-semibold text-slate-600">
            Current conditions
          </p>

          <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">
            Loading live weather around {airport.city}...
          </p>
        </div>
      )
    }

    if (weatherState?.weatherError || !currentWeather) {
      return (
        <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
          <p className="text-2xl font-semibold text-slate-600">
            Current conditions
          </p>

          <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">
            Weather data is temporarily unavailable for {airport.city}.
          </p>
        </div>
      )
    }

    const riskStyles = getWeatherRiskStyles(currentWeather.aviationRisk)

    return (
      <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Weather conditions
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-600">
              {currentWeather.weatherSummary}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${riskStyles.badge}`}
          >
            {currentWeather.aviationRisk}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <p className="text-7xl font-black tracking-tight">
            {formatNullableNumber(currentWeather.temperatureC)}°C
          </p>

          <span className="text-6xl" aria-hidden="true">
            {getWeatherEmoji(currentWeather.weatherCode)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <WeatherMetricCard
            label="Feels like"
            value={`${formatNullableNumber(currentWeather.feelsLikeC)}°C`}
          />

          <WeatherMetricCard
            label="Wind"
            value={`${formatNullableNumber(currentWeather.windSpeedKmh)} km/h`}
          />

          <WeatherMetricCard
            label="Gusts"
            value={`${formatNullableNumber(currentWeather.windGustKmh)} km/h`}
          />

          <WeatherMetricCard
            label="Humidity"
            value={`${formatNullableNumber(currentWeather.humidityPercent)}%`}
          />

          <WeatherMetricCard
            label="Rain"
            value={`${formatNullableNumber(currentWeather.precipitationMm)} mm`}
          />

          <WeatherMetricCard
            label="Cloud cover"
            value={`${formatNullableNumber(currentWeather.cloudCoverPercent)}%`}
          />
        </div>

        <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">
          {currentWeather.riskReason
            ? `Skysirv is flagging ${currentWeather.riskReason} around ${airport.city}.`
            : `Weather impact around ${airport.city} is currently low, but Skysirv will keep watching conditions against live airport pressure.`}
        </p>
      </div>
    )
  }

  if (activeView === "routes") {
    return (
      <RankedImpactCard
        title="Route pressure"
        items={[
          { label: "San Diego Intl.", value: 6 },
          { label: "Salt Lake City Intl.", value: 6 },
          { label: "Seattle Tacoma Intl.", value: 5 },
          { label: "Santa Fe Municipal", value: 4 },
          { label: "Harry Reid Intl.", value: 4 },
          { label: "Idaho Falls Regional", value: 3 },
        ]}
      />
    )
  }

  if (activeView === "airlines") {
    return (
      <RankedImpactCard
        title="Airline impact"
        items={[
          { label: "United", value: 120 },
          { label: "Southwest", value: 17 },
          { label: "Frontier Airlines", value: 8 },
          { label: "Delta", value: 6 },
          { label: "Alaska", value: 5 },
          { label: "Lufthansa", value: 3 },
        ]}
      />
    )
  }

  return (
    <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        Airport status
      </p>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <h2 className="text-5xl font-black tracking-tight">{airport.code}</h2>

          <p className="mt-2 text-lg font-bold text-slate-500">
            {airport.city}
          </p>
        </div>

        <span className={`h-5 w-5 rounded-full ${styles.dot}`} />
      </div>

      <p className={`mt-5 text-sm font-black uppercase tracking-[0.14em] ${styles.text}`}>
        {styles.label}
      </p>

      <div className="mt-7 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-400">Departures</p>
          <p className="mt-2 text-4xl font-black">
            {airport.departuresDelay}m
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-400">Arrivals</p>
          <p className="mt-2 text-4xl font-black">{airport.arrivalsDelay}m</p>
        </div>
      </div>
    </div>
  )
}

function DelayChartCard({
  title,
  value,
  toneClassName,
}: {
  title: string
  value: string
  toneClassName: string
}) {
  const bars = [18, 22, 25, 31, 34, 38, 35, 32, 29, 24, 30, 34, 37, 30, 28, 27]

  return (
    <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
      <p className="text-2xl font-semibold text-slate-600">{title}</p>
      <p className="mt-6 text-5xl font-black tracking-tight">{value}</p>

      <div className="mt-8 flex h-16 items-end gap-1.5">
        {bars.map((bar, index) => (
          <span
            key={`${title}-${index}`}
            className={`w-full rounded-t ${index < 10 ? toneClassName : "bg-slate-200"}`}
            style={{ height: `${bar}px` }}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] font-black text-slate-400">
        <span>8 AM</span>
        <span>Now</span>
        <span>11 AM</span>
      </div>
    </div>
  )
}

function StatusBreakdownCard({
  title,
  rows,
}: {
  title: string
  rows: Array<{
    label: string
    percent: number
    count: number
    tone: string
  }>
}) {
  return (
    <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
      <p className="text-2xl font-semibold text-slate-600">{title}</p>

      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-500">
                  {row.label}
                </p>
                <p className="text-5xl font-black tracking-tight">
                  {row.percent}%
                </p>
              </div>

              <p className="text-5xl font-black tracking-tight">{row.count}</p>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${row.tone}`}
                style={{ width: `${Math.min(100, row.percent)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RankedImpactCard({
  title,
  items,
}: {
  title: string
  items: Array<{
    label: string
    value: number
  }>
}) {
  const maxValue = Math.max(...items.map((item) => item.value))

  return (
    <div className="rounded-[1.4rem] bg-white p-6 shadow-sm">
      <p className="text-2xl font-semibold text-slate-600">{title}</p>

      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-end justify-between gap-4">
              <p className="text-xl font-black text-slate-950">
                {item.label}
              </p>

              <p className="text-3xl font-black text-slate-500">
                {item.value}
              </p>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-red-600"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeatherMetricCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function formatNullableNumber(value: number | null) {
  if (value === null) return "—"

  return Math.round(value).toString()
}

function getWeatherEmoji(weatherCode: number | null) {
  if (weatherCode === null) return "🌤️"
  if (weatherCode === 0) return "☀️"
  if ([1, 2].includes(weatherCode)) return "🌤️"
  if (weatherCode === 3) return "☁️"
  if ([45, 48].includes(weatherCode)) return "🌫️"
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return "🌦️"
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "🌧️"
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "❄️"
  if ([95, 96, 99].includes(weatherCode)) return "⛈️"

  return "🌤️"
}

function getWeatherRiskStyles(
  risk: "normal" | "minor" | "moderate" | "major",
) {
  if (risk === "major") {
    return {
      badge: "bg-red-100 text-red-700",
    }
  }

  if (risk === "moderate") {
    return {
      badge: "bg-orange-100 text-orange-700",
    }
  }

  if (risk === "minor") {
    return {
      badge: "bg-amber-100 text-amber-700",
    }
  }

  return {
    badge: "bg-emerald-100 text-emerald-700",
  }
}

function getLucyRead(activeView: string, airport: SkysirvLiveAirport) {
  if (activeView === "delays") {
    return `${airport.city} is showing delay pressure in the live timing signal. I’d compare takeoff delay against landing delay before trusting a tight connection.`
  }

  if (activeView === "departures") {
    return `${airport.city} departures need the closest watch right now. If your flight leaves from here, I’d give the airport timing more breathing room.`
  }

  if (activeView === "arrivals") {
    return `${airport.city} arrivals are worth monitoring for downstream connection risk, especially if this airport is part of a same-day itinerary.`
  }

  if (activeView === "weather") {
    return `Weather is only one part of the signal. I’m watching whether conditions around ${airport.city} start translating into real delay pressure.`
  }

  if (activeView === "routes") {
    return `Route pressure shows where disruption is spreading from ${airport.city}. I’d watch the highest-pressure routes before choosing a tight schedule.`
  }

  if (activeView === "airlines") {
    return `Airline impact helps show whether the disruption is airport-wide or concentrated with specific carriers serving ${airport.city}.`
  }

  return `${airport.city} is showing elevated airport pressure. I’d watch departure timing first, then compare connection risk before choosing a tight itinerary.`
}