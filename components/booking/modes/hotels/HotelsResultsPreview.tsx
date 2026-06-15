import {
  FilterCheckboxRow,
  FilterMiniSection,
  FilterPillRow,
  RecommendedDropdownButton,
} from "@/components/booking/shared/results/BookingFilterControls"
import {
  BookingInfoPill,
  BookingQuickChips,
  BookingResultsHeader,
  BookingResultsLayout,
} from "@/components/booking/shared/results/BookingResultsScaffold"
import type { HotelStaySearchResult } from "@/lib/booking-api"

type HotelResultCard = {
  id: string
  name: string
  badge: string
  location: string
  rating: string
  ratingLabel: string
  stars: string
  amenities: string[]
  price: string
  total: string
  lucySignal: string
  imageSrc?: string | null
}

const sampleHotels: HotelResultCard[] = [
  {
    id: "hotel-1",
    name: "The Meridian Bay Hotel",
    badge: "Best value",
    location: "Downtown · 0.4 km from center",
    rating: "8.8",
    ratingLabel: "Excellent",
    stars: "4-star",
    amenities: ["Free cancellation", "Breakfast", "Pool"],
    price: "$186",
    total: "$744 total",
    lucySignal: "Strong location with flexible cancellation and good family comfort.",
  },
  {
    id: "hotel-2",
    name: "Casa Vista Boutique",
    badge: "Guest favorite",
    location: "Food district · Near restaurants",
    rating: "9.2",
    ratingLabel: "Wonderful",
    stars: "4-star",
    amenities: ["Boutique", "Breakfast", "Walkable"],
    price: "$214",
    total: "$856 total",
    lucySignal: "Better vibe and dining access, but slightly higher nightly cost.",
  },
  {
    id: "hotel-3",
    name: "Airport Garden Suites",
    badge: "Easy airport",
    location: "Airport area · Shuttle available",
    rating: "8.5",
    ratingLabel: "Very good",
    stars: "3-star",
    amenities: ["Airport shuttle", "Laundry", "Family rooms"],
    price: "$142",
    total: "$568 total",
    lucySignal: "Practical choice if arrival timing or early departure matters.",
  },
]

const hotelFilterSections = [
  {
    title: "Popular",
    options: [
      { label: "Free cancellation", meta: "18" },
      { label: "Breakfast included", meta: "12" },
      { label: "Pool", meta: "9" },
    ],
  },
  {
    title: "Star rating",
    options: [
      { label: "5-star", meta: "from $312" },
      { label: "4-star", meta: "from $186" },
      { label: "3-star", meta: "from $142" },
    ],
  },
  {
    title: "Location",
    options: [
      { label: "Downtown", meta: "14" },
      { label: "Near airport", meta: "8" },
      { label: "Food district", meta: "6" },
    ],
  },
]

const quickChips = [
  "Free cancellation",
  "Breakfast included",
  "Good location",
  "Pool",
  "Family rooms",
]

const hotelModeAds = [
  {
    id: "hotel-ad-1",
    title: "Hotel partner ad",
    caption: "Premium stay placement",
    heightClassName: "h-[220px]",
  },
  {
    id: "hotel-ad-2",
    title: "Destination offer",
    caption: "Featured local experience",
    heightClassName: "h-[220px]",
  },
  {
    id: "hotel-ad-3",
    title: "Extended stay promo",
    caption: "Larger ad placeholder",
    heightClassName: "h-[440px]",
  },
]

function parseAmount(value: string): number {
  const amount = Number(value)

  return Number.isFinite(amount) ? amount : 0
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

function getNightCount(checkInDate: string, checkOutDate: string): number {
  const checkIn = new Date(`${checkInDate}T00:00:00`)
  const checkOut = new Date(`${checkOutDate}T00:00:00`)

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return 1
  }

  return Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000),
  )
}

function getHotelLocation(stay: HotelStaySearchResult): string {
  return (
    [stay.cityName, stay.countryCode].filter(Boolean).join(", ") ||
    stay.address ||
    "Location details available before booking"
  )
}

function getHotelBadge(index: number): string {
  if (index === 0) return "Lowest live rate"
  if (index === 1) return "Strong value"
  if (index === 2) return "Popular stay"

  return "Live stay"
}

function normalizeHotelStayResult(
  stay: HotelStaySearchResult,
  index: number,
): HotelResultCard {
  const totalAmount = parseAmount(stay.cheapestRateTotalAmount)
  const nights = getNightCount(stay.checkInDate, stay.checkOutDate)
  const nightlyAmount = totalAmount / nights
  const currency = stay.cheapestRateCurrency || "USD"
  const amenities = stay.amenities.slice(0, 3)

  return {
    id: stay.id,
    name: stay.name,
    badge: getHotelBadge(index),
    location: getHotelLocation(stay),
    rating: stay.rating ? stay.rating.toFixed(1) : "—",
    ratingLabel: stay.rating ? "Rating" : "Live stay",
    stars: stay.chainName || stay.brandName || "Hotel",
    amenities: amenities.length ? amenities : ["Live rate", "Stay option"],
    price: formatMoney(nightlyAmount, currency),
    total: `${formatMoney(totalAmount, currency)} total`,
    lucySignal:
      index === 0
        ? "This is currently one of the lowest live rates returned for this destination."
        : "Live stay option returned from the hotel inventory search.",
    imageSrc: stay.images[0] ?? null,
  }
}

export default function HotelsResultsPreview({
  results,
  destination,
}: {
  results?: HotelStaySearchResult[]
  destination?: string
}) {
  const hotels =
    results && results.length
      ? results.map((stay, index) => normalizeHotelStayResult(stay, index))
      : sampleHotels

  const isLiveSearch = Boolean(results)
  return (
    <BookingResultsLayout
      rightRail={<HotelModeAdRail />}
      filters={<HotelsFilterPanel />}
    >
      <BookingQuickChips chips={quickChips} />

      <div className="space-y-5">
        <div className="space-y-2">
          <BookingResultsHeader
            title={
              destination
                ? `Recommended Hotels in ${destination}`
                : "Recommended Hotels"
            }
            subtitle={
              isLiveSearch
                ? "Live stay inventory returned for this destination."
                : "Preview layout · hotel search provider wiring comes next."
            }
          />

          {hotels.map((hotel) => (
            <HotelResultRow key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </BookingResultsLayout>
  )
}

function HotelsFilterPanel() {
  return (
    <aside className="h-fit rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
      <div className="mb-4">
        <RecommendedDropdownButton />
      </div>

      <div className="space-y-5">
        <FilterMiniSection title="Budget">
          <FilterPillRow label="Under $150/night" meta="from $142" />
          <FilterPillRow label="$150–$250/night" meta="from $186" />
          <FilterPillRow label="$250+/night" meta="from $312" />
        </FilterMiniSection>

        {hotelFilterSections.map((section) => (
          <FilterMiniSection key={section.title} title={section.title} reset>
            {section.options.map((option) => (
              <FilterCheckboxRow
                key={option.label}
                label={option.label}
                meta={option.meta}
              />
            ))}
          </FilterMiniSection>
        ))}
      </div>
    </aside>
  )
}

function HotelModeAdRail() {
  return (
    <div className="sticky top-24 space-y-4">
      {hotelModeAds.map((ad) => (
        <div
          key={ad.id}
          className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${ad.heightClassName}`}
        >
          <div
            aria-label="Hotel advertisement placeholder"
            className="flex h-full flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-orange-50 p-4"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Advertisement
              </p>

              <p className="mt-2 text-sm font-black text-slate-800">
                {ad.title}
              </p>

              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                {ad.caption}
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm">
              🏨
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function HotelResultRow({
  hotel,
}: {
  hotel: HotelResultCard
}) {
  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_132px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex h-[88px] items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-orange-50 text-2xl">
              {hotel.imageSrc ? (
                <img
                  src={hotel.imageSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                "🏨"
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-[24px] items-center rounded-full bg-green-50 px-2.5 text-[11px] font-bold text-green-700">
                  {hotel.badge}
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  {hotel.stars}
                </span>
              </div>

              <p className="truncate text-sm font-bold text-slate-800">
                {hotel.name}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {hotel.location}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-[26px] items-center rounded-full bg-blue-50 px-2.5 text-xs font-bold text-blue-700">
                  {hotel.rating} {hotel.ratingLabel}
                </span>

                {hotel.amenities.map((amenity) => (
                  <BookingInfoPill key={amenity} label={amenity} />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs font-medium leading-5 text-slate-600">
            <span className="font-bold text-orange-500">Lucy note:</span>{" "}
            {hotel.lucySignal}
          </p>
        </div>

        <div className="flex min-h-[142px] flex-col items-end border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-slate-800">
              {hotel.price}
            </p>

            <p className="text-xs font-semibold text-slate-500">
              per night
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-700">
              {hotel.total}
            </p>
          </div>

          <HotelValueIcons />

          <button
            type="button"
            className="mt-auto inline-flex min-h-[30px] items-center justify-center rounded-full bg-blue-700 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-600"
          >
            View stay
          </button>
        </div>
      </div>
    </article>
  )
}

function HotelValueIcons() {
  return (
    <div className="mt-3 flex flex-wrap justify-end gap-1.5">
      <span
        title="Free cancellation"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-100 bg-green-50 text-[11px] text-green-700"
      >
        ✓
      </span>

      <span
        title="Breakfast available"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[11px] text-blue-700"
      >
        ☕
      </span>

      <span
        title="Location score"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-500"
      >
        📍
      </span>
    </div>
  )
}