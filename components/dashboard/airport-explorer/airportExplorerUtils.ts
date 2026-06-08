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
  } catch (error) {
    console.warn("Mapbox indoor config is unavailable for this style.", error)
  }
}

export function addIndoorControlIfAvailable(
  map: mapboxgl.Map,
  indoorControlRef: MutableRefObject<unknown>
) {
  if (indoorControlRef.current) return

  const IndoorControl = (mapboxgl as unknown as {
    IndoorControl?: new () => mapboxgl.IControl
  }).IndoorControl

  if (!IndoorControl) {
    console.warn("Mapbox IndoorControl is not available in this mapbox-gl build.")
    return
  }

  const indoorControl = new IndoorControl()

  map.addControl(indoorControl, "top-right")
  indoorControlRef.current = indoorControl
}

export function addIndoorAirportLayers(map: mapboxgl.Map) {
  if (map.getSource("indoor")) return

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
}