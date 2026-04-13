"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox"
import { motion } from "framer-motion"
import "mapbox-gl/dist/mapbox-gl.css"

type AirportNode = {
  airportCode: string
  lat?: number
  lng?: number
  name?: string
  city?: string
  country?: string
  visits?: number
  layoverHours?: number
  loungeHours?: number
  flights?: number
}

type RouteArc = {
  tripId: string
  segmentId: string
  segmentOrder: number
  origin: string
  destination: string
  airlineCode: string | null
  flightNumber: string | null
  status: string
  source: string | null
  scheduledDepartureAt: string | null
  scheduledArrivalAt: string | null
}

type TravelGlobeProps = {
  airportNodes?: AirportNode[]
  routeArcs?: RouteArc[]
}

export default function TravelGlobe({
  airportNodes = [],
  routeArcs = [],
}: TravelGlobeProps) {
  const mapRef = useRef<MapRef | null>(null)
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedAirport, setSelectedAirport] = useState<AirportNode | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 20,
    longitude: 0,
    zoom: 0.8,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  const airports = useMemo(() => airportNodes, [airportNodes])

  const routes = useMemo(() => routeArcs, [routeArcs])

  const airportMap = useMemo(() => {
    return new globalThis.Map<string, AirportNode>(
      airports.map((airport) => [airport.airportCode, airport] as const)
    )
  }, [airports])

  const markInteraction = useCallback(() => {
    setIsInteracting(true)

    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }

    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 1400)
  }, [])

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapReady) return
    if (isInteracting) return

    const interval = setInterval(() => {
      setViewState((prev) => ({
        ...prev,
        longitude: prev.longitude + 0.12,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [mapReady, isInteracting])

  const handleAirportSelect = useCallback((airport: AirportNode) => {
    setSelectedAirport(airport)
    setIsInteracting(true)

    if (typeof airport.lng === "number" && typeof airport.lat === "number") {
      mapRef.current?.flyTo({
        center: [airport.lng, airport.lat],
        zoom: 2.6,
        duration: 2200,
        essential: true,
      })
    }

    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }

    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 2600)
  }, [])

  const arcPaths = useMemo(() => {
    if (!mapReady || !mapRef.current) return []

    const map = mapRef.current.getMap()

    return routes
      .map((route, index) => {
        const fromAirport = airportMap.get(route.origin)
        const toAirport = airportMap.get(route.destination)

        if (
          !fromAirport ||
          !toAirport ||
          typeof fromAirport.lng !== "number" ||
          typeof fromAirport.lat !== "number" ||
          typeof toAirport.lng !== "number" ||
          typeof toAirport.lat !== "number"
        ) {
          return null
        }

        const start = map.project([fromAirport.lng, fromAirport.lat])
        const end = map.project([toAirport.lng, toAirport.lat])

        const dx = end.x - start.x
        const dy = end.y - start.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        const midX = (start.x + end.x) / 2
        const midY = (start.y + end.y) / 2 - Math.min(120, distance * 0.18)

        const path = `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`

        return {
          id: `${route.origin}-${route.destination}-${index}`,
          path,
        }
      })
      .filter(Boolean) as { id: string; path: string }[]
  }, [airportMap, mapReady, routes, viewState])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
              Globe View
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-950">
              Airports visited in 2026
            </h3>
          </div>

          <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            Interactive
          </div>
        </div>

        <div className="relative h-[520px] w-full overflow-hidden">
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            {...viewState}
            onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
            onLoad={() => setMapReady(true)}
            onDragStart={markInteraction}
            onDragEnd={markInteraction}
            onZoomStart={markInteraction}
            onZoomEnd={markInteraction}
            onRotateStart={markInteraction}
            onRotateEnd={markInteraction}
            projection="globe"
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
          >
            <NavigationControl position="top-right" showCompass showZoom />

            {airports
              .filter((airport) => typeof airport.lat === "number" && typeof airport.lng === "number")
              .map((airport, index) => (
                <Marker
                  key={airport.airportCode}
                  latitude={airport.lat as number}
                  longitude={airport.lng as number}
                  anchor="center"
                >
                  <button
                    type="button"
                    onClick={() => handleAirportSelect(airport)}
                    className="group relative flex h-6 w-6 items-center justify-center"
                    aria-label={`Open airport details for ${airport.airportCode}`}
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.4, 0.05, 0.4],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: index * 0.18,
                        ease: "easeInOut",
                      }}
                      className="absolute h-6 w-6 rounded-full bg-sky-400/60"
                    />

                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="relative block h-3.5 w-3.5 rounded-full bg-sky-600 shadow-[0_0_16px_rgba(14,165,233,0.75)] ring-4 ring-sky-200/50"
                    />
                  </button>
                </Marker>
              ))}
          </Map>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>
      </div>

      <motion.div
        key={selectedAirport?.airportCode ?? "empty"}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
      >
        {selectedAirport ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
                  Airport Intelligence
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {selectedAirport.airportCode}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedAirport.name ?? "Airport"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedAirport.city ?? "Unknown city"}, {selectedAirport.country ?? "Unknown country"}
                </p>
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                Selected
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <GlobeMetric label="Visits" value={String(selectedAirport.visits ?? 0)} />
              <GlobeMetric label="Flights" value={String(selectedAirport.flights ?? 0)} />
              <GlobeMetric
                label="Layover Time"
                value={`${(selectedAirport.layoverHours ?? 0).toFixed(1)} hrs`}
              />
              <GlobeMetric
                label="Lounge Time"
                value={`${(selectedAirport.loungeHours ?? 0).toFixed(1)} hrs`}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                Snapshot
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {selectedAirport.airportCode} appeared {selectedAirport.visits ?? 0} times in your
                2026 travel path, with {(selectedAirport.layoverHours ?? 0).toFixed(1)} total
                hours spent in transit and {(selectedAirport.loungeHours ?? 0).toFixed(1)} hours
                attributed to lounge access.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50">
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="block h-3 w-3 rounded-full bg-sky-600 shadow-[0_0_14px_rgba(14,165,233,0.55)]"
              />
            </div>

            <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
              Click an airport on the globe
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              Select a glowing destination node to inspect airport activity,
              transit time, and yearly travel footprint.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function GlobeMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  )
}