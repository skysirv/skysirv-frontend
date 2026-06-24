"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Map, { NavigationControl, type MapRef } from "react-map-gl/mapbox"

import {
  airports,
  getAirportPressureScore,
  getAirportSeverityRank,
  mergeAirportPressureWithAirports,
  type SkysirvAirportPressureResponse,
  type SkysirvLiveAircraft,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"
import SkysirvLiveAircraftList from "@/components/skysirv-live/SkysirvLiveAircraftList"
import SkysirvLiveAircraftMarker from "@/components/skysirv-live/SkysirvLiveAircraftMarker"
import SkysirvLiveAirportMarker from "@/components/skysirv-live/SkysirvLiveAirportMarker"
import SkysirvLiveAirportList, {
  type AirportTypeFilter,
} from "@/components/skysirv-live/SkysirvLiveAirportList"
import SkysirvLiveHeader, {
  type SkysirvLiveMode,
} from "@/components/skysirv-live/SkysirvLiveHeader"
import SkysirvLiveLucyRead from "@/components/skysirv-live/SkysirvLiveLucyRead"
import SkysirvLiveBottomNav from "@/components/skysirv-live/SkysirvLiveBottomNav"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const MAP_STYLES = {
  standard: "mapbox://styles/mapbox/standard",
  satellite: "mapbox://styles/mapbox/standard-satellite",
} as const

type MapStyleKey = keyof typeof MAP_STYLES

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

const LIVE_AIRCRAFT_REFRESH_MS = 180_000
const LIVE_AIRCRAFT_MAX_AIRCRAFT = 10

type RegionKey =
  | "all"
  | "north-america"
  | "europe"
  | "asia"
  | "africa"
  | "south-america"
  | "middle-east"
  | "pacific"

type SkysirvLiveAircraftErrorResponse = {
  ok: false
  error: string
  providerCode?: string | null
  providerMessage?: string | null
  aircraft: []
}

type SkysirvLiveAircraftApiAircraft = {
  id: string
  flightId: string
  callsign: string
  flightNumber?: string
  tailNumber?: string | null
  latitude: number
  longitude: number
  heading?: number | null
  speedMph?: number | null
  altitudeFeet?: number | null
  observedAt?: string | null
  source: "Cirium"
  carrierFsCode?: string | null
  airlineName?: string | null
  aircraftType?: string | null
  equipmentCode?: string | null
  originCode?: string | null
  originName?: string | null
  originCity?: string | null
  originCountry?: string | null
  destinationCode?: string | null
  destinationName?: string | null
  destinationCity?: string | null
  destinationCountry?: string | null
  departureDateUtc?: string | null
  departureDateLocal?: string | null
  delayMinutes?: number | null
  routeProgressPercent?: number | null
}

type SkysirvLiveAircraftRegionResponse = {
  ok: true
  source: "Cirium"
  mode?: "positions" | "enriched"
  observedAt: string
  regionKey?: string
  cacheTtlSeconds?: number
  aircraft: SkysirvLiveAircraftApiAircraft[]
}

function formatAircraftLocalTime(value: string | null) {
  if (!value) return "Not available"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Not available"

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

function getAircraftStatusFromAltitude(
  altitudeFeet: number,
): SkysirvLiveAircraft["status"] {
  if (altitudeFeet < 2500) return "approaching"
  if (altitudeFeet < 10000) return "climbing"
  if (altitudeFeet > 28000) return "cruising"

  return "airborne"
}

function normalizeLiveAircraftPosition(
  aircraft: SkysirvLiveAircraftApiAircraft,
): SkysirvLiveAircraft {
  const altitudeFeet = aircraft.altitudeFeet ?? 0
  const speedMph = aircraft.speedMph ?? 0
  const groundSpeedKnots = Math.round(speedMph * 0.868976)
  const routeProgressPercent =
    typeof aircraft.routeProgressPercent === "number"
      ? aircraft.routeProgressPercent
      : 0

  return {
    id: aircraft.id,
    flightNumber: aircraft.flightNumber ?? aircraft.callsign ?? aircraft.flightId,
    airlineName: aircraft.airlineName ?? "Loading flight details",
    aircraftType: aircraft.aircraftType ?? "Aircraft",
    registration:
      aircraft.tailNumber ??
      aircraft.callsign ??
      aircraft.flightNumber ??
      aircraft.flightId,
    latitude: aircraft.latitude,
    longitude: aircraft.longitude,
    heading: aircraft.heading ?? 0,
    altitudeFeet,
    groundSpeedKnots,
    originCode: aircraft.originCode ?? "—",
    originCity: aircraft.originCity ?? "Loading",
    destinationCode: aircraft.destinationCode ?? "—",
    destinationCity: aircraft.destinationCity ?? "Loading",
    scheduledDepartureLocal: formatAircraftLocalTime(
      aircraft.departureDateLocal ?? null,
    ),
    scheduledArrivalLocal: "Not available",
    estimatedArrivalLocal: "Not available",
    delayMinutes: aircraft.delayMinutes ?? 0,
    routeProgressPercent,
    status: getAircraftStatusFromAltitude(altitudeFeet),
    source: "provider",
  }
}

const regionViewStates: Record<
  RegionKey,
  {
    longitude: number
    latitude: number
    zoom: number
  }
> = {
  all: {
    longitude: 20,
    latitude: 22,
    zoom: 1.35,
  },
  "north-america": {
    longitude: -96,
    latitude: 38.5,
    zoom: 3.15,
  },
  europe: {
    longitude: 13,
    latitude: 50,
    zoom: 3.35,
  },
  asia: {
    longitude: 95,
    latitude: 34,
    zoom: 2.8,
  },
  africa: {
    longitude: 20,
    latitude: 2,
    zoom: 2.8,
  },
  "south-america": {
    longitude: -60,
    latitude: -15,
    zoom: 2.8,
  },
  "middle-east": {
    longitude: 45,
    latitude: 27,
    zoom: 3.6,
  },
  pacific: {
    longitude: 145,
    latitude: -18,
    zoom: 3,
  },
}

const DEFAULT_REGION_KEY: RegionKey = "north-america"
const MOBILE_DEFAULT_REGION_ZOOM = 1.75

const mobileRegionZoomOverrides: Record<RegionKey, number> = {
  all: 1.05,
  "north-america": MOBILE_DEFAULT_REGION_ZOOM,
  europe: 2.45,
  asia: 2.05,
  africa: 2.1,
  "south-america": 2.05,
  "middle-east": 2.65,
  pacific: 2.05,
}

const GLOBAL_MAJOR_PRIORITY_ZOOM_THRESHOLD = 4.25
const REGIONAL_AIRPORT_MARKER_ZOOM_THRESHOLD = 5.35
const EXECUTIVE_AIRPORT_MARKER_ZOOM_THRESHOLD = 7.25

const regionCountryGroups: Record<RegionKey, string[]> = {
  all: [],
  "north-america": [
    "United States",
    "Canada",
    "Mexico",
    "Guatemala",
    "Panama",
    "El Salvador",
    "Costa Rica",
  ],
  europe: [
    "Austria",
    "Belgium",
    "Denmark",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Ireland",
    "Italy",
    "Netherlands",
    "Norway",
    "Portugal",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "United Kingdom",
  ],
  asia: [
    "China",
    "Hong Kong",
    "India",
    "Indonesia",
    "Japan",
    "Malaysia",
    "Philippines",
    "Singapore",
    "South Korea",
    "Taiwan",
    "Thailand",
  ],
  africa: ["Egypt", "Morocco", "South Africa"],
  "south-america": [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Peru",
  ],
  "middle-east": ["Qatar", "Saudi Arabia", "United Arab Emirates"],
  pacific: ["Australia", "New Zealand"],
}

const regionDetectionOrder: RegionKey[] = [
  "north-america",
  "europe",
  "asia",
  "africa",
  "south-america",
  "middle-east",
  "pacific",
]

function isRegionKey(value: string): value is RegionKey {
  return value in regionViewStates
}

function isAirportInRegion(airport: SkysirvLiveAirport, regionKey: RegionKey) {
  if (regionKey === "all") return true

  const countries = regionCountryGroups[regionKey]

  return countries.includes(airport.country)
}

function isAirportVisibleAtZoom(airport: SkysirvLiveAirport, zoom: number) {
  const airportType = airport.airportType ?? "major"
  const priorityRank = airport.priorityRank ?? 99

  if (airport.severity !== "normal") return true

  if (airportType === "executive") {
    return zoom >= EXECUTIVE_AIRPORT_MARKER_ZOOM_THRESHOLD
  }

  if (
    airportType === "regional" ||
    airportType === "cargo" ||
    airportType === "reliever"
  ) {
    return zoom >= REGIONAL_AIRPORT_MARKER_ZOOM_THRESHOLD
  }

  if (zoom < GLOBAL_MAJOR_PRIORITY_ZOOM_THRESHOLD) {
    return priorityRank <= 2
  }

  return true
}

function getRegionKeyForAirport(airport: SkysirvLiveAirport) {
  return (
    regionDetectionOrder.find((regionKey) =>
      regionCountryGroups[regionKey].includes(airport.country),
    ) ?? null
  )
}

function getDominantRegionFromAirports(airportsInView: SkysirvLiveAirport[]) {
  const regionCounts = new globalThis.Map<RegionKey, number>()

  airportsInView.forEach((airport) => {
    const regionKey = getRegionKeyForAirport(airport)

    if (!regionKey) return

    regionCounts.set(regionKey, (regionCounts.get(regionKey) ?? 0) + 1)
  })

  const rankedRegions = Array.from(regionCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  )

  return rankedRegions[0]?.[0] ?? null
}

function getRegionKeyFromMapCenter(
  longitude: number,
  latitude: number,
): RegionKey {
  if (
    latitude >= -50 &&
    latitude <= 5 &&
    ((longitude >= 110 && longitude <= 180) ||
      (longitude >= -180 && longitude <= -130))
  ) {
    return "pacific"
  }

  if (
    latitude >= -58 &&
    latitude <= 15 &&
    longitude >= -90 &&
    longitude <= -30
  ) {
    return "south-america"
  }

  if (
    latitude >= 12 &&
    latitude <= 42 &&
    longitude >= 34 &&
    longitude <= 65
  ) {
    return "middle-east"
  }

  if (
    latitude >= -38 &&
    latitude <= 38 &&
    longitude >= -20 &&
    longitude <= 55
  ) {
    return "africa"
  }

  if (
    latitude >= 34 &&
    latitude <= 72 &&
    longitude >= -25 &&
    longitude <= 45
  ) {
    return "europe"
  }

  if (
    latitude >= -10 &&
    latitude <= 60 &&
    longitude >= 65 &&
    longitude <= 150
  ) {
    return "asia"
  }

  if (
    latitude >= 5 &&
    latitude <= 85 &&
    longitude >= -170 &&
    longitude <= -50
  ) {
    return "north-america"
  }

  return "all"
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768
}

function getRegionZoomForViewport(regionKey: RegionKey) {
  if (isMobileViewport()) {
    return mobileRegionZoomOverrides[regionKey] ?? MOBILE_DEFAULT_REGION_ZOOM
  }

  return regionViewStates[regionKey]?.zoom ?? regionViewStates[DEFAULT_REGION_KEY].zoom
}

export default function SkysirvLivePage() {
  const mapRef = useRef<MapRef | null>(null)
  const aircraftOverviewViewRef = useRef<{
    longitude: number
    latitude: number
    zoom: number
  } | null>(null)
  const liveAircraftRequestIdRef = useRef(0)

  const [activeRegion, setActiveRegion] =
    useState<RegionKey>(DEFAULT_REGION_KEY)
  const [activeLiveMode, setActiveLiveMode] =
    useState<SkysirvLiveMode>("disruptions")
  const [activeAirportTypeFilters, setActiveAirportTypeFilters] = useState<
    AirportTypeFilter[]
  >(["major", "regional"])
  const [liveAirports, setLiveAirports] =
    useState<SkysirvLiveAirport[]>(airports)
  const [liveAircraft, setLiveAircraft] = useState<SkysirvLiveAircraft[]>([])
  const [liveAircraftError, setLiveAircraftError] = useState<string | null>(null)
  const [liveAircraftObservedAt, setLiveAircraftObservedAt] = useState<
    string | undefined
  >()
  const [faaObservedAt, setFaaObservedAt] = useState<string | undefined>()
  const [mapStyleKey, setMapStyleKey] = useState<MapStyleKey>("standard")
  const [isMobileMapViewport, setIsMobileMapViewport] = useState(false)
  const [
    isMobileDisruptionsDrawerExpanded,
    setIsMobileDisruptionsDrawerExpanded,
  ] = useState(true)
  const [currentZoom, setCurrentZoom] = useState(() =>
    getRegionZoomForViewport(DEFAULT_REGION_KEY),
  )
  const [visibleAirportCodes, setVisibleAirportCodes] = useState<string[] | null>(
    null,
  )
  const [selectedAirportCode, setSelectedAirportCode] = useState<string | null>(
    null,
  )
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | null>(
    null,
  )
  const [activeAircraftView, setActiveAircraftView] = useState<
    | "overview"
    | "origin"
    | "destination"
    | "schedule"
    | "duration"
    | "delay-risk"
    | "route"
  >("overview")

  const clearLiveAircraftState = useCallback(() => {
    liveAircraftRequestIdRef.current += 1
    setLiveAircraft([])
    setLiveAircraftObservedAt(undefined)
    setLiveAircraftError(null)
  }, [])

  const loadSkysirvLiveAircraftFromRegion = useCallback(
    async (regionKey: RegionKey) => {
      const requestId = liveAircraftRequestIdRef.current + 1
      liveAircraftRequestIdRef.current = requestId

      async function fetchAircraftLayer(mode: "positions" | "enriched") {
        const params = new URLSearchParams({
          maxAircraft: String(LIVE_AIRCRAFT_MAX_AIRCRAFT),
        })

        const response = await fetch(
          `${API_BASE_URL}/api/skysirv-live/aircraft/regions/${regionKey}/${mode}?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        )

        const data = (await response.json()) as
          | SkysirvLiveAircraftRegionResponse
          | SkysirvLiveAircraftErrorResponse

        if (!response.ok || !data.ok) {
          const providerCode = !data.ok ? data.providerCode : null
          const errorMessage =
            !data.ok ? data.error : "Live aircraft is temporarily unavailable."

          throw new Error(
            providerCode === "quota_exceeded"
              ? "Live aircraft is temporarily unavailable because the Cirium aircraft quota has been reached."
              : errorMessage || "Live aircraft is temporarily unavailable.",
          )
        }

        return data
      }

      try {
        setLiveAircraftError(null)

        const positionsData = await fetchAircraftLayer("positions")

        if (liveAircraftRequestIdRef.current !== requestId) return

        const positionAircraft = (positionsData.aircraft ?? [])
          .filter(
            (aircraft) =>
              typeof aircraft.latitude === "number" &&
              typeof aircraft.longitude === "number",
          )
          .map((aircraft) => normalizeLiveAircraftPosition(aircraft))

        setLiveAircraft(positionAircraft)
        setLiveAircraftObservedAt(positionsData.observedAt)

        const enrichedData = await fetchAircraftLayer("enriched")

        if (liveAircraftRequestIdRef.current !== requestId) return

        const enrichedAircraft = (enrichedData.aircraft ?? [])
          .filter(
            (aircraft) =>
              typeof aircraft.latitude === "number" &&
              typeof aircraft.longitude === "number",
          )
          .map((aircraft) => normalizeLiveAircraftPosition(aircraft))

        if (enrichedAircraft.length > 0) {
          setLiveAircraft(enrichedAircraft)
          setLiveAircraftObservedAt(enrichedData.observedAt)
        }

        setLiveAircraftError(null)
      } catch (error) {
        console.error("Failed to load Skysirv Live regional aircraft", error)

        if (liveAircraftRequestIdRef.current === requestId) {
          setLiveAircraftError(
            error instanceof Error
              ? error.message
              : "Live aircraft is temporarily unavailable.",
          )
        }
      }
    },
    [],
  )

  const updateVisibleAirports = useCallback(() => {
    const map = mapRef.current?.getMap()

    if (!map) return

    setCurrentZoom(map.getZoom())

    const bounds = map.getBounds()

    if (!bounds) return

    const nextVisibleAirports = liveAirports.filter((airport) =>
      bounds.contains({
        lng: airport.longitude,
        lat: airport.latitude,
      }),
    )

    setVisibleAirportCodes(nextVisibleAirports.map((airport) => airport.code))

    const center = map.getCenter()
    const nextRegion =
      getDominantRegionFromAirports(nextVisibleAirports) ??
      getRegionKeyFromMapCenter(center.lng, center.lat)

    setActiveRegion(nextRegion)
  }, [liveAirports])

  function handleMapMoveEnd() {
    const map = mapRef.current?.getMap()

    if (!map) return

    setCurrentZoom(map.getZoom())

    if (activeLiveMode === "aircraft") {
      const center = map.getCenter()
      const nextRegion = getRegionKeyFromMapCenter(center.lng, center.lat)

      if (nextRegion !== activeRegion) {
        setActiveRegion(nextRegion)
        setSelectedAircraftId(null)
        setActiveAircraftView("overview")
        setVisibleAirportCodes(null)
        aircraftOverviewViewRef.current = null
        clearLiveAircraftState()
      }

      return
    }

    updateVisibleAirports()
  }

  function handleAirportSelect(airport: SkysirvLiveAirport) {
    setSelectedAirportCode(airport.code)
    setCurrentZoom(8.25)

    mapRef.current?.flyTo({
      center: [airport.longitude, airport.latitude],
      zoom: 8.25,
      duration: 900,
      essential: true,
    })
  }

  function handleAircraftSelect(aircraft: SkysirvLiveAircraft) {
    const map = mapRef.current?.getMap()

    if (map && !selectedAircraftId) {
      const center = map.getCenter()

      aircraftOverviewViewRef.current = {
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
      }
    }

    setSelectedAircraftId(aircraft.id)
    setActiveAircraftView("overview")
    setCurrentZoom(5.6)

    mapRef.current?.flyTo({
      center: [aircraft.longitude, aircraft.latitude],
      zoom: 5.6,
      duration: 900,
      essential: true,
    })
  }

  function handleAircraftBackToLive() {
    const savedView = aircraftOverviewViewRef.current
    const fallbackViewState =
      regionViewStates[activeRegion] ?? regionViewStates[DEFAULT_REGION_KEY]
    const fallbackZoom = getRegionZoomForViewport(activeRegion)

    setSelectedAircraftId(null)
    setActiveAircraftView("overview")

    mapRef.current?.flyTo({
      center: [
        savedView?.longitude ?? fallbackViewState.longitude,
        savedView?.latitude ?? fallbackViewState.latitude,
      ],
      zoom: savedView?.zoom ?? fallbackZoom,
      duration: 900,
      essential: true,
    })

    aircraftOverviewViewRef.current = null
  }

  function handleAirportTypeFilterToggle(
    airportTypeFilter: AirportTypeFilter,
  ) {
    setActiveAirportTypeFilters((currentFilters) => {
      const filterIsActive = currentFilters.includes(airportTypeFilter)

      if (filterIsActive && currentFilters.length === 1) {
        return currentFilters
      }

      if (filterIsActive) {
        return currentFilters.filter((filter) => filter !== airportTypeFilter)
      }

      return [...currentFilters, airportTypeFilter]
    })
  }

  function handleRegionSelect(regionKey: string) {
    if (!isRegionKey(regionKey)) return

    const nextViewState = regionViewStates[regionKey]
    const nextZoom = getRegionZoomForViewport(regionKey)

    setActiveRegion(regionKey)
    setSelectedAirportCode(null)
    setSelectedAircraftId(null)
    setActiveAircraftView("overview")
    setVisibleAirportCodes(null)
    setCurrentZoom(nextZoom)
    aircraftOverviewViewRef.current = null

    if (activeLiveMode === "aircraft") {
      clearLiveAircraftState()
    }

    mapRef.current?.flyTo({
      center: [nextViewState.longitude, nextViewState.latitude],
      zoom: nextZoom,
      duration: 950,
      essential: true,
    })
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")

    function updateMobileViewport() {
      setIsMobileMapViewport(mediaQuery.matches)
    }

    updateMobileViewport()

    mediaQuery.addEventListener("change", updateMobileViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateMobileViewport)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadSkysirvAirportPressure() {
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
          throw new Error(
            `Skysirv airport pressure request failed with ${response.status}`,
          )
        }

        const data = (await response.json()) as SkysirvAirportPressureResponse

        if (!isMounted || !data.ok) return

        const mergedAirports = mergeAirportPressureWithAirports(
          airports,
          data.airports ?? [],
          data.observedAt,
        )

        setFaaObservedAt(data.observedAt)
        setLiveAirports(mergedAirports)
      } catch (error) {
        console.error("Failed to load Skysirv Live airport pressure", error)

        if (isMounted) {
          setLiveAirports(airports)
        }
      }
    }

    loadSkysirvAirportPressure()

    const intervalId = window.setInterval(loadSkysirvAirportPressure, 60_000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    setSelectedAirportCode(null)
    setSelectedAircraftId(null)
    setActiveAircraftView("overview")
    aircraftOverviewViewRef.current = null

    if (activeLiveMode === "aircraft") {
      setVisibleAirportCodes(null)
      clearLiveAircraftState()
    } else {
      clearLiveAircraftState()
    }
  }, [activeLiveMode, clearLiveAircraftState])

  useEffect(() => {
    if (activeLiveMode !== "aircraft" || selectedAircraftId) return

    void loadSkysirvLiveAircraftFromRegion(activeRegion)

    const intervalId = window.setInterval(
      () => void loadSkysirvLiveAircraftFromRegion(activeRegion),
      LIVE_AIRCRAFT_REFRESH_MS,
    )

    return () => {
      window.clearInterval(intervalId)
    }
  }, [
    activeLiveMode,
    activeRegion,
    loadSkysirvLiveAircraftFromRegion,
    selectedAircraftId,
  ])

  const visibleAirportCodeSet = useMemo(() => {
    if (!visibleAirportCodes) return null

    return new Set(visibleAirportCodes)
  }, [visibleAirportCodes])

  const airportDisplayPool = useMemo(() => {
    const visibleOrRegionPool = visibleAirportCodeSet
      ? liveAirports.filter((airport) => visibleAirportCodeSet.has(airport.code))
      : liveAirports.filter((airport) =>
        isAirportInRegion(airport, activeRegion),
      )

    const airportTypeFilteredPool = visibleOrRegionPool.filter((airport) => {
      const airportType = airport.airportType ?? "major"

      if (airportType === "major") {
        return activeAirportTypeFilters.includes("major")
      }

      if (airportType === "regional") {
        return activeAirportTypeFilters.includes("regional")
      }

      return false
    })

    return airportTypeFilteredPool.filter((airport) =>
      isAirportVisibleAtZoom(airport, currentZoom),
    )
  }, [
    activeAirportTypeFilters,
    activeRegion,
    currentZoom,
    liveAirports,
    visibleAirportCodeSet,
  ])

  const mapAirports = useMemo(() => {
    const disruptedAirports = airportDisplayPool.filter(
      (airport) => airport.severity !== "normal",
    )

    if (!selectedAirportCode) {
      return disruptedAirports
    }

    const selectedAirport = liveAirports.find(
      (airport) => airport.code === selectedAirportCode,
    )

    if (!selectedAirport) {
      return disruptedAirports
    }

    if (
      disruptedAirports.some((airport) => airport.code === selectedAirport.code)
    ) {
      return disruptedAirports
    }

    return [...disruptedAirports, selectedAirport]
  }, [airportDisplayPool, liveAirports, selectedAirportCode])

  const aircraftDisplayPool = useMemo(() => {
    return liveAircraft
  }, [liveAircraft])

  const mapAircraft = useMemo(() => {
    if (!selectedAircraftId) return aircraftDisplayPool

    const selectedAircraft = liveAircraft.find(
      (aircraft) => aircraft.id === selectedAircraftId,
    )

    return selectedAircraft ? [selectedAircraft] : aircraftDisplayPool
  }, [aircraftDisplayPool, liveAircraft, selectedAircraftId])

  const sortedAirports = useMemo(() => {
    const disruptedAirports = airportDisplayPool.filter(
      (airport) => airport.severity !== "normal",
    )

    const airportPool =
      disruptedAirports.length > 0 ? disruptedAirports : airportDisplayPool

    return [...airportPool].sort((a, b) => {
      const severityDifference =
        getAirportSeverityRank(a.severity) - getAirportSeverityRank(b.severity)

      if (severityDifference !== 0) {
        return severityDifference
      }

      const pressureDifference =
        getAirportPressureScore(b) - getAirportPressureScore(a)

      if (pressureDifference !== 0) {
        return pressureDifference
      }

      const priorityDifference =
        (a.priorityRank ?? 99) - (b.priorityRank ?? 99)

      if (priorityDifference !== 0) {
        return priorityDifference
      }

      return a.code.localeCompare(b.code)
    })
  }, [airportDisplayPool])

  const initialViewState = useMemo(
    () => ({
      ...regionViewStates[DEFAULT_REGION_KEY],
      zoom: getRegionZoomForViewport(DEFAULT_REGION_KEY),
    }),
    [],
  )

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden overscroll-none bg-slate-100 text-slate-950">
      <style jsx global>{`
        @media (max-width: 767px) {
          .skysirv-live-map-shell .mapboxgl-ctrl-top-left {
            top: 60px !important;
            left: 10px !important;
          }

          .skysirv-live-map-shell .mapboxgl-ctrl-logo,
          .skysirv-live-map-shell .mapboxgl-ctrl-attrib,
          .skysirv-live-map-shell .mapboxgl-ctrl-attrib-inner {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        }
      `}</style>

      <div
        className={`skysirv-live-map-shell absolute inset-x-0 top-0 bottom-[56px] ${activeLiveMode === "disruptions"
          ? "skysirv-live-map-shell--mobile-disruptions"
          : ""
          }`}
      >
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={() => {
            updateVisibleAirports()

            const map = mapRef.current?.getMap()

            if (!map) return

            if (!map.getSource("mapbox-dem")) {
              map.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14,
              })
            }

            map.setTerrain({
              source: "mapbox-dem",
              exaggeration: 1.35,
            })
          }}
          onMoveEnd={handleMapMoveEnd}
          initialViewState={{
            longitude: initialViewState.longitude,
            latitude: initialViewState.latitude,
            zoom: initialViewState.zoom,
          }}
          mapStyle={MAP_STYLES[mapStyleKey]}
          projection="mercator"
          attributionControl={!isMobileMapViewport}
          reuseMaps
          style={{ height: "100%", width: "100%" }}
        >
          {isMobileMapViewport ? (
            <NavigationControl position="top-left" />
          ) : (
            <NavigationControl position="bottom-right" />
          )}

          {activeLiveMode === "disruptions" &&
            mapAirports.map((airport) => (
              <SkysirvLiveAirportMarker key={airport.code} airport={airport} />
            ))}

          {activeLiveMode === "aircraft" &&
            mapAircraft.map((aircraft) => (
              <SkysirvLiveAircraftMarker
                key={aircraft.id}
                aircraft={aircraft}
                isSelected={selectedAircraftId === aircraft.id}
              />
            ))}
        </Map>
      </div>

      <SkysirvLiveHeader
        activeLiveMode={activeLiveMode}
        onLiveModeChange={setActiveLiveMode}
        overviewBackLabel={
          activeLiveMode === "aircraft" && selectedAircraftId
            ? "Live"
            : undefined
        }
        onOverviewBackClick={
          activeLiveMode === "aircraft" && selectedAircraftId
            ? handleAircraftBackToLive
            : undefined
        }
        lastUpdatedAt={
          activeLiveMode === "aircraft" ? liveAircraftObservedAt : faaObservedAt
        }
      />

      <div className="pointer-events-auto absolute bottom-[84px] right-[58px] z-30 hidden overflow-hidden rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-[0_14px_40px_rgba(15,23,42,0.16)] backdrop-blur-xl md:flex">
        {(["standard", "satellite"] as MapStyleKey[]).map((styleKey) => {
          const isActive = mapStyleKey === styleKey

          return (
            <button
              key={styleKey}
              type="button"
              onClick={() => setMapStyleKey(styleKey)}
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

      {activeLiveMode === "disruptions" && (
        <SkysirvLiveAirportList
          airports={sortedAirports}
          activeRegion={activeRegion}
          onAirportSelect={handleAirportSelect}
          onRegionSelect={handleRegionSelect}
          activeAirportTypeFilters={activeAirportTypeFilters}
          onAirportTypeFilterToggle={handleAirportTypeFilterToggle}
          mobileDrawerExpanded={isMobileDisruptionsDrawerExpanded}
          onMobileDrawerExpandedChange={setIsMobileDisruptionsDrawerExpanded}
        />
      )}

      {activeLiveMode === "aircraft" && (
        <SkysirvLiveAircraftList
          aircraft={aircraftDisplayPool}
          aircraftErrorMessage={liveAircraftError}
          selectedAircraftId={selectedAircraftId}
          activeAircraftView={activeAircraftView}
          activeRegion={activeRegion}
          onAircraftSelect={handleAircraftSelect}
          onRegionSelect={handleRegionSelect}
          onAircraftViewSelect={setActiveAircraftView}
        />
      )}

      <SkysirvLiveLucyRead
        airports={sortedAirports}
        aircraft={aircraftDisplayPool}
        activeRegion={activeRegion}
        activeLiveMode={activeLiveMode}
        lastUpdatedAt={
          activeLiveMode === "aircraft" ? liveAircraftObservedAt : faaObservedAt
        }
      />

      <div className="hidden md:block">
        {activeLiveMode === "aircraft" && selectedAircraftId ? (
          <SkysirvLiveBottomNav
            mode="aircraft"
            activeKey={activeAircraftView}
            onAircraftViewSelect={setActiveAircraftView}
          />
        ) : (
          <SkysirvLiveBottomNav
            mode="regions"
            activeKey={activeRegion}
            onRegionSelect={handleRegionSelect}
          />
        )}
      </div>
    </main>
  )
}