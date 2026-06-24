"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox"
import {
  airports as skysirvLiveAirports,
  getAirportByCode,
  getSeverityStyles,
  mergeAirportPressureWithAirports,
  type SkysirvAirportPressureResponse,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const MAP_STYLES = {
  standard: "mapbox://styles/mapbox/standard",
  satellite: "mapbox://styles/mapbox/standard-satellite",
} as const

type MapStyleKey = keyof typeof MAP_STYLES

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

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

type AirportBoardRow = {
  time: string
  scheduledTime: string
  route: string
  detail: string
  flight: string
  status: string
  tone: "normal" | "delayed" | "canceled" | "warning"
}

type RankedItem = {
  label: string
  value: number
  detail?: string
}

const airportOverviewTabs = [
  "Overview",
  "Departures",
  "Arrivals",
  "Weather",
  "Performance",
  "Routes",
  "Airlines",
]

export default function SkysirvLiveAirportOverviewRoute({
  params,
}: {
  params: { airportCode: string }
}) {
  const airport = getAirportByCode(params.airportCode)

  const [pressureAirport, setPressureAirport] =
    useState<SkysirvLiveAirport | null>(null)

  const [pressureAirports, setPressureAirports] = useState<SkysirvLiveAirport[]>(
    [],
  )

  const [isAirportMapOpen, setIsAirportMapOpen] = useState(false)
  const [mapStyleKey, setMapStyleKey] = useState<MapStyleKey>("standard")

  const [weather, setWeather] = useState<SkysirvLiveWeatherSnapshot | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

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

        const mergedAirports = mergeAirportPressureWithAirports(
          skysirvLiveAirports,
          data.airports ?? [],
          data.observedAt,
        )

        const mergedSelectedAirport = mergedAirports.find(
          (mergedAirport) =>
            mergedAirport.code.toLowerCase() === selectedAirport.code.toLowerCase(),
        )

        setPressureAirports(mergedAirports)
        setPressureAirport(mergedSelectedAirport ?? null)
      } catch (error) {
        console.error("Failed to load Skysirv Live airport pressure", error)

        if (isMounted) {
          setPressureAirport(null)
          setPressureAirports([])
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
        console.error("Failed to load Skysirv Live airport weather", error)

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
      <main className="fixed inset-0 h-[100dvh] w-screen overflow-y-auto bg-white text-slate-800">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-8">
          <div className="w-full max-w-md rounded-[1.25rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              Skysirv Live Airports
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-800">
              Airport not found
            </h1>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
              This airport is not currently available in the Skysirv Live airport
              intelligence network.
            </p>

            <Link
              href="/skysirv-live"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-black text-white transition hover:bg-blue-800"
            >
              Back to Skysirv Live
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const displayAirport = pressureAirport ?? airport
  const mapAirportCatalog =
    pressureAirports.length > 0 ? pressureAirports : skysirvLiveAirports
  const nearbyAirports = getNearbyAirports(displayAirport, mapAirportCatalog, 9)
  const styles = getSeverityStyles(displayAirport.severity)

  const performance = getAirportPerformance(displayAirport)
  const departureRows = getDepartureBoardRows(displayAirport)
  const arrivalRows = getArrivalBoardRows(displayAirport)
  const disruptedRoutes = getDisruptedRoutes(displayAirport)
  const disruptedAirlines = getDisruptedAirlines(displayAirport)
  const busyRoutes = getBusyRoutes(displayAirport)
  const busyAirlines = getBusyAirlines(displayAirport)

  const currentTimeLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date())
  }, [])

  async function handleDownloadBrief() {
    await downloadAirportBriefPdf({
      airport: displayAirport,
      weather,
      performance,
      departureRows,
      arrivalRows,
      disruptedRoutes,
      disruptedAirlines,
    })
  }

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-y-auto bg-white text-slate-800">
      <div className="hidden md:block">
        <SkysirvLiveAirportsTopHeader selectedAirportCode={displayAirport.code} />

        {isAirportMapOpen && (
          <LiveAirportMapStage
            airport={displayAirport}
            nearbyAirports={nearbyAirports}
            mapStyleKey={mapStyleKey}
            onMapStyleChange={setMapStyleKey}
          />
        )}

        <div
          className={`w-full bg-white pb-10 ${isAirportMapOpen
            ? "relative z-30 border-t border-slate-200 shadow-[0_-10px_28px_rgba(15,23,42,0.06)]"
            : ""
            }`}
        >
          <div
            className={`mx-auto w-full max-w-[1420px] px-8 ${isAirportMapOpen ? "pt-8" : "pt-10"
              }`}
          >
            <header className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <h1 className="text-5xl font-black tracking-[-0.055em] text-slate-800">
                  {displayAirport.code}
                </h1>

                <div className="pt-1">
                  <p className="text-sm font-black text-slate-800">
                    {displayAirport.name}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {currentTimeLabel} · Live airport intelligence
                  </p>

                  <div className="mt-3 flex items-center gap-4 border-b border-slate-200">
                    {airportOverviewTabs.map((tab, index) => (
                      <button
                        key={tab}
                        type="button"
                        className={`pb-2 text-xs font-black ${index === 0
                          ? "border-b-2 border-blue-700 text-slate-800"
                          : "text-slate-500 transition hover:text-slate-800"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Email alerts
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBrief}
                  className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Download brief
                </button>

                <button
                  type="button"
                  onClick={() => setIsAirportMapOpen((current) => !current)}
                  className={`inline-flex h-8 items-center rounded-full px-3 text-xs font-black text-white shadow-sm transition ${isAirportMapOpen
                    ? "bg-slate-800 hover:bg-slate-900"
                    : "bg-orange-500 hover:bg-orange-600"
                    }`}
                >
                  {isAirportMapOpen ? "Close map" : "Airport map"}
                </button>
              </div>
            </header>

            <section className="mt-6 grid grid-cols-[400px_minmax(0,1fr)_minmax(0,1fr)] gap-6">
              <OperationalStatusCard
                airport={displayAirport}
                weather={weather}
                weatherLoading={weatherLoading}
                weatherError={weatherError}
              />

              <DelaySummaryCard
                title="Departures Delays"
                label="Live departure pressure"
                stats={performance.departures}
                delayMinutes={displayAirport.departuresDelay}
                bars={[18, 23, 29, 35, 38, 36, 31, 27, 25, 24, 22, 21, 20, 19]}
              />

              <DelaySummaryCard
                title="Arrivals Delays"
                label="Live arrival pressure"
                stats={performance.arrivals}
                delayMinutes={displayAirport.arrivalsDelay}
                bars={[12, 15, 16, 18, 19, 18, 16, 13, 12, 11, 10, 9, 9, 8]}
              />
            </section>

            <section className="mt-6 grid grid-cols-2 gap-6">
              <FlightBoardCard
                title="Departures Board"
                actionLabel="View all departures"
                rows={departureRows}
              />

              <FlightBoardCard
                title="Arrivals Board"
                actionLabel="View all arrivals"
                rows={arrivalRows}
              />
            </section>

            <section className="mt-6 grid grid-cols-[400px_minmax(0,1fr)] gap-6">
              <CurrentWeatherCard
                airport={displayAirport}
                weather={weather}
                weatherLoading={weatherLoading}
                weatherError={weatherError}
              />

              <DailyPerformanceCard
                airport={displayAirport}
                performance={performance}
                routes={disruptedRoutes}
                airlines={disruptedAirlines}
              />
            </section>

            <section className="mt-6 grid grid-cols-[minmax(0,1fr)_400px] gap-6">
              <AirportStatsCard
                airport={displayAirport}
                routes={busyRoutes}
                airlines={busyAirlines}
              />

              <LucyAirportCard airport={displayAirport} weather={weather} />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

async function loadPublicSvgAsPngDataUrl(svgPath: string) {
  return new Promise<{
    dataUrl: string
    width: number
    height: number
  } | null>((resolve) => {
    const image = new window.Image()

    image.onload = () => {
      const naturalWidth = image.naturalWidth || 1200
      const naturalHeight = image.naturalHeight || 240
      const outputWidth = 1800
      const outputHeight = Math.round(
        (outputWidth / naturalWidth) * naturalHeight,
      )

      const canvas = document.createElement("canvas")
      canvas.width = outputWidth
      canvas.height = outputHeight

      const context = canvas.getContext("2d")

      if (!context) {
        resolve(null)
        return
      }

      context.clearRect(0, 0, outputWidth, outputHeight)
      context.drawImage(image, 0, 0, outputWidth, outputHeight)

      const imageData = context.getImageData(0, 0, outputWidth, outputHeight)
      const pixels = imageData.data

      let top = outputHeight
      let left = outputWidth
      let right = 0
      let bottom = 0

      for (let y = 0; y < outputHeight; y += 1) {
        for (let x = 0; x < outputWidth; x += 1) {
          const alpha = pixels[(y * outputWidth + x) * 4 + 3]

          if (alpha > 8) {
            top = Math.min(top, y)
            left = Math.min(left, x)
            right = Math.max(right, x)
            bottom = Math.max(bottom, y)
          }
        }
      }

      if (right <= left || bottom <= top) {
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: outputWidth,
          height: outputHeight,
        })
        return
      }

      const trimmedWidth = right - left + 1
      const trimmedHeight = bottom - top + 1
      const trimmedCanvas = document.createElement("canvas")
      trimmedCanvas.width = trimmedWidth
      trimmedCanvas.height = trimmedHeight

      const trimmedContext = trimmedCanvas.getContext("2d")

      if (!trimmedContext) {
        resolve(null)
        return
      }

      trimmedContext.drawImage(
        canvas,
        left,
        top,
        trimmedWidth,
        trimmedHeight,
        0,
        0,
        trimmedWidth,
        trimmedHeight,
      )

      resolve({
        dataUrl: trimmedCanvas.toDataURL("image/png"),
        width: trimmedWidth,
        height: trimmedHeight,
      })
    }

    image.onerror = () => {
      resolve(null)
    }

    image.src = svgPath
  })
}

async function downloadAirportBriefPdf({
  airport,
  weather,
  performance,
  departureRows,
  arrivalRows,
  disruptedRoutes,
  disruptedAirlines,
}: {
  airport: SkysirvLiveAirport
  weather: SkysirvLiveWeatherSnapshot | null
  performance: ReturnType<typeof getAirportPerformance>
  departureRows: AirportBoardRow[]
  arrivalRows: AirportBoardRow[]
  disruptedRoutes: RankedItem[]
  disruptedAirlines: RankedItem[]
}) {
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 42
  const contentWidth = pageWidth - margin * 2
  const generatedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date())

  const logoImage = await loadPublicSvgAsPngDataUrl(
    "/branding/logo/skysirv-live-airports-blue.svg",
  )

  function setSlate800() {
    doc.setTextColor(30, 41, 59)
  }

  function setSlate700() {
    doc.setTextColor(51, 65, 85)
  }

  function setSlate500() {
    doc.setTextColor(100, 116, 139)
  }

  function setBlue700() {
    doc.setTextColor(29, 78, 216)
  }

  function normalizePdfText(value: string) {
    return value.replace(/[“”]/g, '"').replace(/[’]/g, "'")
  }

  function addHeader(title: string) {
    const logoTop = 28
    const logoDisplayWidth = 180
    const fallbackLogoHeight = 26

    let logoDisplayHeight = fallbackLogoHeight

    if (logoImage) {
      logoDisplayHeight =
        (logoDisplayWidth / logoImage.width) * logoImage.height

      doc.addImage(
        logoImage.dataUrl,
        "PNG",
        margin,
        logoTop,
        logoDisplayWidth,
        logoDisplayHeight,
      )
    } else {
      setBlue700()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("Skysirv Live Airports", margin, logoTop + 18)
    }

    const logoCenterY = logoTop + logoDisplayHeight / 2

    setSlate700()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(`Generated ${generatedAt}`, pageWidth - margin, logoCenterY + 3, {
      align: "right",
    })

    const dividerY = logoTop + logoDisplayHeight + 12

    doc.setDrawColor(226, 232, 240)
    doc.line(margin, dividerY, pageWidth - margin, dividerY)

    setSlate800()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text(title, margin, dividerY + 30)
  }

  function addFooter(pageNumber: number) {
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, pageHeight - 42, pageWidth - margin, pageHeight - 42)

    setSlate500()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(
      "Skysirv Live Airports brief - Aviation intelligence snapshot - © 2026 Skysirv. All rights reserved.",
      margin,
      pageHeight - 24,
    )

    doc.text(`Page ${pageNumber}`, pageWidth - margin - 32, pageHeight - 24)
  }

  function addCard(x: number, y: number, width: number, height: number) {
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(x, y, width, height, 14, 14, "FD")
  }

  function addMetricCard({
    x,
    y,
    width,
    label,
    value,
    detail,
  }: {
    x: number
    y: number
    width: number
    label: string
    value: string
    detail: string
  }) {
    addCard(x, y, width, 82)

    setSlate500()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.text(label.toUpperCase(), x + 14, y + 20)

    setSlate800()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(26)
    doc.text(value, x + 14, y + 50)

    setSlate700()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(detail, x + 14, y + 67)
  }

  function addWrappedText(
    text: string,
    x: number,
    y: number,
    width: number,
    lineHeight = 13,
  ) {
    const lines = doc.splitTextToSize(normalizePdfText(text), width)
    doc.text(lines, x, y)

    return y + lines.length * lineHeight
  }

  function addSectionLabel(label: string, x: number, y: number) {
    setBlue700()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text(label.toUpperCase(), x, y)
  }

  function addSmallBar({
    x,
    y,
    width,
    value,
    color,
  }: {
    x: number
    y: number
    width: number
    value: number
    color: "green" | "red" | "orange" | "blue"
  }) {
    const fillColor =
      color === "green"
        ? [16, 185, 129]
        : color === "red"
          ? [220, 38, 38]
          : color === "orange"
            ? [249, 115, 22]
            : [29, 78, 216]

    doc.setFillColor(241, 245, 249)
    doc.roundedRect(x, y, width, 7, 3, 3, "F")

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2])
    doc.roundedRect(
      x,
      y,
      Math.max(8, Math.min(width, (width * value) / 100)),
      7,
      3,
      3,
      "F",
    )
  }

  function addDelayBreakdown(
    title: string,
    x: number,
    y: number,
    stats: {
      onTime: number
      delayed: number
      canceled: number
      diverted: number
    },
    delayMinutes: number,
  ) {
    addCard(x, y, 252, 150)

    setSlate800()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text(title, x + 14, y + 24)

    const statY = y + 56
    const columns = [
      { label: "On-time", value: `${stats.onTime}%`, color: [4, 120, 87] },
      { label: "Delayed", value: `${stats.delayed}%`, color: [185, 28, 28] },
      { label: "Canceled", value: `${stats.canceled}%`, color: [30, 41, 59] },
      { label: "Diverted", value: `${stats.diverted}%`, color: [30, 41, 59] },
    ]

    columns.forEach((column, index) => {
      const columnX = x + 14 + index * 57

      setSlate500()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(7)
      doc.text(column.label, columnX, statY)

      doc.setTextColor(column.color[0], column.color[1], column.color[2])
      doc.setFont("helvetica", "bold")
      doc.setFontSize(18)
      doc.text(column.value, columnX, statY + 22)
    })

    addSmallBar({
      x: x + 14,
      y: y + 93,
      width: 224,
      value: stats.onTime,
      color: "green",
    })

    setSlate700()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(`Live delay signal: ${delayMinutes} min`, x + 14, y + 122)
  }

  function addRankedList(
    title: string,
    x: number,
    y: number,
    width: number,
    items: RankedItem[],
  ) {
    addSectionLabel(title, x, y)

    const maxValue = items[0]?.value ?? 1

    items.slice(0, 6).forEach((item, index) => {
      const rowY = y + 20 + index * 18

      setSlate800()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text(item.label, x, rowY)

      addSmallBar({
        x: x + 52,
        y: rowY - 7,
        width: width - 82,
        value: (item.value / maxValue) * 100,
        color: "red",
      })

      setSlate700()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text(String(item.value), x + width - 20, rowY)
    })
  }

  function addBoardTable(
    title: string,
    x: number,
    y: number,
    width: number,
    rows: AirportBoardRow[],
  ) {
    addSectionLabel(title, x, y)

    const tableY = y + 14
    addCard(x, tableY, width, 202)

    rows.slice(0, 6).forEach((row, index) => {
      const rowY = tableY + 28 + index * 29

      if (index > 0) {
        doc.setDrawColor(241, 245, 249)
        doc.line(x + 12, rowY - 17, x + width - 12, rowY - 17)
      }

      const toneColor =
        row.tone === "delayed" || row.tone === "canceled"
          ? [185, 28, 28]
          : row.tone === "warning"
            ? [234, 88, 12]
            : [30, 41, 59]

      doc.setTextColor(toneColor[0], toneColor[1], toneColor[2])
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text(row.time, x + 12, rowY)

      setSlate500()
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.text(row.scheduledTime, x + 12, rowY + 10)

      setSlate800()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text(row.route, x + 84, rowY)

      doc.setTextColor(toneColor[0], toneColor[1], toneColor[2])
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.text(row.detail, x + 84, rowY + 10)

      setSlate800()
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.text(row.flight, x + width - 54, rowY)

      setSlate500()
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.text(row.status, x + width - 54, rowY + 10)
    })
  }

  const pressureLabel =
    airport.statusLabel ?? getSeverityStyles(airport.severity).label
  const weatherSummary = weather
    ? `${weather.weatherSummary} - ${weather.aviationRisk} aviation risk`
    : "Weather data temporarily unavailable"
  const lucyRead = getLucyLiveAirportRead(airport, weather)

  addHeader("Airport Intelligence Brief")

  setSlate800()
  doc.setFont("helvetica", "bold")
  doc.setFontSize(52)
  doc.text(airport.code, margin, 174)

  doc.setFontSize(20)
  doc.text(airport.name, margin + 132, 154)

  setSlate700()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`${airport.city}, ${airport.country}`, margin + 132, 174)
  doc.text(`Observed airport status: ${pressureLabel}`, margin + 132, 192)

  addCard(margin, 226, contentWidth, 110)
  addSectionLabel("Lucy live read", margin + 18, 250)

  setSlate700()
  doc.setFont("helvetica", "italic")
  doc.setFontSize(11)
  addWrappedText(lucyRead, margin + 18, 272, contentWidth - 36, 15)

  const metricWidth = (contentWidth - 36) / 4
  addMetricCard({
    x: margin,
    y: 366,
    width: metricWidth,
    label: "Departures",
    value: `${airport.departuresDelay}m`,
    detail: "Average live takeoff delay",
  })
  addMetricCard({
    x: margin + metricWidth + 12,
    y: 366,
    width: metricWidth,
    label: "Arrivals",
    value: `${airport.arrivalsDelay}m`,
    detail: "Average live landing delay",
  })
  addMetricCard({
    x: margin + metricWidth * 2 + 24,
    y: 366,
    width: metricWidth,
    label: "Cancellations",
    value: `${airport.cancellationRate}%`,
    detail: "Current cancellation signal",
  })
  addMetricCard({
    x: margin + metricWidth * 3 + 36,
    y: 366,
    width: metricWidth,
    label: "Weather",
    value: weather ? formatNullableNumber(weather.temperatureC) + "C" : "-",
    detail: weatherSummary,
  })

  addCard(margin, 482, contentWidth, 150)
  addSectionLabel("Operational summary", margin + 18, 506)

  setSlate800()
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Arrivals & Departures", margin + 18, 534)

  setSlate700()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  addWrappedText(
    `${airport.departuresDelay}m departure delay - ${airport.arrivalsDelay}m arrival delay - ${airport.cancellationRate}% cancellation pressure.`,
    margin + 18,
    554,
    235,
    13,
  )

  setSlate800()
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Weather Conditions", margin + 300, 534)

  setSlate700()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  addWrappedText(weatherSummary, margin + 300, 554, 230, 13)

  setSlate500()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text(
    "This first PDF version uses the current airport intelligence page data and mock provider-ready boards.",
    margin + 18,
    612,
  )

  addFooter(1)

  doc.addPage()
  addHeader("Operations Detail")

  addDelayBreakdown(
    "Departures Delay Profile",
    margin,
    145,
    performance.departures,
    airport.departuresDelay,
  )

  addDelayBreakdown(
    "Arrivals Delay Profile",
    margin + 282,
    145,
    performance.arrivals,
    airport.arrivalsDelay,
  )

  addCard(margin, 330, contentWidth, 130)
  addSectionLabel("Weather metrics", margin + 18, 354)

  const weatherMetrics = weather
    ? [
      ["Temperature", `${formatNullableNumber(weather.temperatureC)} C`],
      ["Feels like", `${formatNullableNumber(weather.feelsLikeC)} C`],
      ["Wind", `${formatNullableNumber(weather.windSpeedKmh)} km/h`],
      ["Gusts", `${formatNullableNumber(weather.windGustKmh)} km/h`],
      ["Humidity", `${formatNullableNumber(weather.humidityPercent)}%`],
      ["Cloud cover", `${formatNullableNumber(weather.cloudCoverPercent)}%`],
      ["Rain", `${formatNullableNumber(weather.precipitationMm)} mm`],
      ["Pressure", `${formatNullableNumber(weather.pressureHpa)} hPa`],
    ]
    : [["Weather", "Temporarily unavailable"]]

  weatherMetrics.forEach((metric, index) => {
    const column = index % 4
    const row = Math.floor(index / 4)
    const x = margin + 18 + column * 130
    const y = 384 + row * 42

    setSlate500()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.text(metric[0].toUpperCase(), x, y)

    setSlate800()
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text(metric[1], x, y + 17)
  })

  addCard(margin, 500, contentWidth, 160)
  addRankedList(
    "Most disrupted routes",
    margin + 18,
    528,
    230,
    disruptedRoutes,
  )
  addRankedList(
    "Most disrupted airlines",
    margin + 300,
    528,
    230,
    disruptedAirlines,
  )

  addFooter(2)

  doc.addPage()
  addHeader("Airport Boards")

  addBoardTable("Departures board", margin, 145, contentWidth, departureRows)
  addBoardTable("Arrivals board", margin, 392, contentWidth, arrivalRows)

  addCard(margin, 645, contentWidth, 66)
  addSectionLabel("Provider note", margin + 18, 668)

  setSlate700()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  addWrappedText(
    "This preview brief is wired to the current Skysirv Live Airports page model. Departures, arrivals, route pressure, and airline impact can later be replaced with Cirium, FlightAware, FIDS, schedule, or flight-status provider data.",
    margin + 18,
    688,
    contentWidth - 36,
    12,
  )

  addFooter(3)

  const fileDate = new Date().toISOString().slice(0, 10)
  doc.save(`skysirv-live-airports-${airport.code.toLowerCase()}-${fileDate}.pdf`)
}

function SkysirvLiveAirportsTopHeader({
  selectedAirportCode,
}: {
  selectedAirportCode: string
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const filteredAirports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return skysirvLiveAirports.slice(0, 8)
    }

    return skysirvLiveAirports
      .filter((airport) => {
        const searchText = [
          airport.code,
          airport.name,
          airport.city,
          airport.country,
        ]
          .join(" ")
          .toLowerCase()

        return searchText.includes(normalizedSearch)
      })
      .sort((firstAirport, secondAirport) => {
        const firstCodeStarts = firstAirport.code
          .toLowerCase()
          .startsWith(normalizedSearch)
        const secondCodeStarts = secondAirport.code
          .toLowerCase()
          .startsWith(normalizedSearch)

        if (firstCodeStarts && !secondCodeStarts) return -1
        if (!firstCodeStarts && secondCodeStarts) return 1

        return firstAirport.code.localeCompare(secondAirport.code)
      })
      .slice(0, 8)
  }, [searchTerm])

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[1420px] items-center justify-between gap-8 px-8">
        <Link
          href={`/skysirv-live/airports/${selectedAirportCode}`}
          className="shrink-0"
        >
          <img
            src="/branding/logo/skysirv-live-airports-blue.svg"
            alt="Skysirv Live Airports"
            className="h-10 w-auto"
          />
        </Link>

        <div className="relative w-full max-w-[560px]">
          <div className="flex h-11 items-center rounded-full bg-slate-100 px-5 shadow-inner">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search airports by code or name..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-[52px] z-50 overflow-hidden rounded-[1rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              {filteredAirports.length > 0 ? (
                <div className="max-h-[360px] overflow-y-auto py-2">
                  {filteredAirports.map((airport) => {
                    const styles = getSeverityStyles(airport.severity)

                    return (
                      <Link
                        key={airport.code}
                        href={`/skysirv-live/airports/${airport.code}`}
                        onClick={() => {
                          setSearchTerm("")
                          setIsSearchOpen(false)
                        }}
                        className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-slate-50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-800">
                              {airport.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                              {airport.city}, {airport.country}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-black text-blue-700">
                          {airport.code}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="px-4 py-5">
                  <p className="text-sm font-black text-slate-800">
                    No airports found
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    Try searching by airport code, airport name, city, or country.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          href={`/skysirv-live/${selectedAirportCode}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-blue-700 px-6 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
        >
          Skysirv Live
        </Link>
      </div>
    </div>
  )
}

function LiveAirportMapStage({
  airport,
  nearbyAirports,
  mapStyleKey,
  onMapStyleChange,
}: {
  airport: SkysirvLiveAirport
  nearbyAirports: SkysirvLiveAirport[]
  mapStyleKey: MapStyleKey
  onMapStyleChange: (mapStyleKey: MapStyleKey) => void
}) {
  const selectedStyles = getSeverityStyles(airport.severity)

  return (
    <section className="relative h-[470px] overflow-hidden border-b border-slate-200 bg-slate-100">
      <Map
        key={airport.code}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: airport.longitude,
          latitude: airport.latitude,
          zoom: 8.75,
        }}
        mapStyle={MAP_STYLES[mapStyleKey]}
        projection="mercator"
        attributionControl
        reuseMaps
        style={{ height: "100%", width: "100%" }}
      >
        <NavigationControl position="bottom-right" />

        {nearbyAirports.map((nearbyAirport) => {
          const nearbyStyles = getSeverityStyles(nearbyAirport.severity)

          return (
            <Marker
              key={nearbyAirport.code}
              longitude={nearbyAirport.longitude}
              latitude={nearbyAirport.latitude}
              anchor="bottom"
            >
              <Link
                href={`/skysirv-live/airports/${nearbyAirport.code}`}
                className="group flex flex-col items-center"
              >
                <span
                  className={`h-4 w-4 rounded-full border-2 border-white ${nearbyStyles.dot} shadow-[0_8px_18px_rgba(15,23,42,0.22)] transition group-hover:scale-125`}
                />

                <span className="mt-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white opacity-80 shadow-sm transition group-hover:opacity-100">
                  {nearbyAirport.code}
                </span>
              </Link>
            </Marker>
          )
        })}

        <Marker
          longitude={airport.longitude}
          latitude={airport.latitude}
          anchor="bottom"
        >
          <div className="relative flex flex-col items-center">
            <span
              className={`absolute top-[-18px] h-24 w-24 rounded-full ${selectedStyles.dot} opacity-15`}
            />

            <span
              className={`relative h-14 w-14 rounded-full border-[7px] border-white ${selectedStyles.dot} shadow-[0_18px_38px_rgba(15,23,42,0.28)]`}
            />

            <span className="mt-1 rounded-full bg-slate-900 px-3 py-1 text-sm font-black tracking-tight text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)]">
              {airport.code}
            </span>
          </div>
        </Marker>
      </Map>

      <div className="pointer-events-none absolute left-8 top-7 rounded-[1.25rem] border border-white/80 bg-white/90 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          Airport map
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-800">
          {airport.name}
        </h2>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          Nearby airport markers are clickable.
        </p>
      </div>

      <div className="pointer-events-auto absolute bottom-6 right-[58px] z-30 hidden overflow-hidden rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl md:flex">
        {(["standard", "satellite"] as MapStyleKey[]).map((styleKey) => {
          const isActive = mapStyleKey === styleKey

          return (
            <button
              key={styleKey}
              type="button"
              onClick={() => onMapStyleChange(styleKey)}
              className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${isActive
                ? "bg-blue-700 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                }`}
            >
              {styleKey === "standard" ? "Map" : "Satellite"}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function OperationalStatusCard({
  airport,
  weather,
  weatherLoading,
  weatherError,
}: {
  airport: SkysirvLiveAirport
  weather: SkysirvLiveWeatherSnapshot | null
  weatherLoading: boolean
  weatherError: string | null
}) {
  const styles = getSeverityStyles(airport.severity)
  const isNormal = airport.severity === "normal"

  return (
    <section className="min-h-[380px] rounded-[1.25rem] bg-emerald-50/70 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-emerald-100">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full ${isNormal ? "bg-emerald-500" : styles.dot
            }`}
        />

        <div className="min-w-0">
          <h2 className="text-sm font-black text-slate-800">
            {isNormal ? "Normal Operations" : "Airport Pressure"}
          </h2>

          <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">
            {isNormal
              ? "No major operational issues reported."
              : airport.disruptionReason ?? "Live disruption pressure detected."}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <OperationalSignal
          title="Arrivals & Departures"
          detail={
            isNormal
              ? "No operational issues reported."
              : `${airport.departuresDelay}m departure delay · ${airport.arrivalsDelay}m arrival delay`
          }
        />

        <OperationalSignal
          title="Weather"
          detail={
            weatherLoading
              ? "Loading current conditions..."
              : weatherError || !weather
                ? "Weather data temporarily unavailable."
                : weather.riskReason ?? weather.weatherSummary
          }
        />

        <OperationalSignal
          title="Live pressure model"
          detail={`Pressure score ${airport.pressureScore ?? 0} · departure pressure ${airport.departurePressurePercent ?? 0}% · arrival pressure ${airport.arrivalPressurePercent ?? 0}% · cancellation pressure ${airport.cancellationRate}%`}
        />
      </div>

      <button
        type="button"
        className="mt-5 h-8 w-full rounded-md bg-emerald-100 text-xs font-black text-emerald-700 transition hover:bg-emerald-200"
      >
        View full operational report
      </button>
    </section>
  )
}

function OperationalSignal({
  title,
  detail,
}: {
  title: string
  detail: string
}) {
  return (
    <div>
      <p className="text-xs font-black text-slate-800">{title}</p>
      <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-700">
        {detail}
      </p>
    </div>
  )
}

function DelaySummaryCard({
  title,
  label,
  stats,
  delayMinutes,
  bars,
}: {
  title: string
  label: string
  stats: {
    onTime: number
    delayed: number
    canceled: number
    diverted: number
  }
  delayMinutes: number
  bars: number[]
}) {
  const redWidth = Math.max(stats.delayed + stats.canceled + stats.diverted, 4)

  return (
    <section className="min-h-[380px] rounded-[1.25rem] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
      <h2 className="text-sm font-black text-slate-800">{title}</h2>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <DelayStat label="On-time" value={stats.onTime} tone="green" />
        <DelayStat label="Delayed" value={stats.delayed} tone="red" />
        <DelayStat label="Canceled" value={stats.canceled} tone="slate" />
        <DelayStat label="Diverted" value={stats.diverted} tone="slate" />
      </div>

      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
        <span
          className="h-full bg-emerald-500"
          style={{ width: `${stats.onTime}%` }}
        />
        <span className="h-full bg-red-600" style={{ width: `${redWidth}%` }} />
      </div>

      <p className="mt-4 text-[11px] font-semibold text-slate-700">{label}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <p className="text-xs font-black text-emerald-700">{delayMinutes}m</p>
      </div>

      <div className="mt-6 h-[190px] border-t border-slate-100 pt-5">
        <div className="flex h-[132px] items-end gap-1.5">
          {bars.map((bar, index) => (
            <span
              key={`${title}-${index}`}
              className={`w-full rounded-t-sm ${index < 6 ? "bg-orange-400" : "bg-emerald-300"
                }`}
              style={{ height: `${bar * 2.3}px` }}
            />
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400">
          <span>8:00</span>
          <span>Now</span>
          <span>12:00</span>
          <span>22:00</span>
        </div>
      </div>
    </section>
  )
}

function DelayStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "green" | "red" | "slate"
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-700"
      : tone === "red"
        ? "text-red-700"
        : "text-slate-800"

  return (
    <div>
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
      <p className={`mt-1 text-4xl font-black tracking-tight ${toneClass}`}>
        {value}%
      </p>
    </div>
  )
}

function FlightBoardCard({
  title,
  actionLabel,
  rows,
}: {
  title: string
  actionLabel: string
  rows: AirportBoardRow[]
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black text-slate-800">{title}</h2>

          <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-orange-600">
            Preview
          </span>
        </div>

        <button
          type="button"
          className="text-xs font-black text-blue-700 transition hover:text-blue-800"
        >
          {actionLabel}
        </button>
      </div>

      <div className="overflow-hidden rounded-[1rem] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
        {rows.map((row) => (
          <div
            key={`${title}-${row.flight}-${row.time}`}
            className="grid grid-cols-[88px_1fr_74px] items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0"
          >
            <div>
              <p className={`text-xs font-black ${getBoardToneClass(row.tone)}`}>
                {row.time}
              </p>

              <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                {row.scheduledTime}
              </p>
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-black text-slate-800">
                {row.route}
              </p>

              <p className={`mt-0.5 truncate text-[10px] font-semibold ${getBoardToneClass(row.tone)}`}>
                {row.detail}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-black text-slate-800">{row.flight}</p>

              <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                {row.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CurrentWeatherCard({
  airport,
  weather,
  weatherLoading,
  weatherError,
}: {
  airport: SkysirvLiveAirport
  weather: SkysirvLiveWeatherSnapshot | null
  weatherLoading: boolean
  weatherError: string | null
}) {
  if (weatherLoading) {
    return (
      <section className="rounded-[1rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
        <h2 className="text-sm font-black text-slate-800">Current Weather</h2>
        <p className="mt-3 text-xs font-semibold text-slate-700">
          Loading weather around {airport.city}...
        </p>
      </section>
    )
  }

  if (weatherError || !weather) {
    return (
      <section className="rounded-[1rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
        <h2 className="text-sm font-black text-slate-800">Current Weather</h2>
        <p className="mt-3 text-xs font-semibold text-slate-700">
          Weather is temporarily unavailable for {airport.city}.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-[1rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black text-slate-800">Current Weather</h2>

        <div className="flex rounded-full bg-slate-100 p-0.5 text-[10px] font-black">
          <span className="rounded-full px-2 py-1 text-slate-500">Imperial</span>
          <span className="rounded-full bg-white px-2 py-1 text-slate-800 shadow-sm">
            Metric
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-5xl font-black tracking-tight text-slate-800">
            {formatNullableNumber(weather.temperatureC)}°C
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {weather.weatherSummary}
          </p>
        </div>

        <span className="text-5xl" aria-hidden="true">
          {getWeatherEmoji(weather.weatherCode)}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <WeatherRange
          label="Cloud cover"
          value={`${formatNullableNumber(weather.cloudCoverPercent)}%`}
          width={weather.cloudCoverPercent ?? 0}
        />

        <WeatherRange
          label="Visibility signal"
          value={weather.aviationRisk}
          width={getWeatherRiskWidth(weather.aviationRisk)}
        />

        <WeatherRange
          label="Wind"
          value={`${formatNullableNumber(weather.windSpeedKmh)} km/h`}
          width={Math.min(100, (weather.windSpeedKmh ?? 0) * 2)}
        />

        <WeatherRange
          label="Gusts"
          value={`${formatNullableNumber(weather.windGustKmh)} km/h`}
          width={Math.min(100, (weather.windGustKmh ?? 0) * 2)}
        />
      </div>

      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        Data updates every 10 min
      </p>
    </section>
  )
}

function WeatherRange({
  label,
  value,
  width,
}: {
  label: string
  value: string
  width: number
}) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-[10px] font-black text-slate-500">{label}</p>
        <p className="text-[10px] font-black text-slate-800">{value}</p>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-red-600"
          style={{ width: `${Math.min(100, Math.max(4, width))}%` }}
        />
      </div>
    </div>
  )
}

function DailyPerformanceCard({
  airport,
  performance,
  routes,
  airlines,
}: {
  airport: SkysirvLiveAirport
  performance: ReturnType<typeof getAirportPerformance>
  routes: RankedItem[]
  airlines: RankedItem[]
}) {
  const sourceLabel = getPressureSourceLabel(airport)

  return (
    <section className="rounded-[1rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-slate-800">
            Daily Performance
          </h2>

          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-black tracking-tight text-slate-800">
              {performance.pressureScore}
            </p>

            <p className="pb-1 text-xs font-semibold text-slate-700">
              live pressure score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-700 px-3 py-1.5 text-[10px] font-black text-white">
            Departures
          </span>

          <span className="rounded-full px-3 py-1.5 text-[10px] font-black text-slate-700">
            Arrivals
          </span>

          <span className="rounded-full px-3 py-1.5 text-[10px] font-black text-slate-700">
            Today
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[130px_1fr] gap-5">
        <div className="space-y-2">
          <PerformanceLegend
            label="On time"
            value={performance.departures.onTime}
            tone="bg-emerald-500"
          />

          <PerformanceLegend
            label="Delayed"
            value={performance.departures.delayed}
            tone="bg-red-600"
          />

          <PerformanceLegend
            label="Canceled"
            value={performance.departures.canceled}
            tone="bg-slate-400"
          />
        </div>

        <div>
          <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
            <span
              className="h-full bg-emerald-500"
              style={{ width: `${performance.departures.onTime}%` }}
            />
            <span
              className="h-full bg-red-600"
              style={{ width: `${performance.departures.delayed}%` }}
            />
            <span
              className="h-full bg-slate-400"
              style={{ width: `${performance.departures.canceled}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <RankedList
              title="Most disrupted routes"
              actionLabel="Show more"
              items={routes}
              maxValue={routes[0]?.value ?? 1}
            />

            <RankedList
              title="Most disrupted airlines"
              actionLabel="Show more"
              items={airlines}
              maxValue={airlines[0]?.value ?? 1}
              compact
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[10px] font-semibold text-slate-400">
        {airport.code} pressure model is using {sourceLabel}. Board rows, route rankings,
        airline rankings, and airport volume remain provider-ready preview data until
        FIDS, flight status, or schedules access is connected.
      </p>
    </section>
  )
}

function PerformanceLegend({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${tone}`} />
        <p className="text-[11px] font-black text-slate-700">{label}</p>
      </div>

      <p className="text-[11px] font-black text-slate-800">{value}%</p>
    </div>
  )
}

function RankedList({
  title,
  actionLabel,
  items,
  maxValue,
  compact = false,
}: {
  title: string
  actionLabel: string
  items: RankedItem[]
  maxValue: number
  compact?: boolean
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-800">{title}</h3>

        <button
          type="button"
          className="text-[10px] font-black text-blue-700 transition hover:text-blue-800"
        >
          {actionLabel}
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={`${title}-${item.label}`}
            className={`grid items-center gap-2 ${compact ? "grid-cols-[32px_1fr_26px]" : "grid-cols-[42px_1fr_28px]"
              }`}
          >
            <p className="truncate text-[11px] font-black text-slate-800">
              {item.label}
            </p>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-red-600"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>

            <p className="text-right text-[10px] font-black text-slate-700">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AirportStatsCard({
  airport,
  routes,
  airlines,
}: {
  airport: SkysirvLiveAirport
  routes: RankedItem[]
  airlines: RankedItem[]
}) {
  const totalFlights =
    520 + airport.departuresDelay * 4 + airport.arrivalsDelay * 3

  return (
    <section className="rounded-[1rem] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-sm font-black text-slate-800">Airport Stats</h2>

          <div className="mt-3 flex items-end gap-3">
            <p className="text-5xl font-black tracking-tight text-slate-800">
              {totalFlights}
            </p>

            <p className="pb-1 text-xs font-semibold text-slate-700">
              flights today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black text-orange-600">
            Today
          </span>

          <span className="rounded-full px-3 py-1.5 text-[10px] font-black text-slate-600">
            Next 7 days
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[160px_1fr_1fr] gap-6">
        <div className="space-y-2">
          <StatLine value="82" label="Airlines" />
          <StatLine value="190" label="Routes served" />
          <StatLine value="71" label="Countries served" />
        </div>

        <RankedList
          title="Busiest routes"
          actionLabel="Show more"
          items={routes}
          maxValue={routes[0]?.value ?? 1}
        />

        <RankedList
          title="Busiest airlines"
          actionLabel="Show more"
          items={airlines}
          maxValue={airlines[0]?.value ?? 1}
        />
      </div>
    </section>
  )
}

function StatLine({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <p className="w-9 text-sm font-black text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-700">{label}</p>
    </div>
  )
}

function LucyAirportCard({
  airport,
  weather,
}: {
  airport: SkysirvLiveAirport
  weather: SkysirvLiveWeatherSnapshot | null
}) {
  return (
    <section className="rounded-[1rem] bg-blue-50 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.045)] ring-1 ring-blue-100">
      <h2 className="text-sm font-black text-slate-800">Ask Lucy</h2>

      <p className="mt-3 text-xs font-semibold leading-5 text-slate-700">
        {getLucyLiveAirportRead(airport, weather)}
      </p>

      <button
        type="button"
        className="mt-5 h-9 w-full rounded-full bg-blue-700 text-xs font-black text-white transition hover:bg-blue-800"
      >
        Ask about this airport
      </button>

      <div className="mt-4 rounded-[0.8rem] bg-white/70 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">
          Next layer
        </p>

        <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">
          Personalized connection risk, route pressure, and itinerary-aware airport
          guidance.
        </p>
      </div>
    </section>
  )
}

function getAirportPerformance(airport: SkysirvLiveAirport) {
  const liveDeparturePressure = clamp(
    Math.round(
      airport.departurePressurePercent ??
      airport.averageDepartureDelayMinutes ??
      airport.departuresDelay,
    ),
    0,
    100,
  )

  const liveArrivalPressure = clamp(
    Math.round(
      airport.arrivalPressurePercent ??
      airport.averageArrivalDelayMinutes ??
      airport.arrivalsDelay,
    ),
    0,
    100,
  )

  const liveCancellationPressure = clamp(
    Math.round(airport.cancellationRate),
    0,
    100,
  )

  const departureDiverted = airport.severity === "major" ? 1 : 0
  const arrivalDiverted = airport.severity === "major" ? 1 : 0

  const departureOnTime = clamp(
    100 - liveDeparturePressure - liveCancellationPressure - departureDiverted,
    0,
    100,
  )

  const arrivalOnTime = clamp(
    100 - liveArrivalPressure - liveCancellationPressure - arrivalDiverted,
    0,
    100,
  )

  return {
    pressureScore: airport.pressureScore ?? liveDeparturePressure,
    totalFlights: 520 + airport.departuresDelay * 4 + airport.arrivalsDelay * 3,
    departures: {
      onTime: departureOnTime,
      delayed: liveDeparturePressure,
      canceled: liveCancellationPressure,
      diverted: departureDiverted,
    },
    arrivals: {
      onTime: arrivalOnTime,
      delayed: liveArrivalPressure,
      canceled: liveCancellationPressure,
      diverted: arrivalDiverted,
    },
  }
}

function getDepartureBoardRows(airport: SkysirvLiveAirport): AirportBoardRow[] {
  const heavyDelay = airport.departuresDelay >= 20

  return [
    {
      time: heavyDelay ? "11:25 AM" : "11:05 AM",
      scheduledTime: "10:55 AM",
      route: "Honolulu",
      detail: heavyDelay ? `${airport.departuresDelay}m late` : "On time",
      flight: "SK 820",
      status: "Gate D7",
      tone: heavyDelay ? "delayed" : "normal",
    },
    {
      time: "11:45 AM",
      scheduledTime: "11:25 AM",
      route: "Mumbai",
      detail: "Arrival aircraft late",
      flight: "DL 409",
      status: "Gate A9",
      tone: "delayed",
    },
    {
      time: "12:10 PM",
      scheduledTime: "11:50 AM",
      route: "Anchorage",
      detail: "Delayed",
      flight: "AS 623",
      status: "Gate C4",
      tone: "warning",
    },
    {
      time: "12:20 PM",
      scheduledTime: "12:20 PM",
      route: "Los Angeles",
      detail: "Departed early",
      flight: "AA 522",
      status: "Boarding",
      tone: "normal",
    },
    {
      time: "12:40 PM",
      scheduledTime: "12:35 PM",
      route: "Santiago",
      detail: "Departed 3m late",
      flight: "BB 237",
      status: "Gate B12",
      tone: "warning",
    },
    {
      time: "1:05 PM",
      scheduledTime: "12:50 PM",
      route: "Cancun",
      detail: "Expected 15m late",
      flight: "B6 1052",
      status: "Gate E5",
      tone: "delayed",
    },
  ]
}

function getArrivalBoardRows(airport: SkysirvLiveAirport): AirportBoardRow[] {
  const heavyDelay = airport.arrivalsDelay >= 20

  return [
    {
      time: heavyDelay ? "12:02 PM" : "11:48 AM",
      scheduledTime: "11:35 AM",
      route: "New York",
      detail: heavyDelay ? `${airport.arrivalsDelay}m late` : "On approach",
      flight: "UA 929",
      status: "Gate A7",
      tone: heavyDelay ? "delayed" : "normal",
    },
    {
      time: "12:10 PM",
      scheduledTime: "11:54 AM",
      route: "Chicago",
      detail: "Late arrival",
      flight: "DL 5265",
      status: "Gate C9",
      tone: "delayed",
    },
    {
      time: "12:20 PM",
      scheduledTime: "12:05 PM",
      route: "Dakar",
      detail: "Diverted from DSS",
      flight: "DL 217",
      status: "Gate B4",
      tone: "warning",
    },
    {
      time: "12:40 PM",
      scheduledTime: "12:35 PM",
      route: "Pittsburgh",
      detail: "On time",
      flight: "DL 5677",
      status: "Gate D3",
      tone: "normal",
    },
    {
      time: "12:45 PM",
      scheduledTime: "12:30 PM",
      route: "Santiago",
      detail: "15m late",
      flight: "B6 536",
      status: "Belt 7",
      tone: "delayed",
    },
    {
      time: "12:50 PM",
      scheduledTime: "12:40 PM",
      route: "Delhi",
      detail: "Canceled",
      flight: "AI 101",
      status: "Canceled",
      tone: "canceled",
    },
  ]
}

function getDisruptedRoutes(airport: SkysirvLiveAirport): RankedItem[] {
  const boost = Math.max(1, Math.round((airport.departuresDelay + airport.arrivalsDelay) / 12))

  return [
    { label: "ORD", value: 4 + boost },
    { label: "LAX", value: 3 + boost },
    { label: "MCO", value: 3 + boost },
    { label: "FLL", value: 2 + boost },
    { label: "CUN", value: 2 + boost },
    { label: "STI", value: 2 + boost },
  ]
}

function getDisruptedAirlines(airport: SkysirvLiveAirport): RankedItem[] {
  const boost = Math.max(1, Math.round(airport.departuresDelay / 10))

  return [
    { label: "DL", value: 42 + boost },
    { label: "B6", value: 16 + boost },
    { label: "UA", value: 8 + boost },
    { label: "AC", value: 7 + boost },
    { label: "AS", value: 5 + boost },
    { label: "CM", value: 3 + boost },
  ]
}

function getBusyRoutes(airport: SkysirvLiveAirport): RankedItem[] {
  const base = Math.max(24, 44 - Math.round(airport.departuresDelay / 3))

  return [
    { label: "Los Angeles", value: base },
    { label: "London", value: base - 4 },
    { label: "San Francisco", value: base - 8 },
    { label: "Boston", value: base - 12 },
    { label: "Orlando", value: base - 18 },
  ]
}

function getBusyAirlines(airport: SkysirvLiveAirport): RankedItem[] {
  const base = Math.max(180, 240 - airport.arrivalsDelay)

  return [
    { label: "AA", value: base },
    { label: "DL", value: base - 32 },
    { label: "UA", value: base - 58 },
    { label: "B6", value: base - 72 },
    { label: "AS", value: base - 96 },
  ]
}

function getPressureSourceLabel(airport: SkysirvLiveAirport) {
  const activeSources = airport.pressureSourceBreakdown?.activeSources ?? []

  if (activeSources.length === 0) {
    return airport.source === "Skysirv"
      ? "Skysirv Live pressure signals"
      : "preview airport signals"
  }

  const readableSources = activeSources.map((source) => {
    if (source === "faa") return "FAA"
    if (source === "weather") return "weather"
    if (source === "flight_performance") return "live flight performance"

    return source
  })

  return readableSources.join(", ")
}

function getBoardToneClass(tone: AirportBoardRow["tone"]) {
  if (tone === "delayed") return "text-red-700"
  if (tone === "canceled") return "text-red-700"
  if (tone === "warning") return "text-orange-600"

  return "text-slate-800"
}

function getWeatherRiskWidth(
  risk: "normal" | "minor" | "moderate" | "major",
) {
  if (risk === "major") return 92
  if (risk === "moderate") return 68
  if (risk === "minor") return 38

  return 12
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

function getLucyLiveAirportRead(
  airport: SkysirvLiveAirport,
  weather: SkysirvLiveWeatherSnapshot | null,
) {
  const weatherSignal = weather
    ? ` Weather is showing ${weather.weatherSummary.toLowerCase()} with ${weather.aviationRisk} aviation risk.`
    : ""

  if (airport.severity === "major") {
    return `${airport.city} is showing major pressure. I’d avoid tight connections here and watch departure timing closely.${weatherSignal}`
  }

  if (airport.severity === "moderate") {
    return `${airport.city} is showing moderate pressure. I’d give this airport extra breathing room if your itinerary depends on a same-day connection.${weatherSignal}`
  }

  if (airport.severity === "minor") {
    return `${airport.city} has minor pressure building. I’d keep an eye on departure trends before assuming the airport is fully smooth.${weatherSignal}`
  }

  return `${airport.city} is operating within a normal pressure range right now. I’ll keep watching delay, cancellation, and weather signals.${weatherSignal}`
}

function getNearbyAirports(
  airport: SkysirvLiveAirport,
  airportCatalog: SkysirvLiveAirport[],
  limit: number,
) {
  return airportCatalog
    .filter((candidateAirport) => candidateAirport.code !== airport.code)
    .map((candidateAirport) => ({
      airport: candidateAirport,
      distanceKm: getAirportDistanceKm(
        airport.latitude,
        airport.longitude,
        candidateAirport.latitude,
        candidateAirport.longitude,
      ),
    }))
    .sort((firstAirport, secondAirport) => {
      return firstAirport.distanceKm - secondAirport.distanceKm
    })
    .slice(0, limit)
    .map((nearbyAirport) => nearbyAirport.airport)
}

function getAirportDistanceKm(
  firstLatitude: number,
  firstLongitude: number,
  secondLatitude: number,
  secondLongitude: number,
) {
  const earthRadiusKm = 6371
  const latitudeDelta = degreesToRadians(secondLatitude - firstLatitude)
  const longitudeDelta = degreesToRadians(secondLongitude - firstLongitude)

  const firstLatitudeRadians = degreesToRadians(firstLatitude)
  const secondLatitudeRadians = degreesToRadians(secondLatitude)

  const haversineValue =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitudeRadians) *
    Math.cos(secondLatitudeRadians) *
    Math.sin(longitudeDelta / 2) *
    Math.sin(longitudeDelta / 2)

  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue))

  return earthRadiusKm * angularDistance
}

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}