"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import type { AirportOption } from "@/lib/airports/major-airports"
import type {
  AirportSearchResult,
  MapViewStyle,
} from "@/components/dashboard/airport-explorer/airportExplorerTypes"
import {
  addIndoorAirportLayers,
  addIndoorControlIfAvailable,
  buildApiUrl,
  enableMapboxIndoorMapping,
  getAirportResultTypeLabel,
  MAP_2D_CAMERA,
  MAP_3D_CAMERA,
  MAPBOX_STYLES,
} from "@/components/dashboard/airport-explorer/airportExplorerUtils"

type AirportExplorerModalProps = {
  open: boolean
  airport: AirportOption | null
  onClose: () => void
}

export default function AirportExplorerModal({
  open,
  airport,
  onClose,
}: AirportExplorerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const indoorControlRef = useRef<unknown>(null)

  const [mapViewStyle, setMapViewStyle] = useState<MapViewStyle>("standard")
  const [is3DView, setIs3DView] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [airportSearchQuery, setAirportSearchQuery] = useState("")
  const [airportSearchResults, setAirportSearchResults] = useState<
    AirportSearchResult[]
  >([])
  const [isAirportSearchLoading, setIsAirportSearchLoading] = useState(false)
  const [airportSearchError, setAirportSearchError] = useState<string | null>(
    null
  )
  const [selectedIndoorResult, setSelectedIndoorResult] =
    useState<AirportSearchResult | null>(null)

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [open])

  useEffect(() => {
    if (!open || !airport || !mapContainerRef.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!token) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN")
      return
    }

    mapboxgl.accessToken = token

    const center: [number, number] =
      airport.longitude != null && airport.latitude != null
        ? [airport.longitude, airport.latitude]
        : [-80.287, 25.7959]

    if (mapRef.current) {
      mapRef.current.setStyle(MAPBOX_STYLES[mapViewStyle], {
        config: {
          basemap: {
            showIndoor: true,
          },
        },
      } as any)

      mapRef.current.once("style.load", () => {
        if (!mapRef.current) return

        enableMapboxIndoorMapping(mapRef.current)
        addIndoorControlIfAvailable(mapRef.current, indoorControlRef)

        // Temporary fallback while we verify Mapbox built-in indoor rendering.
        addIndoorAirportLayers(mapRef.current)
      })

      mapRef.current.flyTo({
        center,
        zoom: airport.longitude != null && airport.latitude != null ? 15.5 : 8,
        pitch: is3DView ? MAP_3D_CAMERA.pitch : MAP_2D_CAMERA.pitch,
        bearing: is3DView ? MAP_3D_CAMERA.bearing : MAP_2D_CAMERA.bearing,
        essential: true,
      })

      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLES[mapViewStyle],
      config: {
        basemap: {
          showIndoor: true,
        },
      },
      projection: "globe",
      center,
      zoom: airport.longitude != null && airport.latitude != null ? 15.5 : 8,
      pitch: is3DView ? MAP_3D_CAMERA.pitch : MAP_2D_CAMERA.pitch,
      bearing: is3DView ? MAP_3D_CAMERA.bearing : MAP_2D_CAMERA.bearing,
    } as mapboxgl.MapOptions)

    map.addControl(new mapboxgl.NavigationControl(), "top-right")

    map.on("load", () => {
      enableMapboxIndoorMapping(map)
      addIndoorControlIfAvailable(map, indoorControlRef)

      // Temporary fallback while we verify Mapbox built-in indoor rendering.
      addIndoorAirportLayers(map)
    })

    mapRef.current = map

    return () => {
      indoorControlRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [open, airport, mapViewStyle, is3DView])

  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.easeTo({
      pitch: is3DView ? MAP_3D_CAMERA.pitch : MAP_2D_CAMERA.pitch,
      bearing: is3DView ? MAP_3D_CAMERA.bearing : MAP_2D_CAMERA.bearing,
      duration: 700,
      essential: true,
    })
  }, [is3DView])

  useEffect(() => {
    if (!open) return

    setAirportSearchQuery("")
    setAirportSearchResults([])
    setAirportSearchError(null)
    setIsAirportSearchLoading(false)
    setSelectedIndoorResult(null)

    selectedMarkerRef.current?.remove()
    selectedMarkerRef.current = null
  }, [open, airport?.code])

  useEffect(() => {
    if (!isFullscreen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  useEffect(() => {
    const query = airportSearchQuery.trim()

    if (!airport || selectedIndoorResult || query.length < 1) {
      setAirportSearchResults([])
      setIsAirportSearchLoading(false)
      setAirportSearchError(null)
      return
    }

    const controller = new AbortController()

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsAirportSearchLoading(true)
        setAirportSearchError(null)

        const response = await fetch(
          buildApiUrl(
            `/api/airports/${encodeURIComponent(
              airport.code
            )}/indoor-search?q=${encodeURIComponent(query)}`
          ),
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error("Airport indoor search failed")
        }

        const results = (await response.json()) as AirportSearchResult[]

        setAirportSearchResults(results)
      } catch (error) {
        if (controller.signal.aborted) return

        console.error("Airport indoor search error", error)
        setAirportSearchResults([])
        setAirportSearchError("Indoor search is unavailable right now.")
      } finally {
        if (!controller.signal.aborted) {
          setIsAirportSearchLoading(false)
        }
      }
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [airport, airportSearchQuery, selectedIndoorResult])

  useEffect(() => {
    if (!mapRef.current) return

    window.setTimeout(() => mapRef.current?.resize(), 0)
    window.setTimeout(() => mapRef.current?.resize(), 250)
  }, [isFullscreen])

  if (!open || !airport) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className={`w-full border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] ${isFullscreen
          ? "fixed inset-0 flex h-screen max-w-none flex-col overflow-hidden rounded-none p-4"
          : "max-w-4xl rounded-3xl p-6"
          }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              Airport Explorer
            </p>

            <div className="mt-3 flex w-full flex-col gap-3 lg:flex-row lg:items-center">
              <h2 className="shrink-0 text-2xl font-semibold tracking-tight text-slate-950">
                {airport.city} ({airport.code})
              </h2>

              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  value={airportSearchQuery}
                  onChange={(event) => {
                    setAirportSearchQuery(event.target.value.toUpperCase())
                    setSelectedIndoorResult(null)
                  }}
                  placeholder="Search lounges, gates, restaurants, restrooms..."
                  className="w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                />

                {airportSearchQuery.trim().length >= 1 && !selectedIndoorResult && (
                  <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                    {isAirportSearchLoading ? (
                      <div className="px-3 py-3 text-sm text-slate-500">
                        Searching airport locations...
                      </div>
                    ) : airportSearchError ? (
                      <div className="px-3 py-3 text-sm text-red-500">
                        {airportSearchError}
                      </div>
                    ) : airportSearchResults.length === 0 ? (
                      <div className="px-3 py-3 text-sm text-slate-500">
                        No matching indoor locations found.
                      </div>
                    ) : (
                      airportSearchResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => {
                            if (!mapRef.current) return

                            mapRef.current.flyTo({
                              center: result.coordinates,
                              zoom: 18.2,
                              pitch: is3DView
                                ? MAP_3D_CAMERA.pitch
                                : MAP_2D_CAMERA.pitch,
                              bearing: is3DView
                                ? MAP_3D_CAMERA.bearing
                                : MAP_2D_CAMERA.bearing,
                              essential: true,
                            })

                            selectedMarkerRef.current?.remove()

                            const markerElement = document.createElement("button")
                            markerElement.type = "button"
                            markerElement.className =
                              "group flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-[0_14px_35px_rgba(15,23,42,0.22)] ring-4 ring-cyan-100/70 transition hover:border-cyan-300 hover:bg-cyan-50"

                            const markerDot = document.createElement("span")
                            markerDot.className =
                              "h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.16)]"

                            const markerLabel = document.createElement("span")
                            markerLabel.textContent = result.name

                            const markerClose = document.createElement("span")
                            markerClose.textContent = "×"
                            markerClose.className =
                              "ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-base font-light leading-none text-white transition group-hover:bg-slate-800"

                            markerElement.appendChild(markerDot)
                            markerElement.appendChild(markerLabel)
                            markerElement.appendChild(markerClose)

                            markerElement.addEventListener("click", (event) => {
                              event.stopPropagation()
                              selectedMarkerRef.current?.remove()
                              selectedMarkerRef.current = null
                              setSelectedIndoorResult(null)
                              setAirportSearchQuery("")
                            })

                            selectedMarkerRef.current = new mapboxgl.Marker({
                              element: markerElement,
                              anchor: "bottom",
                            })
                              .setLngLat(result.coordinates)
                              .addTo(mapRef.current)

                            setAirportSearchQuery(result.name)
                            setSelectedIndoorResult(result)
                            setAirportSearchResults([])
                          }}
                          className="flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {result.name}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>{getAirportResultTypeLabel(result)}</span>

                              {result.areaName && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span>{result.areaName}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="ml-4 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {result.category === "gate" ? "Gate" : "Indoor"}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {airport.name} · {airport.country}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close airport explorer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-2xl font-light leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
          >
            ×
          </button>
        </div>

        <div
          className={`mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white ${isFullscreen ? "flex min-h-0 flex-1 flex-col" : ""
            }`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Airport map
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Indoor terminals, labels, and airport floorplan layers.
              </p>

              {is3DView && (
                <p className="mt-1 text-[11px] font-medium text-cyan-700">
                  3D enabled · Right-click + drag to orbit
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIs3DView((prev) => !prev)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${is3DView
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
              >
                {is3DView ? "3D on" : "3D"}
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {isFullscreen ? "Exit full screen" : "Full screen"}
              </button>

              <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setMapViewStyle("standard")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${mapViewStyle === "standard"
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:text-slate-950"
                    }`}
                >
                  Standard
                </button>

                <button
                  type="button"
                  onClick={() => setMapViewStyle("satellite")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${mapViewStyle === "satellite"
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:text-slate-950"
                    }`}
                >
                  Satellite
                </button>
              </div>
            </div>
          </div>

          <div
            ref={mapContainerRef}
            className={
              isFullscreen
                ? "relative min-h-0 flex-1 overflow-hidden"
                : "relative h-[420px] w-full overflow-hidden"
            }
          />
        </div>
      </div>
    </div>
  )
}