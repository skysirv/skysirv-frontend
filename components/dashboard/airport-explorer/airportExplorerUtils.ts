import type { MutableRefObject } from "react"
import mapboxgl from "mapbox-gl"

import type {
  AirportSearchResult,
  MapViewStyle,
} from "@/components/dashboard/airport-explorer/airportExplorerTypes"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

export const MAPBOX_STYLES: Record<MapViewStyle, string> = {
  standard: "mapbox://styles/mapbox/standard",
  satellite: "mapbox://styles/mapbox/standard-satellite",
}

export const MAP_2D_CAMERA = {
  pitch: 0,
  bearing: 0,
}

export const MAP_3D_CAMERA = {
  pitch: 55,
  bearing: -18,
}

export type IndoorMapSetupResult = {
  indoorConfigEnabled: boolean
  indoorControlAdded: boolean
  fallbackLayersAdded: boolean
}

export type IndoorCoverageStatus =
  | "available"
  | "unavailable"
  | "error"
  | "missing-coordinates"
  | "missing-token"

export type IndoorCoverageDetectionResult = {
  status: IndoorCoverageStatus
  hasIndoorCoverage: boolean
  featureCount: number
  layers: string[]
  facilityName?: string | null
  facilityCode?: string | null
  message: string
}

type MapboxTilequeryFeature = {
  id?: string | number
  type?: string
  properties?: {
    id?: string
    name?: string
    description?: string
    class?: string
    type?: string
    tilequery?: {
      layer?: string
      distance?: number
      geometry?: string
    }
    [key: string]: unknown
  }
  layer?: {
    id?: string
    source?: string
    sourceLayer?: string
  }
  sourceLayer?: string
}

type MapboxTilequeryResponse = {
  type?: string
  features?: MapboxTilequeryFeature[]
}

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) return path

  return `${API_BASE_URL.replace(/\/$/, "")}${path}`
}

export function getAirportResultTypeLabel(result: AirportSearchResult) {
  if (result.category === "gate" || result.type === "gates") return "Gate"
  if (result.category === "baggage") return "Baggage claim"
  if (result.category === "restroom") return "Restroom"
  if (result.category === "security") return "Security"
  if (result.category === "lounge") return "Lounge"
  if (result.category === "food") return "Food & dining"
  if (result.category === "shopping") return "Shopping"
  if (result.category === "transport") return "Airport transport"
  if (result.category === "parking") return "Parking"
  if (result.category === "terminal") return "Terminal area"

  return result.type || result.class || "Airport location"
}

export function enableMapboxIndoorMapping(map: mapboxgl.Map) {
  try {
    map.setConfigProperty("basemap", "showIndoor", true)
    return true
  } catch (error) {
    console.warn("Mapbox indoor config is unavailable for this style.", error)
    return false
  }
}

export function addIndoorControlIfAvailable(
  map: mapboxgl.Map,
  indoorControlRef: MutableRefObject<unknown>
) {
  if (indoorControlRef.current) return true

  const IndoorControl = (mapboxgl as unknown as {
    IndoorControl?: new () => mapboxgl.IControl
  }).IndoorControl

  if (!IndoorControl) {
    console.warn("Mapbox IndoorControl is not available in this mapbox-gl build.")
    return false
  }

  try {
    const indoorControl = new IndoorControl()

    map.addControl(indoorControl, "top-right")
    indoorControlRef.current = indoorControl

    return true
  } catch (error) {
    console.warn("Mapbox IndoorControl could not be added.", error)
    return false
  }
}

export function addIndoorAirportLayers(map: mapboxgl.Map) {
  if (map.getSource("indoor")) return true

  try {
    map.addSource("indoor", {
      type: "vector",
      url: "mapbox://mapbox.indoor-v3",
    })

    map.addLayer({
      id: "indoor-floorplan",
      type: "fill",
      source: "indoor",
      "source-layer": "indoor_floorplan",
      paint: {
        "fill-color": [
          "match",
          ["get", "class"],
          "security",
          "#fde68a",
          "restaurants",
          "#bbf7d0",
          "retail",
          "#bfdbfe",
          "services",
          "#e9d5ff",
          "#e5e7eb",
        ],
        "fill-opacity": 0.6,
      },
    })

    map.addLayer({
      id: "indoor-labels",
      type: "symbol",
      source: "indoor",
      "source-layer": "indoor_label",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 11,
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": "#0f172a",
      },
    })

    return true
  } catch (error) {
    console.warn("Fallback indoor airport layers could not be added.", error)
    return false
  }
}

export function setupIndoorAirportMap(
  map: mapboxgl.Map,
  indoorControlRef: MutableRefObject<unknown>,
  options?: {
    enableFallbackLayers?: boolean
  }
): IndoorMapSetupResult {
  const indoorConfigEnabled = enableMapboxIndoorMapping(map)
  const indoorControlAdded = addIndoorControlIfAvailable(map, indoorControlRef)

  const fallbackLayersAdded = options?.enableFallbackLayers
    ? addIndoorAirportLayers(map)
    : false

  return {
    indoorConfigEnabled,
    indoorControlAdded,
    fallbackLayersAdded,
  }
}

function getTilequeryFeatureLayer(feature: MapboxTilequeryFeature) {
  return (
    feature.properties?.tilequery?.layer ||
    feature.layer?.sourceLayer ||
    feature.layer?.id ||
    feature.sourceLayer ||
    "unknown"
  )
}

function normalizeText(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase()
}

export async function detectMapboxIndoorAirportCoverage({
  airportCode,
  airportName,
  longitude,
  latitude,
  accessToken,
  radiusMeters = 3000,
}: {
  airportCode: string
  airportName?: string | null
  longitude?: number | null
  latitude?: number | null
  accessToken?: string | null
  radiusMeters?: number
}): Promise<IndoorCoverageDetectionResult> {
  if (
    longitude == null ||
    latitude == null ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return {
      status: "missing-coordinates",
      hasIndoorCoverage: false,
      featureCount: 0,
      layers: [],
      message: "Airport coordinates are missing, so indoor coverage cannot be checked.",
    }
  }

  if (!accessToken) {
    return {
      status: "missing-token",
      hasIndoorCoverage: false,
      featureCount: 0,
      layers: [],
      message: "Mapbox token is missing, so indoor coverage cannot be checked.",
    }
  }

  const indoorLayers = [
    "indoor_facility_metadata",
    "indoor_structure_metadata",
    "indoor_floor_metadata",
  ]

  const queryUrl = new URL(
    `https://api.mapbox.com/v4/mapbox.indoor-v3/tilequery/${longitude},${latitude}.json`
  )

  queryUrl.searchParams.set("access_token", accessToken)
  queryUrl.searchParams.set("layers", indoorLayers.join(","))
  queryUrl.searchParams.set("radius", String(radiusMeters))
  queryUrl.searchParams.set("limit", "50")
  queryUrl.searchParams.set("dedupe", "true")

  try {
    const response = await fetch(queryUrl.toString())

    if (!response.ok) {
      throw new Error(`Mapbox indoor coverage check failed: ${response.status}`)
    }

    const data = (await response.json().catch(() => null)) as
      | MapboxTilequeryResponse
      | null

    const features = Array.isArray(data?.features) ? data.features : []
    const layers = Array.from(
      new Set(features.map((feature) => getTilequeryFeatureLayer(feature)))
    ).filter((layer) => layer !== "unknown")

    const airportCodeNormalized = normalizeText(airportCode)
    const airportNameNormalized = normalizeText(airportName)

    const facilityFeature =
      features.find((feature) => {
        const properties = feature.properties ?? {}
        const featureClass = normalizeText(String(properties.class ?? ""))
        const featureDescription = normalizeText(
          String(properties.description ?? "")
        )
        const featureName = normalizeText(String(properties.name ?? ""))

        return (
          featureClass === "airport" &&
          (featureDescription === airportCodeNormalized ||
            featureName.includes(airportNameNormalized) ||
            featureName.includes(airportCodeNormalized))
        )
      }) ??
      features.find((feature) => {
        const properties = feature.properties ?? {}
        return normalizeText(String(properties.class ?? "")) === "airport"
      }) ??
      null

    const hasIndoorCoverage = features.length > 0

    if (!hasIndoorCoverage) {
      return {
        status: "unavailable",
        hasIndoorCoverage: false,
        featureCount: 0,
        layers,
        message: "No Mapbox indoor airport coverage was detected near this airport.",
      }
    }

    return {
      status: "available",
      hasIndoorCoverage: true,
      featureCount: features.length,
      layers,
      facilityName:
        typeof facilityFeature?.properties?.name === "string"
          ? facilityFeature.properties.name
          : null,
      facilityCode:
        typeof facilityFeature?.properties?.description === "string"
          ? facilityFeature.properties.description
          : null,
      message: "Mapbox indoor airport coverage was detected near this airport.",
    }
  } catch (error) {
    console.warn("Mapbox indoor airport coverage detection failed.", error)

    return {
      status: "error",
      hasIndoorCoverage: false,
      featureCount: 0,
      layers: [],
      message: "Indoor coverage could not be checked right now.",
    }
  }
}