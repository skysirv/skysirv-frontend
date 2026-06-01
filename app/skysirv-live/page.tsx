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
    longitude: -35,
    latitude: 28,
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

const activeCatalogRegions = new Set(["all", "north-america"])
const REGIONAL_AIRPORT_CARD_ZOOM_THRESHOLD = 5.25

export default function SkysirvLivePage() {
  const mapRef = useRef<MapRef | null>(null)
  const suppressNextVisibleUpdateRef = useRef(false)
  const [activeRegion, setActiveRegion] = useState("north-america")
  const [liveAirports, setLiveAirports] =
    useState<SkysirvLiveAirport[]>(airports)
  const [faaObservedAt, setFaaObservedAt] = useState<string | undefined>()

  const [currentZoom, setCurrentZoom] = useState(
    regionViewStates["north-america"].zoom,
  )

  const [visibleAirportCodes, setVisibleAirportCodes] = useState<string[] | null>(
    null
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
          throw new Error(`Skysirv airport pressure request failed with ${response.status}`)
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

  const mapAirports = useMemo(() => {
    if (!activeCatalogRegions.has(activeRegion)) return []

    const isZoomedIn =
      currentZoom >= REGIONAL_AIRPORT_CARD_ZOOM_THRESHOLD

    if (!isZoomedIn) {
      return liveAirports.filter((airport) => airport.severity !== "normal")
    }

    if (!visibleAirportCodes) {
      return liveAirports.filter((airport) => airport.severity !== "normal")
    }

    return liveAirports.filter((airport) =>
      visibleAirportCodes.includes(airport.code),
    )
  }, [activeRegion, currentZoom, liveAirports, visibleAirportCodes])

  function updateVisibleAirports() {
    if (suppressNextVisibleUpdateRef.current) {
      suppressNextVisibleUpdateRef.current = false
    }

    const map = mapRef.current?.getMap()

    if (!map) return

    setCurrentZoom(map.getZoom())

    const bounds = map.getBounds()

    if (!bounds) return

    const nextVisibleCodes = liveAirports
      .filter((airport) =>
        bounds.contains({
          lng: airport.longitude,
          lat: airport.latitude,
        })
      )
      .map((airport) => airport.code)

    setVisibleAirportCodes(nextVisibleCodes)
  }

  function handleAirportSelect(airport: SkysirvLiveAirport) {
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
    const regionPool = activeCatalogRegions.has(activeRegion) ? liveAirports : []

    const isZoomedIn =
      currentZoom >= REGIONAL_AIRPORT_CARD_ZOOM_THRESHOLD

    const airportTypePool = isZoomedIn
      ? regionPool
      : regionPool.filter((airport) => airport.airportType === "major")

    const airportPool =
      isZoomedIn && visibleAirportCodes
        ? airportTypePool.filter((airport) =>
          visibleAirportCodes.includes(airport.code),
        )
        : airportTypePool

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
  }, [activeRegion, currentZoom, liveAirports, visibleAirportCodes])

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden overscroll-none bg-slate-100 text-slate-950">
      <div className="absolute inset-x-0 top-0 bottom-[56px]">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          onLoad={updateVisibleAirports}
          onMoveEnd={updateVisibleAirports}
          initialViewState={{
            longitude: -96,
            latitude: 38.5,
            zoom: 3.15,
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

      <SkysirvLiveLucyRead />

      <SkysirvLiveBottomNav
        mode="regions"
        activeKey={activeRegion}
        onRegionSelect={handleRegionSelect}
      />
    </main>
  )
}