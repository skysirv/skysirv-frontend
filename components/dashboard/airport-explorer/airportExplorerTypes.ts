export type MapViewStyle = "standard" | "satellite"

export type AirportSearchResult = {
  id: string
  name: string
  type?: string
  class?: string
  floorId?: string
  areaName?: string
  category?: string
  coordinates: [number, number]
}