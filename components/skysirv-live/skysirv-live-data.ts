import { MAJOR_AIRPORTS, type AirportOption } from "@/lib/airports/major-airports"

export type AirportSeverity = "normal" | "minor" | "moderate" | "major"

export type SkysirvLiveAirport = {
  code: string
  name: string
  city: string
  country: string
  latitude: number
  longitude: number
  severity: AirportSeverity
  departuresDelay: number
  arrivalsDelay: number
  cancellationRate: number
  statusLabel?: string
  groundStopActive?: boolean
  groundDelayActive?: boolean
  airportClosureActive?: boolean
  disruptionReason?: string | null
  eventType?: string
  source?: "FAA" | "Skysirv" | "mock"
  observedAt?: string
  pressureScore?: number
  departurePressurePercent?: number
  arrivalPressurePercent?: number
  averageDepartureDelayMinutes?: number
  averageArrivalDelayMinutes?: number
  pressureSourceBreakdown?: {
    faaScore: number
    weatherScore: number
    flightPerformanceScore: number
    activeSources: Array<"faa" | "weather" | "flight_performance">
  }
  airportType?: "major" | "regional" | "executive" | "cargo" | "reliever"
  priorityRank?: number
}

export type FaaAirportStatus = {
  iata: string
  severity: AirportSeverity
  statusLabel: string
  departuresDelay: number | null
  arrivalsDelay: number | null
  groundStopActive: boolean
  groundDelayActive: boolean
  airportClosureActive: boolean
  disruptionReason: string | null
  eventType: string
  source: "FAA"
  observedAt: string
}

export type FaaAirportStatusResponse = {
  ok: boolean
  source: "FAA"
  observedAt: string
  cacheTtlSeconds: number
  airports: FaaAirportStatus[]
}

export type SkysirvAirportPressureStatus = {
  iata: string
  pressureScore: number
  severity: AirportSeverity
  statusLabel: string
  departurePressurePercent: number
  arrivalPressurePercent: number
  cancellationPercent: number
  averageDepartureDelayMinutes: number
  averageArrivalDelayMinutes: number
  primaryReason: string | null
  sourceBreakdown: {
    faaScore: number
    weatherScore: number
    flightPerformanceScore: number
    activeSources: Array<"faa" | "weather" | "flight_performance">
  }
}

export type SkysirvAirportPressureResponse = {
  ok: boolean
  source: "Skysirv"
  observedAt: string
  cacheTtlSeconds: number
  airports: SkysirvAirportPressureStatus[]
}

function hasAirportCoordinates(
  airport: AirportOption,
): airport is AirportOption & { latitude: number; longitude: number } {
  return (
    typeof airport.latitude === "number" &&
    typeof airport.longitude === "number"
  )
}

export const airports: SkysirvLiveAirport[] = MAJOR_AIRPORTS
  .filter(hasAirportCoordinates)
  .map((airport) => ({
    code: airport.code,
    name: airport.name,
    city: airport.city,
    country: airport.country,
    latitude: airport.latitude,
    longitude: airport.longitude,
    severity: "normal",
    departuresDelay: 0,
    arrivalsDelay: 0,
    cancellationRate: 0,
    source: "mock",
    airportType: airport.airportType ?? "major",
    priorityRank: airport.priorityRank ?? 1,
  }))

export function mergeFaaStatusesWithAirports(
  baseAirports: SkysirvLiveAirport[],
  faaStatuses: FaaAirportStatus[],
): SkysirvLiveAirport[] {
  const faaStatusByAirportCode = new Map(
    faaStatuses.map((status) => [status.iata.toUpperCase(), status]),
  )

  return baseAirports.map((airport) => {
    const faaStatus = faaStatusByAirportCode.get(airport.code.toUpperCase())

    if (!faaStatus) {
      return {
        ...airport,
        source: airport.source ?? "mock",
      }
    }

    return {
      ...airport,
      severity: faaStatus.severity,
      departuresDelay: faaStatus.departuresDelay ?? airport.departuresDelay,
      arrivalsDelay: faaStatus.arrivalsDelay ?? airport.arrivalsDelay,
      statusLabel: faaStatus.statusLabel,
      groundStopActive: faaStatus.groundStopActive,
      groundDelayActive: faaStatus.groundDelayActive,
      airportClosureActive: faaStatus.airportClosureActive,
      disruptionReason: faaStatus.disruptionReason,
      eventType: faaStatus.eventType,
      source: "FAA",
      observedAt: faaStatus.observedAt,
    }
  })
}

export function mergeAirportPressureWithAirports(
  baseAirports: SkysirvLiveAirport[],
  pressureStatuses: SkysirvAirportPressureStatus[],
  observedAt?: string,
): SkysirvLiveAirport[] {
  const pressureByAirportCode = new Map(
    pressureStatuses.map((status) => [status.iata.toUpperCase(), status]),
  )

  return baseAirports.map((airport) => {
    const pressureStatus = pressureByAirportCode.get(airport.code.toUpperCase())

    if (!pressureStatus) {
      return {
        ...airport,
        source: airport.source ?? "mock",
      }
    }

    return {
      ...airport,
      severity: pressureStatus.severity,
      departuresDelay: pressureStatus.averageDepartureDelayMinutes,
      arrivalsDelay: pressureStatus.averageArrivalDelayMinutes,
      cancellationRate: pressureStatus.cancellationPercent,
      statusLabel: pressureStatus.statusLabel,
      disruptionReason: pressureStatus.primaryReason,
      source: "Skysirv",
      observedAt,
      pressureScore: pressureStatus.pressureScore,
      departurePressurePercent: pressureStatus.departurePressurePercent,
      arrivalPressurePercent: pressureStatus.arrivalPressurePercent,
      averageDepartureDelayMinutes:
        pressureStatus.averageDepartureDelayMinutes,
      averageArrivalDelayMinutes: pressureStatus.averageArrivalDelayMinutes,
      pressureSourceBreakdown: pressureStatus.sourceBreakdown,
    }
  })
}

export function getAirportPressureScore(airport: {
  departuresDelay: number
  arrivalsDelay: number
  cancellationRate: number
}) {
  return (
    airport.departuresDelay +
    airport.arrivalsDelay +
    airport.cancellationRate * 10
  )
}

export function getAirportSeverityRank(severity: AirportSeverity) {
  if (severity === "major") return 0
  if (severity === "moderate") return 1
  if (severity === "minor") return 2

  return 3
}

export function getSeverityStyles(severity: AirportSeverity) {
  if (severity === "major") {
    return {
      dot: "bg-red-500",
      ring: "bg-red-500/20",
      text: "text-red-600",
      bar: "bg-red-500",
      alertBar: "bg-red-600",
      label: "Major issues",
    }
  }

  if (severity === "moderate") {
    return {
      dot: "bg-orange-500",
      ring: "bg-orange-500/20",
      text: "text-orange-600",
      bar: "bg-orange-500",
      alertBar: "bg-orange-500",
      label: "Moderate delays",
    }
  }

  if (severity === "minor") {
    return {
      dot: "bg-amber-400",
      ring: "bg-amber-400/25",
      text: "text-amber-600",
      bar: "bg-amber-400",
      alertBar: "bg-amber-400",
      label: "Minor issues",
    }
  }

  return {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500/20",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    alertBar: "bg-emerald-500",
    label: "Normal",
  }
}

export function getAirportByCode(code: string) {
  return airports.find(
    (airport) => airport.code.toLowerCase() === code.toLowerCase(),
  )
}