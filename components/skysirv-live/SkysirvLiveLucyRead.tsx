"use client"

import {
  getAirportPressureScore,
  getAirportSeverityRank,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"

type SkysirvLiveLucyReadProps = {
  airports?: SkysirvLiveAirport[]
  activeRegion?: string
  lastUpdatedAt?: string
}

const regionLabels: Record<string, string> = {
  all: "the global map",
  "north-america": "North America",
  "south-america": "South America",
  europe: "Europe",
  "middle-east": "the Middle East",
  africa: "Africa",
  asia: "Asia",
  oceania: "Oceania",
  pacific: "the Pacific",
}

const airportRegionByCountry: Record<string, string> = {
  "United States": "north-america",
  Canada: "north-america",
  Mexico: "north-america",
  Guatemala: "north-america",
  Panama: "north-america",
  "El Salvador": "north-america",
  "Costa Rica": "north-america",

  Argentina: "south-america",
  Bolivia: "south-america",
  Brazil: "south-america",
  Chile: "south-america",
  Colombia: "south-america",
  Peru: "south-america",

  Austria: "europe",
  Belgium: "europe",
  Denmark: "europe",
  Finland: "europe",
  France: "europe",
  Germany: "europe",
  Greece: "europe",
  Ireland: "europe",
  Italy: "europe",
  Netherlands: "europe",
  Norway: "europe",
  Portugal: "europe",
  Spain: "europe",
  Sweden: "europe",
  Switzerland: "europe",
  Turkey: "europe",
  "United Kingdom": "europe",

  Bahrain: "middle-east",
  Israel: "middle-east",
  Kuwait: "middle-east",
  Qatar: "middle-east",
  "Saudi Arabia": "middle-east",
  "United Arab Emirates": "middle-east",

  Algeria: "africa",
  Egypt: "africa",
  Ethiopia: "africa",
  Kenya: "africa",
  Morocco: "africa",
  "South Africa": "africa",

  China: "asia",
  "Hong Kong": "asia",
  India: "asia",
  Indonesia: "asia",
  Japan: "asia",
  Malaysia: "asia",
  Philippines: "asia",
  Singapore: "asia",
  "South Korea": "asia",
  Taiwan: "asia",
  Thailand: "asia",

  Australia: "pacific",
  "New Zealand": "pacific",
}

function getLucyRegionLabel(
  airports: SkysirvLiveAirport[],
  activeRegion: string,
) {
  const airportRegionKeys = Array.from(
    new Set(
      airports
        .map((airport) => airportRegionByCountry[airport.country])
        .filter(Boolean),
    ),
  )

  if (airportRegionKeys.length === 1) {
    return regionLabels[airportRegionKeys[0]] ?? "this region"
  }

  if (airportRegionKeys.length > 1) {
    return "the current map view"
  }

  return regionLabels[activeRegion] ?? "this region"
}

function formatAirportName(airport: SkysirvLiveAirport) {
  const airportName = airport.name ?? airport.city

  return `${airportName} (${airport.code})`
}

function sortAirportsByPressure(
  firstAirport: SkysirvLiveAirport,
  secondAirport: SkysirvLiveAirport,
) {
  const severityDifference =
    getAirportSeverityRank(firstAirport.severity) -
    getAirportSeverityRank(secondAirport.severity)

  if (severityDifference !== 0) {
    return severityDifference
  }

  return (
    getAirportPressureScore(secondAirport) -
    getAirportPressureScore(firstAirport)
  )
}

function formatFeedTiming(lastUpdatedAt?: string) {
  if (!lastUpdatedAt) {
    return "based on Skysirv’s current airport pressure feed"
  }

  const updatedAt = new Date(lastUpdatedAt)

  if (Number.isNaN(updatedAt.getTime())) {
    return "based on Skysirv’s current airport pressure feed"
  }
}

function buildLucyLiveRead(
  airports: SkysirvLiveAirport[] = [],
  activeRegion = "north-america",
  lastUpdatedAt?: string,
) {
  const regionLabel = getLucyRegionLabel(airports, activeRegion)
  const feedTiming = formatFeedTiming(lastUpdatedAt)

  if (airports.length === 0) {
    return "I’m not seeing tracked airports in the current map view. Pan or zoom toward monitored airports and I’ll update this live read from the visible airport pressure data."
  }

  const disruptedAirports = airports.filter(
    (airport) => airport.severity !== "normal",
  )

  const airportPool =
    disruptedAirports.length > 0 ? disruptedAirports : airports

  const rankedAirports = [...airportPool]
    .sort(sortAirportsByPressure)
    .slice(0, 3)

  const strongestAirport = rankedAirports[0]

  if (!strongestAirport) {
    return `I’m not seeing enough live airport pressure data for ${regionLabel} yet.`
  }

  const strongestAirportName = formatAirportName(strongestAirport)
  const pressureScore =
    typeof strongestAirport.pressureScore === "number"
      ? ` with a pressure score of ${strongestAirport.pressureScore}`
      : ""

  const reasonText =
    strongestAirport.severity !== "normal"
      ? ` This read is ${feedTiming}.`
      : ""

  if (disruptedAirports.length > 0) {
    const supportingAirports = rankedAirports
      .slice(1)
      .map(formatAirportName)
      .join(", ")

    const supportingText = supportingAirports
      ? ` I’d also keep ${supportingAirports} on the board before choosing tight connections.`
      : " I’d be careful with tight connections here until the live pressure cools."

    return `${regionLabel} is showing ${disruptedAirports.length} airport${disruptedAirports.length === 1 ? "" : "s"
      } above normal pressure. ${strongestAirportName} is leading at ${strongestAirport.severity
      } severity${pressureScore}.${reasonText}${supportingText}`
  }

  return `${regionLabel} looks mostly calm ${feedTiming}. ${strongestAirportName} has the highest visible pressure${pressureScore}, but it is still marked normal, so I would not treat this as a disruption yet.`
}

export default function SkysirvLiveLucyRead({
  airports = [],
  activeRegion = "north-america",
  lastUpdatedAt,
}: SkysirvLiveLucyReadProps) {
  const liveRead = buildLucyLiveRead(airports, activeRegion, lastUpdatedAt)

  return (
    <div className="pointer-events-auto absolute right-5 top-[118px] z-20 hidden max-w-sm rounded-[1.35rem] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:block">
      <p className="text-[14px] font-bold uppercase tracking-[0.2em] text-blue-600">
        Lucy live read
      </p>

      <p className="mt-2 text-sm font-semibold italic leading-6 text-slate-800">
        “{liveRead}”
      </p>
    </div>
  )
}