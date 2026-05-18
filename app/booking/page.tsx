"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import BookingSearchPanel, {
  type BookingSearchContext,
  type BookingSearchSuccessPayload,
} from "@/components/booking/BookingSearchPanel"
import { getAirportByCode } from "@/lib/airports/major-airports"
import type { BookingOffer, BookingSlice } from "@/lib/booking-api"

type RoundTripStep = "outbound" | "return" | "review"

const OFFERS_PER_PAGE = 10

type StopFilter = "nonstop" | "one_stop" | "two_plus"
type TimeFilter = "morning" | "afternoon" | "evening" | "red_eye"

type AirportFilterMarketGroup = {
  label: string
  airports: string[]
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const AIRPORT_MARKETS: AirportFilterMarketGroup[] = [
  {
    label: "New York",
    airports: ["JFK", "LGA", "EWR", "HPN", "SWF"],
  },
  {
    label: "Miami / South Florida",
    airports: ["MIA", "FLL", "PBI"],
  },
  {
    label: "Boston / New England",
    airports: ["BOS", "MHT", "PVD", "BDL", "ORH"],
  },
  {
    label: "Washington, D.C.",
    airports: ["DCA", "IAD", "BWI"],
  },
  {
    label: "Los Angeles",
    airports: ["LAX", "BUR", "LGB", "ONT", "SNA"],
  },
  {
    label: "San Francisco Bay Area",
    airports: ["SFO", "OAK", "SJC"],
  },
  {
    label: "Chicago",
    airports: ["ORD", "MDW"],
  },
  {
    label: "Dallas / Fort Worth",
    airports: ["DFW", "DAL"],
  },
  {
    label: "Houston",
    airports: ["IAH", "HOU"],
  },
  {
    label: "Orlando / Central Florida",
    airports: ["MCO", "SFB", "DAB", "MLB", "TPA"],
  },
  {
    label: "Tampa Bay",
    airports: ["TPA", "PIE", "SRQ"],
  },
  {
    label: "Seattle / Puget Sound",
    airports: ["SEA", "PAE", "BFI"],
  },
  {
    label: "Phoenix",
    airports: ["PHX", "AZA"],
  },
  {
    label: "Denver / Front Range",
    airports: ["DEN", "COS"],
  },
  {
    label: "Philadelphia / Delaware Valley",
    airports: ["PHL", "ABE", "ACY", "ILG"],
  },
  {
    label: "Detroit / Southeast Michigan",
    airports: ["DTW", "FNT", "LAN"],
  },
  {
    label: "Minneapolis / Twin Cities",
    airports: ["MSP", "RST"],
  },
  {
    label: "Cleveland / Northeast Ohio",
    airports: ["CLE", "CAK"],
  },
  {
    label: "Cincinnati / Northern Kentucky",
    airports: ["CVG", "DAY"],
  },
  {
    label: "Raleigh / Research Triangle",
    airports: ["RDU", "GSO", "FAY"],
  },
  {
    label: "Charlotte / Carolinas",
    airports: ["CLT", "GSP"],
  },
  {
    label: "Nashville / Middle Tennessee",
    airports: ["BNA", "HSV"],
  },
  {
    label: "Austin / Central Texas",
    airports: ["AUS", "SAT"],
  },
  {
    label: "San Antonio",
    airports: ["SAT", "AUS"],
  },
  {
    label: "Portland / Northwest Oregon",
    airports: ["PDX", "EUG"],
  },
  {
    label: "San Diego / Southern California",
    airports: ["SAN", "SNA", "TIJ"],
  },
  {
    label: "Las Vegas",
    airports: ["LAS", "HND"],
  },
  {
    label: "St. Louis",
    airports: ["STL", "BLV"],
  },
  {
    label: "Kansas City",
    airports: ["MCI", "MKC"],
  },
  {
    label: "Milwaukee / Southeast Wisconsin",
    airports: ["MKE", "ORD", "MDW"],
  },
  {
    label: "Indianapolis",
    airports: ["IND", "CVG", "SDF"],
  },
  {
    label: "Pittsburgh",
    airports: ["PIT", "LBE"],
  },
  {
    label: "New Orleans / Gulf Coast",
    airports: ["MSY", "GPT", "BTR"],
  },
  {
    label: "Memphis / Mid-South",
    airports: ["MEM", "LIT"],
  },
  {
    label: "Salt Lake City / Wasatch Front",
    airports: ["SLC", "PVU"],
  },
  {
    label: "Albuquerque / New Mexico",
    airports: ["ABQ", "SAF"],
  },
]

type BookingFilterState = {
  selectedStopFilters: StopFilter[]
  selectedAirlineFilters: string[]
  selectedAirportFilters: string[]
  selectedTimeFilters: TimeFilter[]
  selectedPriceCeiling: number | null
  usAirlinesOnly: boolean
}

export default function BookingPage() {
  const [offers, setOffers] = useState<BookingOffer[]>([])
  const [offerRequestId, setOfferRequestId] = useState<string | null>(null)
  const [liveMode, setLiveMode] = useState<boolean | null>(null)
  const [searchContext, setSearchContext] =
    useState<BookingSearchContext | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(true)
  const [selectedOffer, setSelectedOffer] = useState<BookingOffer | null>(null)
  const [visibleOfferCount, setVisibleOfferCount] = useState(OFFERS_PER_PAGE)
  const [selectedStopFilters, setSelectedStopFilters] = useState<StopFilter[]>([])
  const [selectedAirlineFilters, setSelectedAirlineFilters] = useState<string[]>([])
  const [selectedAirportFilters, setSelectedAirportFilters] = useState<string[]>([])
  const [selectedTimeFilters, setSelectedTimeFilters] = useState<TimeFilter[]>([])
  const [selectedPriceCeiling, setSelectedPriceCeiling] = useState<number | null>(
    null
  )
  const [usAirlinesOnly, setUsAirlinesOnly] = useState(false)

  const [roundTripStep, setRoundTripStep] =
    useState<RoundTripStep>("outbound")
  const [selectedOutboundKey, setSelectedOutboundKey] = useState<string | null>(
    null
  )
  const [selectedRoundTripOffer, setSelectedRoundTripOffer] =
    useState<BookingOffer | null>(null)

  useEffect(() => {
    const originalBackground = document.body.style.background
    const originalBackgroundColor = document.body.style.backgroundColor

    document.body.style.background = "rgb(248 250 252)"
    document.body.style.backgroundColor = "rgb(248 250 252)"

    return () => {
      document.body.style.background = originalBackground
      document.body.style.backgroundColor = originalBackgroundColor
    }
  }, [])

  const sortedOffers = useMemo(() => {
    return [...offers].sort(
      (a, b) => Number(a.totalAmount) - Number(b.totalAmount)
    )
  }, [offers])

  const filteredStandardOffers = useMemo(() => {
    return getFilteredOffers(sortedOffers, {
      selectedStopFilters,
      selectedAirlineFilters,
      selectedAirportFilters,
      selectedTimeFilters,
      selectedPriceCeiling,
      usAirlinesOnly,
    })
  }, [
    selectedAirlineFilters,
    selectedAirportFilters,
    selectedPriceCeiling,
    selectedStopFilters,
    selectedTimeFilters,
    sortedOffers,
    usAirlinesOnly,
  ])

  useEffect(() => {
    setVisibleOfferCount(OFFERS_PER_PAGE)
  }, [
    selectedAirlineFilters,
    selectedAirportFilters,
    selectedPriceCeiling,
    selectedStopFilters,
    selectedTimeFilters,
    usAirlinesOnly,
  ])

  const outboundOptions = useMemo(() => {
    const map = new Map<string, BookingOffer>()

    for (const offer of sortedOffers) {
      const outboundSlice = offer.slices[0]
      if (!outboundSlice) continue

      const key = getSliceKey(outboundSlice)

      if (!map.has(key)) {
        map.set(key, offer)
      }
    }

    return Array.from(map.entries()).map(([key, offer]) => ({
      key,
      offer,
      slice: offer.slices[0],
    }))
  }, [sortedOffers])

  const returnOptions = useMemo(() => {
    if (!selectedOutboundKey) return []

    return sortedOffers
      .filter((offer) => {
        const outboundSlice = offer.slices[0]
        return outboundSlice && getSliceKey(outboundSlice) === selectedOutboundKey
      })
      .filter((offer) => offer.slices[1])
      .map((offer) => ({
        offer,
        slice: offer.slices[1],
      }))
  }, [selectedOutboundKey, sortedOffers])

  function handleSearchStart() {
    setIsSearching(true)
    setVisibleOfferCount(OFFERS_PER_PAGE)
    setSelectedStopFilters([])
    setSelectedAirlineFilters([])
    setSelectedAirportFilters([])
    setSelectedTimeFilters([])
    setSelectedPriceCeiling(null)
    setUsAirlinesOnly(false)
    setHasSearched(false)
    setError(null)
    setOffers([])
    setOfferRequestId(null)
    setLiveMode(null)
    setSearchContext(null)
    setSelectedOffer(null)
    setRoundTripStep("outbound")
    setSelectedOutboundKey(null)
    setSelectedRoundTripOffer(null)
  }

  function handleSearchSuccess(payload: BookingSearchSuccessPayload) {
    setIsSearching(false)
    setMobileSearchExpanded(false)
    setVisibleOfferCount(OFFERS_PER_PAGE)
    setSelectedStopFilters([])
    setSelectedAirlineFilters([])
    setSelectedAirportFilters([])
    setSelectedTimeFilters([])
    setSelectedPriceCeiling(null)
    setUsAirlinesOnly(false)
    setOffers(payload.offers)
    setOfferRequestId(payload.offerRequestId)
    setLiveMode(payload.liveMode)
    setSearchContext(payload.context)
    setHasSearched(true)
    setError(null)
    setSelectedOffer(null)
    setRoundTripStep("outbound")
    setSelectedOutboundKey(null)
    setSelectedRoundTripOffer(null)
  }

  function handleSearchError(message: string) {
    setIsSearching(false)
    setVisibleOfferCount(OFFERS_PER_PAGE)
    setSelectedStopFilters([])
    setSelectedAirlineFilters([])
    setSelectedAirportFilters([])
    setSelectedTimeFilters([])
    setSelectedPriceCeiling(null)
    setUsAirlinesOnly(false)
    setError(message)
    setOffers([])
    setOfferRequestId(null)
    setLiveMode(null)
    setHasSearched(true)
    setSelectedOffer(null)
    setRoundTripStep("outbound")
    setSelectedOutboundKey(null)
    setSelectedRoundTripOffer(null)
  }

  const isRoundTripSearch =
    searchContext?.tripType === "round_trip" && sortedOffers.length > 0

  const visibleStandardOffers = filteredStandardOffers.slice(0, visibleOfferCount)
  const hasMoreStandardOffers =
    visibleOfferCount < filteredStandardOffers.length
  const visibleOfferEnd = Math.min(
    visibleOfferCount,
    filteredStandardOffers.length
  )

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-28 text-slate-950 sm:pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.10),transparent_42%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12">
        <div className="mx-auto hidden max-w-5xl text-center sm:block">

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-5xl text-5xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:mt-8 sm:text-6xl md:text-7xl"
          >
            Search flights with less noise and more clarity.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl"
          >
            Compare live flight offers in a cleaner booking experience designed
            around route context, timing, and smarter trip decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.58, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <SlimPill label="Live offer search" />
            <SlimPill label="One-way, round-trip, multi-city" />
            <SlimPill label="Skysirv intelligence layer" />
          </motion.div>
        </div>

        <div className="mx-auto mb-5 max-w-3xl px-1 text-center sm:hidden">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950">
            Search flights with less noise and more clarity.
          </h1>
        </div>

        {hasSearched && searchContext ? (
          <MobileSearchSummary
            searchContext={searchContext}
            onEdit={() => setMobileSearchExpanded(true)}
          />
        ) : null}

        <div className={hasSearched && !mobileSearchExpanded ? "hidden sm:block" : ""}>
          <BookingSearchPanel
            onSearchStart={handleSearchStart}
            onSearchSuccess={handleSearchSuccess}
            onSearchError={handleSearchError}
          />
        </div>

        {error ? (
          <div className="mx-auto mt-5 max-w-6xl">
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
              {error}
            </p>
          </div>
        ) : null}

        {isRoundTripSearch ? (
          <RoundTripResults
            routeTitle={searchContext?.routeTitle ?? "Round-trip search"}
            liveMode={liveMode}
            offerRequestId={offerRequestId}
            step={roundTripStep}
            outboundOptions={outboundOptions}
            returnOptions={returnOptions}
            selectedOutboundKey={selectedOutboundKey}
            selectedOffer={selectedRoundTripOffer}
            onSelectOutbound={(key) => {
              setSelectedOutboundKey(key)
              setSelectedRoundTripOffer(null)
              setRoundTripStep("return")
            }}
            onBackToOutbound={() => {
              setSelectedOutboundKey(null)
              setSelectedRoundTripOffer(null)
              setRoundTripStep("outbound")
            }}
            onSelectReturn={(offer) => {
              setSelectedRoundTripOffer(offer)
              setRoundTripStep("review")
            }}
            onBackToReturn={() => {
              setSelectedRoundTripOffer(null)
              setRoundTripStep("return")
            }}
            onViewDetails={(offer) => setSelectedOffer(offer)}
          />
        ) : sortedOffers.length > 0 ? (
          <>
            <StandardResults
              title={
                filteredStandardOffers.length === sortedOffers.length
                  ? `${sortedOffers.length} offers found`
                  : `${filteredStandardOffers.length} of ${sortedOffers.length} offers match`
              }
              routeTitle={searchContext?.routeTitle ?? "Search results"}
              liveMode={liveMode}
              offerRequestId={offerRequestId}
              offers={visibleStandardOffers}
              allOffers={sortedOffers}
              selectedStopFilters={selectedStopFilters}
              selectedAirlineFilters={selectedAirlineFilters}
              selectedAirportFilters={selectedAirportFilters}
              selectedTimeFilters={selectedTimeFilters}
              selectedPriceCeiling={selectedPriceCeiling}
              usAirlinesOnly={usAirlinesOnly}
              onToggleStopFilter={(filter) =>
                setSelectedStopFilters((current) => toggleFilterValue(current, filter))
              }
              onToggleAirlineFilter={(airline) =>
                setSelectedAirlineFilters((current) => toggleFilterValue(current, airline))
              }
              onToggleAirportFilter={(airportCode) =>
                setSelectedAirportFilters((current) =>
                  toggleFilterValue(current, airportCode)
                )
              }
              onToggleTimeFilter={(filter) =>
                setSelectedTimeFilters((current) => toggleFilterValue(current, filter))
              }
              onSelectPriceCeiling={(ceiling) =>
                setSelectedPriceCeiling((current) => (current === ceiling ? null : ceiling))
              }
              onToggleUsAirlinesOnly={() => setUsAirlinesOnly((current) => !current)}
              onClearFilters={() => {
                setSelectedStopFilters([])
                setSelectedAirlineFilters([])
                setSelectedAirportFilters([])
                setSelectedTimeFilters([])
                setSelectedPriceCeiling(null)
                setUsAirlinesOnly(false)
              }}
              onViewDetails={setSelectedOffer}
            />

            <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center gap-3">
              <p className="text-xs font-medium text-slate-500">
                Showing {visibleOfferEnd} of {filteredStandardOffers.length} offers
              </p>

              {hasMoreStandardOffers ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleOfferCount((current) =>
                      Math.min(current + OFFERS_PER_PAGE, filteredStandardOffers.length)
                    )
                  }
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  Show 10 more
                </button>
              ) : null}
            </div>
          </>
        ) : hasSearched && !error ? (
          <div className="mx-auto mt-10 max-w-6xl">
            <p className="text-sm leading-6 text-slate-500">
              No matching offers were returned for this search. Try another
              date, route, or stop preference.
            </p>
          </div>
        ) : null}

        <section className="mx-auto mt-20 max-w-6xl border-t border-slate-200 pt-14">
          <div className="grid gap-10 text-center lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Why Skysirv Booking
              </p>
              <h2 className="mx-auto mt-3 max-w-xl text-4xl font-bold tracking-tight text-slate-950 lg:mx-0">
                Flight search with the intelligence layer close by.
              </h2>
            </div>

            <div className="space-y-7 text-base leading-8 text-slate-600">
              <p>
                Skysirv Booking is designed to bring flight discovery, route
                context, and fare decision support into one cleaner experience.
                The goal is not to overwhelm travelers with endless noise, but
                to make each option easier to compare and act on.
              </p>

              <p>
                Live search is the foundation. From here, Skysirv can connect
                booking results with monitored routes, fare behavior, Lucy
                explanations, and timing signals so travelers understand more
                before they move.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-10">
          <BookingFooter />
        </div>
      </div>

      {isSearching ? <BookingSearchLoadingOverlay /> : null}

      {selectedOffer ? (
        <OfferDetailsModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      ) : null}
    </section>
  )
}

function StandardResults({
  title,
  routeTitle,
  offerRequestId,
  liveMode,
  offers,
  allOffers,
  selectedStopFilters,
  selectedAirlineFilters,
  selectedAirportFilters,
  selectedTimeFilters,
  selectedPriceCeiling,
  usAirlinesOnly,
  onToggleStopFilter,
  onToggleAirlineFilter,
  onToggleAirportFilter,
  onToggleTimeFilter,
  onSelectPriceCeiling,
  onToggleUsAirlinesOnly,
  onClearFilters,
  onViewDetails,
}: {
  title: string
  routeTitle: string
  offerRequestId: string | null
  liveMode: boolean | null
  offers: BookingOffer[]
  allOffers: BookingOffer[]
  selectedStopFilters: StopFilter[]
  selectedAirlineFilters: string[]
  selectedAirportFilters: string[]
  selectedTimeFilters: TimeFilter[]
  selectedPriceCeiling: number | null
  usAirlinesOnly: boolean
  onToggleStopFilter: (filter: StopFilter) => void
  onToggleAirlineFilter: (airline: string) => void
  onToggleAirportFilter: (airportCode: string) => void
  onToggleTimeFilter: (filter: TimeFilter) => void
  onSelectPriceCeiling: (ceiling: number) => void
  onToggleUsAirlinesOnly: () => void
  onClearFilters: () => void
  onViewDetails: (offer: BookingOffer) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto mt-12 max-w-7xl"
    >
      <ResultsHeader
        eyebrow="Search results"
        title={title}
        routeTitle={routeTitle}
        offerRequestId={offerRequestId}
        liveMode={liveMode}
      />

      <div className="mt-4 lg:hidden">
        <MobileBookingFilterRail
          selectedStopFilters={selectedStopFilters}
          selectedTimeFilters={selectedTimeFilters}
          selectedPriceCeiling={selectedPriceCeiling}
          usAirlinesOnly={usAirlinesOnly}
          onToggleStopFilter={onToggleStopFilter}
          onToggleTimeFilter={onToggleTimeFilter}
          onSelectPriceCeiling={onSelectPriceCeiling}
          onToggleUsAirlinesOnly={onToggleUsAirlinesOnly}
          onClearFilters={onClearFilters}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)_250px] lg:items-start">
        <BookingResultsSidebar
          routeTitle={routeTitle}
          offers={allOffers}
          selectedStopFilters={selectedStopFilters}
          selectedAirlineFilters={selectedAirlineFilters}
          selectedAirportFilters={selectedAirportFilters}
          selectedTimeFilters={selectedTimeFilters}
          selectedPriceCeiling={selectedPriceCeiling}
          usAirlinesOnly={usAirlinesOnly}
          onToggleStopFilter={onToggleStopFilter}
          onToggleAirlineFilter={onToggleAirlineFilter}
          onToggleAirportFilter={onToggleAirportFilter}
          onToggleTimeFilter={onToggleTimeFilter}
          onSelectPriceCeiling={onSelectPriceCeiling}
          onToggleUsAirlinesOnly={onToggleUsAirlinesOnly}
          onClearFilters={onClearFilters}
        />

        <div className="min-w-0">
          <div className="grid gap-2 sm:gap-3">
            {offers.map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                index={index}
                onViewDetails={() => onViewDetails(offer)}
              />
            ))}
          </div>
        </div>

        <BookingSponsorRail />
      </div>
    </motion.div>
  )
}

function MobileSearchSummary({
  searchContext,
  onEdit,
}: {
  searchContext: BookingSearchContext
  onEdit: () => void
}) {
  const dateLabel =
    searchContext.departureDate ??
    searchContext.legs?.[0]?.departureDate ??
    "Date"

  return (
    <div className="mx-auto mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-950">
            {searchContext.routeTitle}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {dateLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

function BookingResultsSidebar({
  routeTitle,
  offers,
  selectedStopFilters,
  selectedAirlineFilters,
  selectedAirportFilters,
  selectedTimeFilters,
  selectedPriceCeiling,
  usAirlinesOnly,
  onToggleStopFilter,
  onToggleAirlineFilter,
  onToggleAirportFilter,
  onToggleTimeFilter,
  onSelectPriceCeiling,
  onToggleUsAirlinesOnly,
  onClearFilters,
}: {
  routeTitle: string
  offers: BookingOffer[]
  selectedStopFilters: StopFilter[]
  selectedAirlineFilters: string[]
  selectedAirportFilters: string[]
  selectedTimeFilters: TimeFilter[]
  selectedPriceCeiling: number | null
  usAirlinesOnly: boolean
  onToggleStopFilter: (filter: StopFilter) => void
  onToggleAirlineFilter: (airline: string) => void
  onToggleAirportFilter: (airportCode: string) => void
  onToggleTimeFilter: (filter: TimeFilter) => void
  onSelectPriceCeiling: (ceiling: number) => void
  onToggleUsAirlinesOnly: () => void
  onClearFilters: () => void
}) {
  const cheapestOffer = offers.reduce<BookingOffer | null>((best, offer) => {
    if (!best) return offer

    return Number(offer.totalAmount) < Number(best.totalAmount) ? offer : best
  }, null)

  const airlineNames = Array.from(
    new Set(
      offers
        .map((offer) => offer.summary.airlineName)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b))

  const searchEndpointAirportCodes = getSearchEndpointAirportCodes(offers)
  const airportMarketGroups = getAirportFilterMarketGroups(
    searchEndpointAirportCodes
  )
  const airportDisplayByCode = getAirportDisplayMap(offers, airportMarketGroups)

  const hasActiveFilters =
    selectedStopFilters.length > 0 ||
    selectedAirlineFilters.length > 0 ||
    selectedAirportFilters.length > 0 ||
    selectedTimeFilters.length > 0 ||
    selectedPriceCeiling != null ||
    usAirlinesOnly

  const currentFilterState: BookingFilterState = {
    selectedStopFilters,
    selectedAirlineFilters,
    selectedAirportFilters,
    selectedTimeFilters,
    selectedPriceCeiling,
    usAirlinesOnly,
  }

  function getCandidateOffers(overrides: Partial<BookingFilterState>) {
    return getFilteredOffers(offers, {
      ...currentFilterState,
      ...overrides,
    })
  }

  function getStopCandidateOffers(filter: StopFilter) {
    return getCandidateOffers({
      selectedStopFilters: getToggledFilterValues(selectedStopFilters, filter),
    })
  }

  function getAirlineCandidateOffers(airline: string) {
    return getCandidateOffers({
      selectedAirlineFilters: getToggledFilterValues(
        selectedAirlineFilters,
        airline
      ),
    })
  }

  function getAirportCandidateOffers(airportCode: string) {
    return getCandidateOffers({
      selectedAirportFilters: getToggledFilterValues(
        selectedAirportFilters,
        airportCode
      ),
    })
  }

  function getTimeCandidateOffers(filter: TimeFilter) {
    return getCandidateOffers({
      selectedTimeFilters: getToggledFilterValues(selectedTimeFilters, filter),
    })
  }

  function getPriceCandidateOffers(priceCeiling: number) {
    return getCandidateOffers({
      selectedPriceCeiling:
        selectedPriceCeiling === priceCeiling ? null : priceCeiling,
    })
  }

  function isDisabledOption(isSelected: boolean, candidateOffers: BookingOffer[]) {
    return !isSelected && candidateOffers.length === 0
  }

  return (
    <aside className="hidden space-y-4 lg:block">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-emerald-700 shadow-sm">
            ↗
          </span>

          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Book with context
            </p>
            <p className="mt-1 text-xs leading-5 text-emerald-800">
              Compare live fares, then save or monitor the route from your
              Skysirv dashboard.
            </p>
          </div>
        </div>

        {cheapestOffer ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-white px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Lowest visible fare
            </p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              {formatMoney(cheapestOffer.totalAmount, cheapestOffer.totalCurrency)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Ask Lucy</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Ask for nonstop flights, cheaper options, or whether this route is
              worth monitoring.
            </p>
          </div>

          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
            L
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <p className="text-xs leading-5 text-slate-500">
            Try: “Show me nonstop flights under $300.”
          </p>
        </div>

        <button
          type="button"
          className="mt-3 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Open Lucy
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-950">Filters</p>
            <p className="mt-1 text-xs text-slate-500">
              Refine live offers without losing your search.
            </p>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="shrink-0 text-xs font-semibold text-cyan-700 transition hover:text-cyan-900"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="mt-4 space-y-5">
          <FilterGroup title="Stops">
            {(["nonstop", "one_stop", "two_plus"] as StopFilter[]).map((filter) => {
              const candidateOffers = getStopCandidateOffers(filter)
              const isSelected = selectedStopFilters.includes(filter)

              return (
                <FilterCheckbox
                  key={filter}
                  label={
                    filter === "nonstop"
                      ? "Nonstop"
                      : filter === "one_stop"
                        ? "1 stop"
                        : "2+ stops"
                  }
                  valueLabel={getLowestPriceLabel(candidateOffers)}
                  checked={isSelected}
                  disabled={isDisabledOption(isSelected, candidateOffers)}
                  onChange={() => onToggleStopFilter(filter)}
                />
              )
            })}
          </FilterGroup>

          <FilterGroup title="Price">
            {[150, 250, 400].map((priceCeiling) => {
              const candidateOffers = getPriceCandidateOffers(priceCeiling)
              const isSelected = selectedPriceCeiling === priceCeiling

              return (
                <FilterButton
                  key={priceCeiling}
                  label={`Under $${priceCeiling}`}
                  active={isSelected}
                  disabled={isDisabledOption(isSelected, candidateOffers)}
                  onClick={() => onSelectPriceCeiling(priceCeiling)}
                />
              )
            })}
          </FilterGroup>

          <FilterGroup title="Times">
            {(
              [
                ["morning", "Morning", "5a–11a"],
                ["afternoon", "Afternoon", "11a–5p"],
                ["evening", "Evening", "5p–10p"],
                ["red_eye", "Red-eye", "10p–5a"],
              ] as Array<[TimeFilter, string, string]>
            ).map(([filter, label, valueLabel]) => {
              const candidateOffers = getTimeCandidateOffers(filter)
              const isSelected = selectedTimeFilters.includes(filter)

              return (
                <FilterCheckbox
                  key={filter}
                  label={label}
                  valueLabel={valueLabel}
                  checked={isSelected}
                  disabled={isDisabledOption(isSelected, candidateOffers)}
                  onChange={() => onToggleTimeFilter(filter)}
                />
              )
            })}
          </FilterGroup>

          <FilterGroup title="Airlines">
            {airlineNames.length > 0 ? (
              airlineNames.slice(0, 10).map((airline) => {
                const candidateOffers = getAirlineCandidateOffers(airline)
                const isSelected = selectedAirlineFilters.includes(airline)

                return (
                  <FilterCheckbox
                    key={airline}
                    label={airline}
                    valueLabel={getLowestPriceLabel(candidateOffers)}
                    checked={isSelected}
                    disabled={isDisabledOption(isSelected, candidateOffers)}
                    onChange={() => onToggleAirlineFilter(airline)}
                  />
                )
              })
            ) : (
              <FilterRow label="Airlines building" value="—" />
            )}
          </FilterGroup>

          <FilterGroup title="Airports">
            {airportMarketGroups.length > 0 ? (
              <div className="space-y-4">
                {airportMarketGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-sm font-semibold text-slate-950">
                      {group.label}
                    </p>

                    <div className="mt-2 space-y-2">
                      {group.airports.map((airportCode) => {
                        const candidateOffers = getAirportCandidateOffers(airportCode)
                        const isSelected = selectedAirportFilters.includes(airportCode)

                        return (
                          <FilterCheckbox
                            key={`${group.label}-${airportCode}`}
                            label={airportDisplayByCode[airportCode] ?? airportCode}
                            valueLabel={getLowestPriceLabel(candidateOffers)}
                            checked={isSelected}
                            disabled={isDisabledOption(isSelected, candidateOffers)}
                            onChange={() => onToggleAirportFilter(airportCode)}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <FilterRow label="Airports building" value="—" />
            )}
          </FilterGroup>

          <FilterGroup title="Flight quality">
            {(() => {
              const candidateOffers = getCandidateOffers({
                usAirlinesOnly: !usAirlinesOnly,
              })

              return (
                <FilterCheckbox
                  label="US airlines only"
                  valueLabel="Filter"
                  checked={usAirlinesOnly}
                  disabled={isDisabledOption(usAirlinesOnly, candidateOffers)}
                  onChange={onToggleUsAirlinesOnly}
                />
              )
            })()}
          </FilterGroup>

          <FilterGroup title="Route">
            <FilterRow label={routeTitle} value="Active" />
          </FilterGroup>
        </div>
      </div>
    </aside>
  )
}

function MobileBookingFilterRail({
  selectedStopFilters,
  selectedTimeFilters,
  selectedPriceCeiling,
  usAirlinesOnly,
  onToggleStopFilter,
  onToggleTimeFilter,
  onSelectPriceCeiling,
  onToggleUsAirlinesOnly,
  onClearFilters,
}: {
  selectedStopFilters: StopFilter[]
  selectedTimeFilters: TimeFilter[]
  selectedPriceCeiling: number | null
  usAirlinesOnly: boolean
  onToggleStopFilter: (filter: StopFilter) => void
  onToggleTimeFilter: (filter: TimeFilter) => void
  onSelectPriceCeiling: (ceiling: number) => void
  onToggleUsAirlinesOnly: () => void
  onClearFilters: () => void
}) {
  const hasActiveFilters =
    selectedStopFilters.length > 0 ||
    selectedTimeFilters.length > 0 ||
    selectedPriceCeiling != null ||
    usAirlinesOnly

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-2">
      <div className="flex w-max items-center gap-2">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm"
          >
            Clear
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => onToggleStopFilter("nonstop")}
          className={mobileFilterPillClass(selectedStopFilters.includes("nonstop"))}
        >
          Nonstop
        </button>

        <button
          type="button"
          onClick={() => onToggleStopFilter("one_stop")}
          className={mobileFilterPillClass(selectedStopFilters.includes("one_stop"))}
        >
          1 stop
        </button>

        {[150, 250, 400].map((price) => (
          <button
            key={price}
            type="button"
            onClick={() => onSelectPriceCeiling(price)}
            className={mobileFilterPillClass(selectedPriceCeiling === price)}
          >
            Under ${price}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onToggleTimeFilter("morning")}
          className={mobileFilterPillClass(selectedTimeFilters.includes("morning"))}
        >
          Morning
        </button>

        <button
          type="button"
          onClick={() => onToggleTimeFilter("afternoon")}
          className={mobileFilterPillClass(selectedTimeFilters.includes("afternoon"))}
        >
          Afternoon
        </button>

        <button
          type="button"
          onClick={() => onToggleTimeFilter("evening")}
          className={mobileFilterPillClass(selectedTimeFilters.includes("evening"))}
        >
          Evening
        </button>

        <button
          type="button"
          onClick={onToggleUsAirlinesOnly}
          className={mobileFilterPillClass(usAirlinesOnly)}
        >
          US airlines
        </button>
      </div>
    </div>
  )
}

function mobileFilterPillClass(active: boolean) {
  return cn(
    "inline-flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold shadow-sm transition",
    active
      ? "border-slate-950 bg-slate-950 text-white"
      : "border-slate-200 bg-white text-slate-700"
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>

      <div className="mt-2 space-y-2">{children}</div>
    </div>
  )
}

function FilterRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="min-w-0 truncate text-slate-600">{label}</span>
      <span className="shrink-0 text-xs font-semibold text-slate-400">
        {value}
      </span>
    </div>
  )
}

function FilterCheckbox({
  label,
  valueLabel,
  checked,
  disabled = false,
  onChange,
}: {
  label: string
  valueLabel: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <label
      className={`flex items-center justify-between gap-3 text-sm ${disabled
        ? "cursor-not-allowed opacity-40"
        : "cursor-pointer"
        }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 disabled:cursor-not-allowed"
        />
        <span className="min-w-0 truncate text-slate-600">{label}</span>
      </span>

      <span className="shrink-0 text-xs font-semibold text-slate-400">
        {valueLabel}
      </span>
    </label>
  )
}

function FilterButton({
  label,
  active,
  disabled = false,
  onClick,
}: {
  label: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`mr-2 mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold transition ${disabled
        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
        : active
          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50"
        }`}
    >
      {label}
    </button>
  )
}

function BookingSponsorRail() {
  return (
    <aside className="hidden space-y-4 xl:block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Sponsored
        </p>

        <h3 className="mt-3 text-lg font-bold leading-6 text-slate-950">
          Partner placement
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Premium travel, card, lounge, hotel, or insurance offers can live here.
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
        >
          Learn more
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Skysirv Intelligence
        </p>

        <h3 className="mt-3 text-lg font-bold leading-6">
          Track this route after search.
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Save the route to monitor future price movement and booking signals.
        </p>
      </div>
    </aside>
  )
}

function RoundTripResults({
  routeTitle,
  offerRequestId,
  liveMode,
  step,
  outboundOptions,
  returnOptions,
  selectedOutboundKey,
  selectedOffer,
  onSelectOutbound,
  onBackToOutbound,
  onSelectReturn,
  onBackToReturn,
  onViewDetails,
}: {
  routeTitle: string
  offerRequestId: string | null
  liveMode: boolean | null
  step: RoundTripStep
  outboundOptions: {
    key: string
    offer: BookingOffer
    slice: BookingSlice
  }[]
  returnOptions: {
    offer: BookingOffer
    slice: BookingSlice
  }[]
  selectedOutboundKey: string | null
  selectedOffer: BookingOffer | null
  onSelectOutbound: (key: string) => void
  onBackToOutbound: () => void
  onSelectReturn: (offer: BookingOffer) => void
  onBackToReturn: () => void
  onViewDetails: (offer: BookingOffer) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto mt-12 max-w-6xl"
    >
      <ResultsHeader
        eyebrow="Round-trip search"
        title={
          step === "outbound"
            ? "Step 1 of 3 · Choose your outbound flight"
            : step === "return"
              ? "Step 2 of 3 · Choose your return flight"
              : "Step 3 of 3 · Review your trip"
        }
        routeTitle={routeTitle}
        offerRequestId={offerRequestId}
        liveMode={liveMode}
      />

      {step === "outbound" ? (
        <>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">
            Select the outbound flight that works best for your trip. You will
            choose a compatible return flight next.
          </p>

          <div className="mt-5 grid gap-4">
            {outboundOptions.map((option, index) => (
              <SliceChoiceCard
                key={option.key}
                index={index}
                slice={option.slice}
                priceLabel={`From ${formatMoney(option.offer.totalAmount, option.offer.totalCurrency)}`}
                buttonLabel="Choose outbound"
                onSelect={() => onSelectOutbound(option.key)}
              />
            ))}
          </div>
        </>
      ) : null}

      {step === "return" ? (
        <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-slate-500">
              These return options are compatible with the outbound flight you
              selected. Choose one to review the full trip price.
            </p>

            <button
              type="button"
              onClick={onBackToOutbound}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              Change outbound
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {returnOptions.map((option, index) => (
              <SliceChoiceCard
                key={option.offer.id}
                index={index}
                slice={option.slice}
                priceLabel={formatMoney(
                  option.offer.totalAmount,
                  option.offer.totalCurrency
                )}
                buttonLabel="Choose return"
                onSelect={() => onSelectReturn(option.offer)}
              />
            ))}
          </div>
        </>
      ) : null}

      {step === "review" && selectedOffer ? (
        <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Total trip price
              </p>

              <h3 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                {formatMoney(
                  selectedOffer.totalAmount,
                  selectedOffer.totalCurrency
                )}
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                This is the full round-trip fare for the outbound and return
                flights selected below. Passenger checkout is coming next.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onBackToReturn}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Change return
              </button>

              <button
                type="button"
                onClick={() => onViewDetails(selectedOffer)}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View details
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {selectedOffer.slices.map((slice, index) => (
              <SliceSummaryBlock
                key={slice.id}
                label={index === 0 ? "Outbound" : "Return"}
                slice={slice}
              />
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}

function ResultsHeader({
  eyebrow,
  title,
  routeTitle,
  offerRequestId,
  liveMode,
}: {
  eyebrow: string
  title: string
  routeTitle: string
  offerRequestId: string | null
  liveMode: boolean | null
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{routeTitle}</p>
      </div>
    </div>
  )
}

function OfferCard({
  offer,
  index,
  onViewDetails,
}: {
  offer: BookingOffer
  index: number
  onViewDetails: () => void
}) {
  const firstSlice = offer.slices[0]
  const firstSegment = firstSlice?.segments[0]
  const lastSegment = firstSlice?.segments[firstSlice.segments.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.025, duration: 0.28, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-sky-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-4"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px] md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-950">
              {offer.summary.airlineName || firstSegment?.airlineName || "Flight"}
            </p>

            {firstSlice ? (
              <>
                <InlinePill
                  label={
                    firstSlice.stops === 0
                      ? "Nonstop"
                      : `${firstSlice.stops} stop${firstSlice.stops > 1 ? "s" : ""}`
                  }
                />
                <InlinePill label={formatDuration(firstSlice.duration)} />
              </>
            ) : null}

            {offer.owner.name ? <InlinePill label={offer.owner.name} /> : null}
          </div>

          <div className="mt-3 grid grid-cols-2 items-start gap-3 sm:mt-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
            <FlightTimeBlock
              code={firstSlice?.origin.iataCode ?? firstSegment?.origin.iataCode}
              city={firstSlice?.origin.cityName ?? firstSegment?.origin.cityName}
              time={firstSlice?.departureTime ?? firstSegment?.departingAt}
            />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-sky-400 to-slate-200" />
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                {firstSegment?.airlineIataCode}
                {firstSegment?.flightNumber ? ` ${firstSegment.flightNumber}` : ""}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-indigo-400 to-slate-200" />
            </div>

            <FlightTimeBlock
              alignRight
              code={firstSlice?.destination.iataCode ?? lastSegment?.destination.iataCode}
              city={firstSlice?.destination.cityName ?? lastSegment?.destination.cityName}
              time={firstSlice?.arrivalTime ?? lastSegment?.arrivingAt}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 md:flex-col md:items-stretch md:rounded-2xl md:p-4 md:text-right">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Total fare
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              {formatMoney(offer.totalAmount, offer.totalCurrency)}
            </p>
          </div>

          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:px-4 sm:text-sm"
          >
            View details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SliceChoiceCard({
  slice,
  index,
  priceLabel,
  buttonLabel,
  onSelect,
}: {
  slice: BookingSlice
  index: number
  priceLabel: string
  buttonLabel: string
  onSelect: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.35, ease: "easeOut" }}
      className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition hover:border-sky-200"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <SliceSummaryBlock label="Flight option" slice={slice} />

        <div className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-slate-50 p-4 lg:min-w-[15rem] lg:flex-col lg:items-stretch">
          <div className="lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Trip fare
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              {priceLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onSelect}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SliceSummaryBlock({
  label,
  slice,
}: {
  label: string
  slice: BookingSlice
}) {
  const firstSegment = slice.segments[0]
  const lastSegment = slice.segments[slice.segments.length - 1]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-base font-semibold text-slate-950">{label}</p>

        <InlinePill
          label={
            slice.stops === 0
              ? "Nonstop"
              : `${slice.stops} stop${slice.stops > 1 ? "s" : ""}`
          }
        />

        <InlinePill label={formatDuration(slice.duration)} />

        {firstSegment?.airlineName ? (
          <InlinePill label={firstSegment.airlineName} />
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 items-start gap-3 md:mt-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <FlightTimeBlock
          code={slice.origin.iataCode ?? firstSegment?.origin.iataCode}
          city={slice.origin.cityName ?? firstSegment?.origin.cityName}
          time={slice.departureTime ?? firstSegment?.departingAt}
        />

        <div className="hidden items-center gap-3 md:flex">
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-sky-400 to-slate-200" />
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
            {firstSegment?.airlineIataCode}
            {firstSegment?.flightNumber ? ` ${firstSegment.flightNumber}` : ""}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-200 via-indigo-400 to-slate-200" />
        </div>

        <FlightTimeBlock
          alignRight
          code={slice.destination.iataCode ?? lastSegment?.destination.iataCode}
          city={slice.destination.cityName ?? lastSegment?.destination.cityName}
          time={slice.arrivalTime ?? lastSegment?.arrivingAt}
        />
      </div>
    </div>
  )
}

function BookingSearchLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/18 px-4 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-28 w-28">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute left-1/2 top-[8px] -translate-x-1/2">
              <span className="block text-[34px] leading-none text-slate-950">
                ✈
              </span>
            </div>
          </motion.div>
        </div>

        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-3 text-lg font-semibold tracking-tight text-slate-950"
        >
          Searching for flights...
        </motion.p>
      </div>
    </div>
  )
}

function OfferDetailsModal({
  offer,
  onClose,
}: {
  offer: BookingOffer
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="max-h-[86vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.25)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Offer details
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              {offer.owner.name ?? offer.summary.airlineName}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {formatMoney(offer.totalAmount, offer.totalCurrency)} total fare
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
            aria-label="Close offer details"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {offer.slices.map((slice, sliceIndex) => (
            <div
              key={slice.id}
              className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
            >
              <SliceSummaryBlock
                label={`Flight ${sliceIndex + 1}`}
                slice={slice}
              />

              <div className="mt-4 space-y-3">
                {slice.segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="rounded-[1.1rem] border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">
                          {segment.airlineName} {segment.airlineIataCode}
                          {segment.flightNumber
                            ? ` ${segment.flightNumber}`
                            : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {segment.origin.iataCode}{" "}
                          {formatTime(segment.departingAt)} →{" "}
                          {segment.destination.iataCode}{" "}
                          {formatTime(segment.arrivingAt)}
                        </p>
                      </div>

                      <InlinePill label={formatDuration(segment.duration)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-slate-200 bg-sky-50 p-4 text-sm leading-6 text-slate-600">
          Skysirv currently supports live offer discovery and comparison.
          Passenger checkout will be introduced after booking confirmation,
          payment, and post-booking support flows are production-ready.
        </div>
      </motion.div>
    </div>
  )
}

function FlightTimeBlock({
  code,
  city,
  time,
  alignRight = false,
}: {
  code?: string | null
  city?: string | null
  time?: string | null
  alignRight?: boolean
}) {
  return (
    <div className={alignRight ? "text-right" : ""}>
      <p className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
        {formatTime(time)}
      </p>
      <p className="mt-0.5 text-xs font-semibold tracking-[0.12em] text-slate-600 sm:mt-1 sm:text-sm">
        {code ?? "---"}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
        {city ?? "Airport"}
      </p>
    </div>
  )
}

function SlimPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
      {label}
    </div>
  )
}

function InlinePill({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
      {label || "—"}
    </span>
  )
}

function getSliceKey(slice: BookingSlice) {
  const firstSegment = slice.segments[0]
  const lastSegment = slice.segments[slice.segments.length - 1]

  return [
    slice.origin.iataCode,
    slice.destination.iataCode,
    slice.departureTime,
    slice.arrivalTime,
    firstSegment?.airlineIataCode,
    firstSegment?.flightNumber,
    lastSegment?.flightNumber,
  ]
    .filter(Boolean)
    .join("|")
}

function toggleFilterValue<T>(current: T[], value: T) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
}

function getToggledFilterValues<T>(current: T[], value: T) {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
}

function getFilteredOffers(offers: BookingOffer[], filters: BookingFilterState) {
  return offers.filter((offer) => {
    if (filters.selectedStopFilters.length > 0) {
      const maxStops = getOfferMaxStops(offer)

      const matchesStops = filters.selectedStopFilters.some((filter) => {
        if (filter === "nonstop") return maxStops === 0
        if (filter === "one_stop") return maxStops === 1
        return maxStops >= 2
      })

      if (!matchesStops) return false
    }

    if (filters.selectedAirlineFilters.length > 0) {
      const airlines = getOfferAirlineNames(offer)
      const matchesAirline = filters.selectedAirlineFilters.some((airline) =>
        airlines.includes(airline)
      )

      if (!matchesAirline) return false
    }

    if (filters.selectedAirportFilters.length > 0) {
      const airportCodes = getOfferAirportCodes(offer)
      const matchesAirport = filters.selectedAirportFilters.some((airportCode) =>
        airportCodes.includes(airportCode)
      )

      if (!matchesAirport) return false
    }

    if (filters.selectedTimeFilters.length > 0) {
      const matchesTime = filters.selectedTimeFilters.some((filter) =>
        offerMatchesTimeFilter(offer, filter)
      )

      if (!matchesTime) return false
    }

    if (
      filters.selectedPriceCeiling != null &&
      Number(offer.totalAmount) > filters.selectedPriceCeiling
    ) {
      return false
    }

    if (filters.usAirlinesOnly && !offerUsesUsAirline(offer)) {
      return false
    }

    return true
  })
}

function getOfferMaxStops(offer: BookingOffer) {
  return offer.slices.reduce((maxStops, slice) => {
    return Math.max(maxStops, slice.stops ?? 0)
  }, 0)
}

function getOfferAirlineNames(offer: BookingOffer) {
  return Array.from(
    new Set(
      offer.slices
        .flatMap((slice) => slice.segments)
        .map((segment) => segment.airlineName)
        .filter((value): value is string => Boolean(value))
    )
  )
}

function getSearchEndpointAirportCodes(offers: BookingOffer[]) {
  const codes: string[] = []
  const seen = new Set<string>()

  function addCode(value?: string | null) {
    const code = value?.trim().toUpperCase()

    if (!code || seen.has(code)) return

    seen.add(code)
    codes.push(code)
  }

  for (const offer of offers) {
    for (const slice of offer.slices) {
      addCode(slice.origin.iataCode)
      addCode(slice.destination.iataCode)
    }
  }

  return codes
}

function getAirportMarketForCode(code?: string | null) {
  const normalizedCode = code?.trim().toUpperCase()

  if (!normalizedCode) return null

  return (
    AIRPORT_MARKETS.find((market) =>
      market.airports.includes(normalizedCode)
    ) ?? null
  )
}

function getAirportFilterMarketGroups(endpointAirportCodes: string[]) {
  const groups: AirportFilterMarketGroup[] = []
  const seenGroupLabels = new Set<string>()
  const seenStandaloneCodes = new Set<string>()

  for (const code of endpointAirportCodes) {
    const market = getAirportMarketForCode(code)

    if (market) {
      if (!seenGroupLabels.has(market.label)) {
        seenGroupLabels.add(market.label)
        groups.push(market)
      }

      continue
    }

    const airport = getAirportByCode(code)
    const label = airport?.displayName ?? airport?.name ?? code

    if (!seenStandaloneCodes.has(code)) {
      seenStandaloneCodes.add(code)
      groups.push({
        label,
        airports: [code],
      })
    }
  }

  return groups
}

function getOfferAirportCodes(offer: BookingOffer) {
  const codes = new Set<string>()

  for (const slice of offer.slices) {
    const originCode = slice.origin.iataCode?.trim().toUpperCase()
    const destinationCode = slice.destination.iataCode?.trim().toUpperCase()

    if (originCode) codes.add(originCode)
    if (destinationCode) codes.add(destinationCode)
  }

  return Array.from(codes)
}

function getAirportDisplayMap(
  offers: BookingOffer[],
  airportMarketGroups: AirportFilterMarketGroup[] = []
) {
  const map: Record<string, string> = {}

  function addAirportByCode(rawCode?: string | null) {
    const code = rawCode?.trim().toUpperCase()

    if (!code || map[code]) return

    const airportFromDirectory = getAirportByCode(code)
    const directoryName =
      airportFromDirectory?.displayName ?? airportFromDirectory?.name

    if (directoryName) {
      map[code] = `${code}: ${directoryName}`
      return
    }

    map[code] = code
  }

  function addAirport(airport?: {
    iataCode: string | null
    name: string | null
    cityName: string | null
  }) {
    if (!airport) return

    const code = airport.iataCode?.trim().toUpperCase()

    if (!code || map[code]) return

    const airportFromDirectory = getAirportByCode(code)
    const directoryName =
      airportFromDirectory?.displayName ?? airportFromDirectory?.name

    if (directoryName) {
      map[code] = `${code}: ${directoryName}`
      return
    }

    const name = airport.name?.trim()
    const cityName = airport.cityName?.trim()

    if (name) {
      map[code] = `${code}: ${name}`
      return
    }

    if (cityName) {
      map[code] = `${code}: ${cityName}`
      return
    }

    map[code] = code
  }

  for (const group of airportMarketGroups) {
    for (const airportCode of group.airports) {
      addAirportByCode(airportCode)
    }
  }

  for (const offer of offers) {
    for (const slice of offer.slices) {
      addAirport(slice.origin)
      addAirport(slice.destination)
    }
  }

  return map
}

function getOfferDepartureHour(offer: BookingOffer) {
  const firstSlice = offer.slices[0]
  const firstSegment = firstSlice?.segments[0]
  const departureTime = firstSlice?.departureTime ?? firstSegment?.departingAt

  if (!departureTime) return null

  const date = new Date(departureTime)

  if (Number.isNaN(date.getTime())) return null

  return date.getHours()
}

function offerMatchesTimeFilter(offer: BookingOffer, filter: TimeFilter) {
  const hour = getOfferDepartureHour(offer)

  if (hour == null) return false

  if (filter === "morning") return hour >= 5 && hour < 11
  if (filter === "afternoon") return hour >= 11 && hour < 17
  if (filter === "evening") return hour >= 17 && hour < 22

  return hour >= 22 || hour < 5
}

function offerUsesUsAirline(offer: BookingOffer) {
  const usAirlines = new Set([
    "AA",
    "AS",
    "B6",
    "DL",
    "F9",
    "HA",
    "NK",
    "UA",
    "WN",
  ])

  return offer.slices
    .flatMap((slice) => slice.segments)
    .some((segment) => {
      const code = segment.airlineIataCode?.trim().toUpperCase()
      return Boolean(code && usAirlines.has(code))
    })
}

function getLowestPriceLabel(offers: BookingOffer[]) {
  if (!offers.length) return "—"

  const prices = offers
    .map((offer) => Number(offer.totalAmount))
    .filter((price) => Number.isFinite(price))

  if (!prices.length) return "—"

  const lowest = Math.min(...prices)

  return formatMoney(String(lowest), offers[0]?.totalCurrency ?? "USD")
}

function getStopLowestPriceLabel(offers: BookingOffer[], filter: StopFilter) {
  const matchingOffers = offers.filter((offer) => {
    const maxStops = getOfferMaxStops(offer)

    if (filter === "nonstop") return maxStops === 0
    if (filter === "one_stop") return maxStops === 1

    return maxStops >= 2
  })

  return getLowestPriceLabel(matchingOffers)
}

function getAirlineLowestPriceLabel(offers: BookingOffer[], airline: string) {
  const matchingOffers = offers.filter((offer) =>
    getOfferAirlineNames(offer).includes(airline)
  )

  return getLowestPriceLabel(matchingOffers)
}

function getAirportLowestPriceLabel(offers: BookingOffer[], airportCode: string) {
  const matchingOffers = offers.filter((offer) =>
    getOfferAirportCodes(offer).includes(airportCode)
  )

  return getLowestPriceLabel(matchingOffers)
}

function formatMoney(amount: string, currency: string) {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount)) {
    return `${amount} ${currency}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericAmount)
}

function formatTime(value?: string | null) {
  if (!value) return "--:--"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "--:--"

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function formatDuration(value?: string | null) {
  if (!value) return "Duration unavailable"

  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/)

  if (!match) return value

  const hours = match[1] ? Number(match[1]) : 0
  const minutes = match[2] ? Number(match[2]) : 0

  if (hours && minutes) return `${hours}h ${minutes}m`
  if (hours) return `${hours}h`
  if (minutes) return `${minutes}m`

  return value
}

function BookingFooter() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-6 pt-16 text-center md:max-w-4xl md:text-left">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
        <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
          <Link
            href="/"
            className="text-xl font-bold leading-none text-slate-950 transition hover:text-slate-700"
          >
            Skysirv™
          </Link>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Flight intelligence that helps travelers understand pricing and book
            with more confidence.
          </p>
        </div>

        <FooterColumn
          title="Products"
          links={[
            { href: "/pricing", label: "Pricing" },
            { href: "/booking", label: "Booking" },
            { href: "/flight-attendant", label: "Skysirv Flight Attendant™" },
          ]}
        />

        <FooterColumn
          title="Company"
          links={[
            { href: "/about", label: "About" },
            { href: "/beta", label: "Skysirv™ Beta" },
          ]}
        />

        <FooterColumn
          title="Legal"
          links={[
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
            { href: "/refund-policy", label: "Refund Policy" },
          ]}
        />
      </div>

      <div className="mt-12 pt-6 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
        </p>
      </div>
    </div>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="text-center md:text-left">
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-950">
        {title}
      </h3>

      <ul className="mt-4 space-y-3 text-sm text-slate-500">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition hover:text-slate-950">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}