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

export type SkysirvLiveAircraftStatus =
  | "airborne"
  | "climbing"
  | "cruising"
  | "descending"
  | "approaching"

export type SkysirvLiveAircraft = {
  id: string
  flightNumber: string
  airlineName: string
  aircraftType: string
  registration: string
  latitude: number
  longitude: number
  heading: number
  altitudeFeet: number
  groundSpeedKnots: number
  originCode: string
  originCity: string
  destinationCode: string
  destinationCity: string
  scheduledDepartureLocal: string
  scheduledArrivalLocal: string
  estimatedArrivalLocal: string
  delayMinutes: number
  routeProgressPercent: number
  status: SkysirvLiveAircraftStatus
  source: "Skysirv" | "provider" | "seed"
}

export const liveAircraft: SkysirvLiveAircraft[] = [
  {
    id: "skv-1024",
    flightNumber: "SKV1024",
    airlineName: "Skysirv Airways",
    aircraftType: "Airbus A320neo",
    registration: "N1024SV",
    latitude: 39.7,
    longitude: -98.4,
    heading: 82,
    altitudeFeet: 36000,
    groundSpeedKnots: 452,
    originCode: "SFO",
    originCity: "San Francisco",
    destinationCode: "JFK",
    destinationCity: "New York",
    scheduledDepartureLocal: "8:20 AM",
    scheduledArrivalLocal: "4:55 PM",
    estimatedArrivalLocal: "5:08 PM",
    delayMinutes: 13,
    routeProgressPercent: 54,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-1188",
    flightNumber: "SKV1188",
    airlineName: "Skysirv Airways",
    aircraftType: "Boeing 737 MAX 8",
    registration: "N1188SV",
    latitude: 33.2,
    longitude: -91.5,
    heading: 95,
    altitudeFeet: 33000,
    groundSpeedKnots: 438,
    originCode: "LAX",
    originCity: "Los Angeles",
    destinationCode: "MIA",
    destinationCity: "Miami",
    scheduledDepartureLocal: "9:05 AM",
    scheduledArrivalLocal: "5:20 PM",
    estimatedArrivalLocal: "5:42 PM",
    delayMinutes: 22,
    routeProgressPercent: 63,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-2206",
    flightNumber: "SKV2206",
    airlineName: "Skysirv Connect",
    aircraftType: "Embraer E175",
    registration: "N2206SC",
    latitude: 41.5,
    longitude: -83.2,
    heading: 74,
    altitudeFeet: 24000,
    groundSpeedKnots: 386,
    originCode: "ORD",
    originCity: "Chicago",
    destinationCode: "BOS",
    destinationCity: "Boston",
    scheduledDepartureLocal: "11:10 AM",
    scheduledArrivalLocal: "2:28 PM",
    estimatedArrivalLocal: "2:31 PM",
    delayMinutes: 3,
    routeProgressPercent: 68,
    status: "descending",
    source: "seed",
  },
  {
    id: "skv-3041",
    flightNumber: "SKV3041",
    airlineName: "Skysirv Atlantic",
    aircraftType: "Boeing 787-9",
    registration: "N3041SA",
    latitude: 52.8,
    longitude: -31.4,
    heading: 82,
    altitudeFeet: 39000,
    groundSpeedKnots: 487,
    originCode: "JFK",
    originCity: "New York",
    destinationCode: "LHR",
    destinationCity: "London",
    scheduledDepartureLocal: "7:45 PM",
    scheduledArrivalLocal: "7:55 AM",
    estimatedArrivalLocal: "8:04 AM",
    delayMinutes: 9,
    routeProgressPercent: 58,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-4410",
    flightNumber: "SKV4410",
    airlineName: "Skysirv Europe",
    aircraftType: "Airbus A321neo",
    registration: "G-SV410",
    latitude: 48.6,
    longitude: 8.4,
    heading: 132,
    altitudeFeet: 31000,
    groundSpeedKnots: 421,
    originCode: "LHR",
    originCity: "London",
    destinationCode: "FCO",
    destinationCity: "Rome",
    scheduledDepartureLocal: "1:15 PM",
    scheduledArrivalLocal: "4:45 PM",
    estimatedArrivalLocal: "4:45 PM",
    delayMinutes: 0,
    routeProgressPercent: 47,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-5172",
    flightNumber: "SKV5172",
    airlineName: "Skysirv Pacific",
    aircraftType: "Airbus A350-900",
    registration: "JA5172",
    latitude: 36.4,
    longitude: 151.2,
    heading: 274,
    altitudeFeet: 41000,
    groundSpeedKnots: 502,
    originCode: "HND",
    originCity: "Tokyo",
    destinationCode: "LAX",
    destinationCity: "Los Angeles",
    scheduledDepartureLocal: "5:30 PM",
    scheduledArrivalLocal: "11:20 AM",
    estimatedArrivalLocal: "11:38 AM",
    delayMinutes: 18,
    routeProgressPercent: 32,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-6028",
    flightNumber: "SKV6028",
    airlineName: "Skysirv South",
    aircraftType: "Boeing 737-800",
    registration: "PR-S6028",
    latitude: -17.8,
    longitude: -58.9,
    heading: 120,
    altitudeFeet: 35000,
    groundSpeedKnots: 447,
    originCode: "VVI",
    originCity: "Santa Cruz",
    destinationCode: "GRU",
    destinationCity: "Sao Paulo",
    scheduledDepartureLocal: "10:40 AM",
    scheduledArrivalLocal: "2:25 PM",
    estimatedArrivalLocal: "2:36 PM",
    delayMinutes: 11,
    routeProgressPercent: 44,
    status: "cruising",
    source: "seed",
  },
  {
    id: "skv-7335",
    flightNumber: "SKV7335",
    airlineName: "Skysirv Gulf",
    aircraftType: "Boeing 777-300ER",
    registration: "A6-SV735",
    latitude: 25.4,
    longitude: 50.3,
    heading: 102,
    altitudeFeet: 37000,
    groundSpeedKnots: 468,
    originCode: "DOH",
    originCity: "Doha",
    destinationCode: "SIN",
    destinationCity: "Singapore",
    scheduledDepartureLocal: "2:05 PM",
    scheduledArrivalLocal: "1:10 AM",
    estimatedArrivalLocal: "1:19 AM",
    delayMinutes: 9,
    routeProgressPercent: 21,
    status: "climbing",
    source: "seed",
  },
]

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