import { useState } from "react"

import type { BookingOffer, BookingSlice } from "@/lib/booking-api"
import { FlightsFilterPanel } from "@/components/booking/shared/results/BookingFilterControls"
import {
  BookingQuickChips,
  BookingResultsHeader,
  BookingResultsLayout,
} from "@/components/booking/shared/results/BookingResultsScaffold"
import {
  getFlightAirlineFilterOptions,
  getFlightAirportFilterGroups,
} from "./flightResultsFilterUtils"

type FlightsResultsPreviewProps = {
  offers: BookingOffer[]
  offerRequestId: string
  liveMode: boolean
  routeTitle: string
  passengerCount: number
}

type FilterOption = {
  label: string
  meta: string
  value?: string
}

type SortMode = "recommended" | "price" | "duration"

const RECOMMENDED_OFFER_COUNT = 5
const INITIAL_VISIBLE_OTHER_OFFERS = 10
const VISIBLE_OFFERS_INCREMENT = 10

const flightModeAds = [
  {
    id: "flight-ad-1",
    imageSrc: "/images/stock/advertise/flight-mode/ad-photo-1.jpg",
    heightClassName: "h-[220px]",
  },
  {
    id: "flight-ad-2",
    imageSrc: "/images/stock/advertise/flight-mode/ad-photo-2.jpg",
    heightClassName: "h-[220px]",
  },
  {
    id: "flight-ad-3",
    imageSrc: "/images/stock/advertise/flight-mode/ad-photo-3.jpg",
    heightClassName: "h-[440px]",
  },
  {
    id: "flight-ad-3",
    imageSrc: "/images/stock/advertise/flight-mode/ad-photo-4.jpg",
    heightClassName: "h-[220px]",
  },
]

const timeFilterBands = [
  { id: "early-morning", startHour: 0, endHour: 6 },
  { id: "morning", startHour: 6, endHour: 12 },
  { id: "afternoon", startHour: 12, endHour: 18 },
  { id: "evening", startHour: 18, endHour: 24 },
]

function parseAmount(value: string): number {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(amount: string, currency: string): string {
  const numericAmount = parseAmount(amount)

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: numericAmount % 1 === 0 ? 0 : 2,
  }).format(numericAmount)
}

function formatTime(value: string | null): string {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatDuration(value: string | null): string {
  if (!value) return "—"

  const match = value.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?$/)

  if (!match) return value

  const days = Number(match[1] ?? 0)
  const hours = Number(match[2] ?? 0)
  const minutes = Number(match[3] ?? 0)

  const totalHours = days * 24 + hours
  const parts = [
    totalHours > 0 ? `${totalHours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
  ].filter(Boolean)

  return parts.length ? parts.join(" ") : "—"
}

function formatDurationFromMinutes(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return ""

  const hours = Math.floor(minutes / 60)
  const remainderMinutes = minutes % 60

  const parts = [
    hours > 0 ? `${hours}h` : null,
    remainderMinutes > 0 ? `${remainderMinutes}m` : null,
  ].filter(Boolean)

  return parts.join(" ")
}

function getMinutesBetween(start: string | null, end: string | null): number {
  if (!start || !end) return 0

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0
  }

  return Math.max(
    0,
    Math.round((endDate.getTime() - startDate.getTime()) / 60000),
  )
}

function getLayoverLabel(slice: BookingSlice): string {
  if (slice.segments.length <= 1) return "Direct"

  const layovers = slice.segments
    .slice(0, -1)
    .map((segment, index) => {
      const nextSegment = slice.segments[index + 1]
      const code = segment.destination.iataCode ?? "Connection"
      const layoverMinutes = getMinutesBetween(
        segment.arrivingAt,
        nextSegment?.departingAt ?? null,
      )
      const duration = formatDurationFromMinutes(layoverMinutes)

      return duration ? `${code} (${duration})` : code
    })

  return layovers.length ? layovers.join(" · ") : "Connection"
}

function getStopsLabel(stops: number): string {
  if (stops === 0) return "Nonstop"
  if (stops === 1) return "1 Stop"

  return `${stops} Stops`
}

function getRouteLabel(offer: BookingOffer, fallbackRouteTitle: string): string {
  const routes = offer.slices
    .map((slice) => {
      const origin = slice.origin.iataCode
      const destination = slice.destination.iataCode

      if (!origin || !destination) return null

      return `${origin} → ${destination}`
    })
    .filter(Boolean)

  return routes.length ? routes.join(" · ") : fallbackRouteTitle
}

function getSliceRouteLabel(slice: BookingSlice): string {
  const origin = slice.origin.iataCode ?? "—"
  const destination = slice.destination.iataCode ?? "—"

  return `${origin} → ${destination}`
}

function getSliceDirectionLabel(index: number, totalSlices: number): string {
  if (totalSlices === 1) return "Flight"
  if (index === 0) return "Departing"
  if (index === 1) return "Returning"

  return `Leg ${index + 1}`
}

function getAirlineCode(offer: BookingOffer): string {
  return (
    offer.summary.airlineIataCode ??
    offer.owner.iataCode ??
    offer.summary.airlineName.slice(0, 2).toUpperCase()
  )
}

function getBadge(index: number): string {
  if (index === 0) return "Lowest fare"
  if (index === 1) return "Also strong"
  if (index === 2) return "Good option"

  return "Live fare"
}

function getAirlineName(offer: BookingOffer): string {
  return offer.summary.airlineName || offer.owner.name || "Unknown airline"
}

function getAirlineOptions(offers: BookingOffer[]): FilterOption[] {
  const airlineMap = new Map<string, number>()

  for (const offer of offers) {
    const airlineName = getAirlineName(offer)
    const amount = parseAmount(offer.totalAmount)
    const currentLowest = airlineMap.get(airlineName)

    if (currentLowest === undefined || amount < currentLowest) {
      airlineMap.set(airlineName, amount)
    }
  }

  return Array.from(airlineMap.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, 8)
    .map(([label, amount]) => ({
      label,
      meta: `from ${formatMoney(String(amount), offers[0]?.totalCurrency ?? "USD")}`,
    }))
}

function getStopsOptions(offers: BookingOffer[]): FilterOption[] {
  const stopsMap = new Map<number, number>()

  for (const offer of offers) {
    const stops = offer.slices[0]?.stops ?? offer.summary.stops
    const amount = parseAmount(offer.totalAmount)
    const currentLowest = stopsMap.get(stops)

    if (currentLowest === undefined || amount < currentLowest) {
      stopsMap.set(stops, amount)
    }
  }

  return Array.from(stopsMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([stops, amount]) => ({
      label: getStopsLabel(stops),
      value: String(stops),
      meta: `from ${formatMoney(String(amount), offers[0]?.totalCurrency ?? "USD")}`,
    }))
}

function getQuickChips(offers: BookingOffer[]): string[] {
  const chips = new Set<string>()

  for (const offer of offers.slice(0, 8)) {
    const stops = offer.slices[0]?.stops ?? offer.summary.stops
    chips.add(getStopsLabel(stops))

    if (offer.summary.airlineName) {
      chips.add(offer.summary.airlineName)
    }

    if (chips.size >= 6) break
  }

  return Array.from(chips)
}

function getDestinationLabel(
  offers: BookingOffer[],
  fallbackRouteTitle: string,
): string {
  const destination = offers[0]?.slices[0]?.destination

  if (destination?.cityName) return destination.cityName
  if (destination?.name) return destination.name

  const routeParts = fallbackRouteTitle.split("→")
  const lastRoutePart = routeParts[routeParts.length - 1]?.trim()

  return lastRoutePart || "your destination"
}

function buildOfferItineraryKey(offer: BookingOffer): string {
  return offer.slices
    .map((slice) => {
      const segmentKey = slice.segments
        .map((segment) =>
          [
            segment.airlineIataCode ?? "",
            segment.flightNumber ?? "",
            segment.origin.iataCode ?? "",
            segment.destination.iataCode ?? "",
            segment.departingAt ?? "",
            segment.arrivingAt ?? "",
          ].join(":"),
        )
        .join("|")

      return [
        slice.origin.iataCode ?? "",
        slice.destination.iataCode ?? "",
        slice.departureTime ?? "",
        slice.arrivalTime ?? "",
        slice.duration ?? "",
        slice.stops,
        segmentKey,
      ].join("::")
    })
    .join("||")
}

function getHourFromDateValue(value: string | null): number | null {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.getHours()
}

function matchesSelectedTimeBands(
  value: string | null,
  selectedBandIds: string[],
): boolean {
  if (!selectedBandIds.length) return true

  const hour = getHourFromDateValue(value)

  if (hour === null) return false

  return selectedBandIds.some((bandId) => {
    const band = timeFilterBands.find((option) => option.id === bandId)

    if (!band) return false

    return hour >= band.startHour && hour < band.endHour
  })
}

function offerMatchesTakeoffBands(
  offer: BookingOffer,
  selectedBandIds: string[],
): boolean {
  if (!selectedBandIds.length) return true

  return offer.slices.some((slice) =>
    matchesSelectedTimeBands(slice.departureTime, selectedBandIds),
  )
}

function offerMatchesLandingBands(
  offer: BookingOffer,
  selectedBandIds: string[],
): boolean {
  if (!selectedBandIds.length) return true

  return offer.slices.some((slice) =>
    matchesSelectedTimeBands(slice.arrivalTime, selectedBandIds),
  )
}

function offerMatchesAirportFilters(
  offer: BookingOffer,
  selectedAirportFilters: string[],
): boolean {
  if (!selectedAirportFilters.length) return true

  const selectedOriginCodes = selectedAirportFilters
    .filter((value) => value.startsWith("origin:"))
    .map((value) => value.replace("origin:", ""))

  const selectedDestinationCodes = selectedAirportFilters
    .filter((value) => value.startsWith("destination:"))
    .map((value) => value.replace("destination:", ""))

  const matchesOrigin =
    selectedOriginCodes.length === 0 ||
    offer.slices.some((slice) =>
      selectedOriginCodes.includes(slice.origin.iataCode ?? ""),
    )

  const matchesDestination =
    selectedDestinationCodes.length === 0 ||
    offer.slices.some((slice) =>
      selectedDestinationCodes.includes(slice.destination.iataCode ?? ""),
    )

  return matchesOrigin && matchesDestination
}

function dedupeOffersByItinerary(offers: BookingOffer[]): BookingOffer[] {
  const offerMap = new Map<string, BookingOffer>()

  for (const offer of offers) {
    const key = buildOfferItineraryKey(offer)
    const existingOffer = offerMap.get(key)

    if (!existingOffer) {
      offerMap.set(key, offer)
      continue
    }

    if (parseAmount(offer.totalAmount) < parseAmount(existingOffer.totalAmount)) {
      offerMap.set(key, offer)
    }
  }

  return Array.from(offerMap.values())
}

function parseDurationMinutes(value: string | null): number {
  if (!value) return 0

  const match = value.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?$/)

  if (!match) return 0

  const days = Number(match[1] ?? 0)
  const hours = Number(match[2] ?? 0)
  const minutes = Number(match[3] ?? 0)

  return days * 24 * 60 + hours * 60 + minutes
}

function getOfferDurationMinutes(offer: BookingOffer): number {
  const sliceDuration = offer.slices.reduce(
    (total, slice) => total + parseDurationMinutes(slice.duration),
    0,
  )

  return sliceDuration || parseDurationMinutes(offer.summary.duration)
}

function getOfferMaxStops(offer: BookingOffer): number {
  return Math.max(
    ...offer.slices.map((slice) => slice.stops),
    offer.summary.stops,
    0,
  )
}

function sortOffers(
  offers: BookingOffer[],
  sortMode: SortMode,
): BookingOffer[] {
  return [...offers].sort((a, b) => {
    if (sortMode === "price") {
      return parseAmount(a.totalAmount) - parseAmount(b.totalAmount)
    }

    if (sortMode === "duration") {
      return getOfferDurationMinutes(a) - getOfferDurationMinutes(b)
    }

    const scoreA =
      parseAmount(a.totalAmount) +
      getOfferMaxStops(a) * 75 +
      getOfferDurationMinutes(a) * 0.15

    const scoreB =
      parseAmount(b.totalAmount) +
      getOfferMaxStops(b) * 75 +
      getOfferDurationMinutes(b) * 0.15

    return scoreA - scoreB
  })
}

function getSortLabel(sortMode: SortMode): string {
  if (sortMode === "price") return "Lowest price"
  if (sortMode === "duration") return "Shortest duration"

  return "Recommended"
}

export default function FlightsResultsPreview({
  offers,
  routeTitle,
  passengerCount,
}: FlightsResultsPreviewProps) {
  const uniqueOffers = dedupeOffersByItinerary(offers)
  const [sortMode, setSortMode] = useState<SortMode>("recommended")
  const sortedOffers = sortOffers(uniqueOffers, sortMode)

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [visibleOtherOfferCount, setVisibleOtherOfferCount] = useState(
    INITIAL_VISIBLE_OTHER_OFFERS,
  )
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([])
  const [selectedStops, setSelectedStops] = useState<string[]>([])
  const [selectedAirportFilters, setSelectedAirportFilters] = useState<string[]>([])

  const [selectedTakeoffBands, setSelectedTakeoffBands] = useState<string[]>([])
  const [selectedLandingBands, setSelectedLandingBands] = useState<string[]>([])

  const stopsOptions = getStopsOptions(sortedOffers)
  const airlineOptions = getAirlineOptions(sortedOffers)
  const airlineCountOptions = getFlightAirlineFilterOptions(sortedOffers)
  const airportGroups = getFlightAirportFilterGroups(sortedOffers)

  const filteredOffers = sortedOffers.filter((offer) => {
    const matchesAirline =
      selectedAirlines.length === 0 ||
      selectedAirlines.includes(getAirlineName(offer))

    const matchesStops =
      selectedStops.length === 0 ||
      selectedStops.includes(String(getOfferMaxStops(offer)))

    const matchesTakeoff = offerMatchesTakeoffBands(
      offer,
      selectedTakeoffBands,
    )

    const matchesLanding = offerMatchesLandingBands(
      offer,
      selectedLandingBands,
    )

    const matchesAirports = offerMatchesAirportFilters(
      offer,
      selectedAirportFilters,
    )

    return (
      matchesAirline &&
      matchesStops &&
      matchesTakeoff &&
      matchesLanding &&
      matchesAirports
    )
  })

  const quickChips = getQuickChips(filteredOffers)

  const destinationLabel = getDestinationLabel(
    filteredOffers.length ? filteredOffers : sortedOffers,
    routeTitle,
  )
  const recommendedOffers = filteredOffers.slice(0, RECOMMENDED_OFFER_COUNT)
  const otherOffers = filteredOffers.slice(RECOMMENDED_OFFER_COUNT)
  const visibleOtherOffers = otherOffers.slice(0, visibleOtherOfferCount)
  const hasMoreOtherOffers = visibleOtherOfferCount < otherOffers.length

  return (
    <BookingResultsLayout
      rightRail={<FlightModeAdRail />}
      filters={
        <FlightsFilterPanel
          sortLabel={getSortLabel(sortMode)}
          sortOptions={[
            { label: "Recommended", value: "recommended" },
            { label: "Lowest price", value: "price" },
            { label: "Shortest duration", value: "duration" },
          ]}
          selectedSortValue={sortMode}
          onSelectSort={(value) => setSortMode(value as SortMode)}
          stopsOptions={stopsOptions}
          selectedStops={selectedStops}
          onToggleStop={(value) =>
            setSelectedStops((current) =>
              current.includes(value)
                ? current.filter((stop) => stop !== value)
                : [...current, value],
            )
          }
          onResetStops={() => setSelectedStops([])}
          selectedTakeoffBands={selectedTakeoffBands}
          onToggleTakeoffBand={(value) =>
            setSelectedTakeoffBands((current) =>
              current.includes(value)
                ? current.filter((band) => band !== value)
                : [...current, value],
            )
          }
          onResetTakeoff={() => setSelectedTakeoffBands([])}
          selectedLandingBands={selectedLandingBands}
          onToggleLandingBand={(value) =>
            setSelectedLandingBands((current) =>
              current.includes(value)
                ? current.filter((band) => band !== value)
                : [...current, value],
            )
          }
          onResetLanding={() => setSelectedLandingBands([])}
          airlineOptions={airlineOptions}
          airlineCountOptions={airlineCountOptions}
          selectedAirlines={selectedAirlines}
          onToggleAirline={(value) =>
            setSelectedAirlines((current) =>
              current.includes(value)
                ? current.filter((airline) => airline !== value)
                : [...current, value],
            )
          }
          onSelectAllAirlines={() =>
            setSelectedAirlines(airlineCountOptions.map((option) => option.value))
          }
          onSelectNoAirlines={() => setSelectedAirlines([])}
          airportGroups={airportGroups}
          selectedAirportCodes={selectedAirportFilters}
          onToggleAirportCode={(value) =>
            setSelectedAirportFilters((current) =>
              current.includes(value)
                ? current.filter((airport) => airport !== value)
                : [...current, value],
            )
          }
          onResetAirports={() => setSelectedAirportFilters([])}
        />
      }
    >
      {quickChips.length ? <BookingQuickChips chips={quickChips} /> : null}

      {filteredOffers.length ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <BookingResultsHeader
              title={`Recommended Flights to ${destinationLabel}`}
              subtitle="Based on live fare, timing, stops, and booking convenience."
            />

            {recommendedOffers.map((offer, index) => (
              <FlightResultRow
                key={offer.id}
                offer={offer}
                badge={index === 0 ? "Recommended · Lowest fare" : "Recommended"}
                passengerCount={passengerCount}
                isSelected={selectedOfferId === offer.id}
                onSelect={() => setSelectedOfferId(offer.id)}
              />
            ))}
          </div>

          {otherOffers.length ? (
            <div className="space-y-2 pt-2">
              <div className="px-1">
                <h3 className="text-xl font-bold tracking-tight text-orange-500">
                  Other Flights to {destinationLabel}
                </h3>

                <p className="mt-1 text-sm font-medium leading-5 text-slate-500">
                  More live options for the same route.
                </p>
              </div>

              {visibleOtherOffers.map((offer, index) => {
                const offerIndex = RECOMMENDED_OFFER_COUNT + index

                return (
                  <FlightResultRow
                    key={offer.id}
                    offer={offer}
                    badge={getBadge(offerIndex)}
                    passengerCount={passengerCount}
                    isSelected={selectedOfferId === offer.id}
                    onSelect={() => setSelectedOfferId(offer.id)}
                  />
                )
              })}

              {hasMoreOtherOffers ? (
                <div className="flex justify-center pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleOtherOfferCount((current) =>
                        Math.min(
                          current + VISIBLE_OFFERS_INCREMENT,
                          otherOffers.length,
                        ),
                      )
                    }
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-blue-700 bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
                  >
                    Show 10 more flights
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[1.25rem] border border-slate-200 bg-white px-5 py-6 text-sm font-semibold text-slate-600 shadow-[0_12px_34px_rgba(15,23,42,0.07)]">
          No live offers came back for this search. Try a different date, route,
          or cabin class.
        </div>
      )}
    </BookingResultsLayout>
  )
}

function FlightModeAdRail() {
  return (
    <div className="fixed left-[calc(50%+416px)] top-24 z-30 w-[260px] space-y-4">
      {flightModeAds.map((ad) => (
        <div
          key={ad.id}
          className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${ad.heightClassName}`}
        >
          <div
            aria-label="Advertisement placeholder"
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${ad.imageSrc})`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function FlightSliceSummary({
  slices,
  airlineName,
  airlineCode,
  logoUrl,
}: {
  slices: BookingSlice[]
  airlineName: string
  airlineCode: string
  logoUrl?: string | null
}) {
  return (
    <div className="space-y-3">
      {slices.map((slice, index) => {
        const showDirection = slices.length > 1

        return (
          <div
            key={slice.id}
            className="grid gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_132px] sm:items-start"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="max-h-8 max-w-8 object-contain"
                  />
                ) : (
                  <span className="text-sm font-black text-blue-700">
                    {airlineCode}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {showDirection ? (
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-700">
                      {getSliceDirectionLabel(index, slices.length)}
                    </span>
                  ) : null}

                  <span className="text-base font-black leading-5 text-slate-800">
                    {formatTime(slice.departureTime)} –{" "}
                    {formatTime(slice.arrivalTime)}
                  </span>
                </div>

                <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
                  {getSliceRouteLabel(slice)}{" "}
                  <span className="text-slate-400">
                    ({formatDuration(slice.duration)})
                  </span>
                </p>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  {airlineName}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-sm font-black text-slate-800">
                {getStopsLabel(slice.stops)}
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                {getLayoverLabel(slice)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FlightResultRow({
  offer,
  badge,
  passengerCount,
  isSelected,
  onSelect,
}: {
  offer: BookingOffer
  badge: string
  passengerCount: number
  isSelected: boolean
  onSelect: () => void
}) {
  const airlineName = offer.summary.airlineName || offer.owner.name || "Airline"
  const airlineCode = getAirlineCode(offer)
  const logoUrl =
    offer.summary.airlineLogoSymbolUrl ?? offer.summary.airlineLogoLockupUrl
  const travelerCount = Math.max(1, passengerCount)
  const totalPrice = formatMoney(offer.totalAmount, offer.totalCurrency)
  const perTravelerAmount = parseAmount(offer.totalAmount) / travelerCount
  const primaryPrice =
    travelerCount > 1
      ? formatMoney(String(perTravelerAmount), offer.totalCurrency)
      : totalPrice
  const secondaryPriceLabel =
    travelerCount > 1
      ? `${totalPrice} total for ${travelerCount} travelers`
      : "Total fare"

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`block w-full overflow-hidden rounded-2xl border bg-white text-left shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-4 focus:ring-blue-100 ${isSelected ? "border-blue-300" : "border-slate-200"
        }`}
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_178px]">
        <div className="min-w-0 px-4 py-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-[22px] items-center rounded-full bg-green-50 px-2.5 text-[11px] font-semibold text-green-700">
              {badge}
            </span>
          </div>

          <FlightSliceSummary
            slices={offer.slices}
            airlineName={airlineName}
            airlineCode={airlineCode}
            logoUrl={logoUrl}
          />
        </div>

        <div className="flex min-h-[142px] flex-col items-end border-t border-slate-100 bg-white px-4 py-3 lg:border-l lg:border-t-0">
          <div className="text-right">
            <p className="text-2xl font-black tracking-tight text-slate-800">
              {primaryPrice}
            </p>

            {travelerCount > 1 ? (
              <p className="text-xs font-semibold text-slate-500">per traveler</p>
            ) : null}

            <p className="mt-1 text-xs font-bold leading-4 text-slate-700">
              {secondaryPriceLabel}
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-500">
              {offer.totalCurrency}
            </p>
          </div>

          <FlightIncludedIcons />
        </div>
      </div>
    </button>
  )
}

function FlightIncludedIcons() {
  return (
    <div className="mt-3 flex flex-wrap justify-end gap-1.5">
      <span
        title="Seat selection details available before checkout"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-500"
      >
        💺
      </span>

      <span
        title="Baggage details available before checkout"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[11px] text-blue-700"
      >
        🧳
      </span>

      <span
        title="Fare rules available before checkout"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-100 bg-green-50 text-[11px] text-green-700"
      >
        ✓
      </span>
    </div>
  )
}