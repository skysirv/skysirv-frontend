"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Map, { NavigationControl, type MapRef } from "react-map-gl/mapbox"
import {
  airports,
  getAirportPressureScore,
  getAirportSeverityRank,
  mergeAirportPressureWithAirports,
  type SkysirvAirportPressureResponse,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"
import SkysirvLiveAirportMarker from "@/components/skysirv-live/SkysirvLiveAirportMarker"
import SkysirvLiveAirportList from "@/components/skysirv-live/SkysirvLiveAirportList"
import SkysirvLiveHeader from "@/components/skysirv-live/SkysirvLiveHeader"
import SkysirvLiveLucyRead from "@/components/skysirv-live/SkysirvLiveLucyRead"
import SkysirvLiveBottomNav from "@/components/skysirv-live/SkysirvLiveBottomNav"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"

const regionViewStates: Record<
  string,
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

const DEFAULT_REGION_KEY = "north-america"
const GLOBAL_MAJOR_PRIORITY_ZOOM_THRESHOLD = 4.25
const REGIONAL_AIRPORT_MARKER_ZOOM_THRESHOLD = 5.35
const EXECUTIVE_AIRPORT_MARKER_ZOOM_THRESHOLD = 7.25

const regionCountryGroups: Record<string, string[]> = {
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
  africa: [
    "Egypt",
    "Morocco",
    "South Africa",
  ],
  "south-america": [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Peru",
  ],
  "middle-east": [
    "Qatar",
    "Saudi Arabia",
    "United Arab Emirates",
  ],
  pacific: [
    "Australia",
    "New Zealand",
  ],
}

function isAirportInRegion(
  airport: SkysirvLiveAirport,
  regionKey: string,
) {
  if (regionKey === "all") return true

  const countries = regionCountryGroups[regionKey]

  if (!countries) return true

  return countries.includes(airport.country)
}

function isAirportVisibleAtZoom(
  airport: SkysirvLiveAirport,
  zoom: number,
) {
  const airportType = airport.airportType ?? "major"
  const priorityRank = airport.priorityRank ?? 99

  if (airport.severity !== "normal") {
    return true
  }

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

const regionDetectionOrder = [
  "north-america",
  "europe",
  "asia",
  "africa",
  "south-america",
  "middle-east",
  "pacific",
]

function getRegionKeyForAirport(airport: SkysirvLiveAirport) {
  return (
    regionDetectionOrder.find((regionKey) =>
      regionCountryGroups[regionKey]?.includes(airport.country),
    ) ?? null
  )
}

function getDominantRegionFromAirports(airportsInView: SkysirvLiveAirport[]) {
  const regionCounts = new globalThis.Map<string, number>()

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

function getRegionKeyFromMapCenter(longitude: number, latitude: number) {
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

export default function SkysirvLivePage() {
  const mapRef = useRef<MapRef | null>(null)
  const suppressNextVisibleUpdateRef = useRef(false)
  const [activeRegion, setActiveRegion] = useState(DEFAULT_REGION_KEY)
  const [liveAirports, setLiveAirports] =
    useState<SkysirvLiveAirport[]>(airports)
  const [faaObservedAt, setFaaObservedAt] = useState<string | undefined>()

  const [currentZoom, setCurrentZoom] = useState(
    regionViewStates[DEFAULT_REGION_KEY].zoom,
  )

  const [visibleAirportCodes, setVisibleAirportCodes] = useState<string[] | null>(
    null,
  )

  const [selectedAirportCode, setSelectedAirportCode] = useState<string | null>(
    null,
  )

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

    return visibleOrRegionPool.filter((airport) =>
      isAirportVisibleAtZoom(airport, currentZoom),
    )
  }, [activeRegion, currentZoom, liveAirports, visibleAirportCodeSet])

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

  function updateVisibleAirports() {
    if (suppressNextVisibleUpdateRef.current) {
      suppressNextVisibleUpdateRef.current = false
    }

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

    const nextVisibleCodes = nextVisibleAirports.map((airport) => airport.code)

    setVisibleAirportCodes(nextVisibleCodes)

    const center = map.getCenter()

    const nextRegion =
      getDominantRegionFromAirports(nextVisibleAirports) ??
      getRegionKeyFromMapCenter(center.lng, center.lat)

    setActiveRegion(nextRegion)
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

  function handleRegionSelect(regionKey: string) {
    const nextViewState = regionViewStates[regionKey]

    if (!nextViewState) return

    setActiveRegion(regionKey)
    suppressNextVisibleUpdateRef.current = false
    setSelectedAirportCode(null)
    setCurrentZoom(nextViewState.zoom)
    setVisibleAirportCodes(null)

    mapRef.current?.flyTo({
      center: [nextViewState.longitude, nextViewState.latitude],
      zoom: nextViewState.zoom,
      duration: 950,
      essential: true,
    })
  }

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

  const initialViewState = regionViewStates[DEFAULT_REGION_KEY]

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden overscroll-none bg-slate-100 text-slate-950">
      <div className="absolute inset-x-0 top-0 bottom-[56px]">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={updateVisibleAirports}
          onMoveEnd={updateVisibleAirports}
          initialViewState={{
            longitude: initialViewState.longitude,
            latitude: initialViewState.latitude,
            zoom: initialViewState.zoom,
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          projection="mercator"
          attributionControl
          reuseMaps
          style={{ height: "100%", width: "100%" }}
        >
          <NavigationControl position="bottom-right" />

          {mapAirports.map((airport) => (
            <SkysirvLiveAirportMarker key={airport.code} airport={airport} />
          ))}
        </Map>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[56px] bg-gradient-to-r from-white/75 via-white/20 to-transparent" />

      <SkysirvLiveHeader lastUpdatedAt={faaObservedAt} />

      <SkysirvLiveAirportList
        airports={sortedAirports}
        onAirportSelect={handleAirportSelect}
      />

      <SkysirvLiveLucyRead
        airports={sortedAirports}
        activeRegion={activeRegion}
        lastUpdatedAt={faaObservedAt}
      />

      <SkysirvLiveBottomNav
        mode="regions"
        activeKey={activeRegion}
        onRegionSelect={handleRegionSelect}
      />
    </main>
  )
}