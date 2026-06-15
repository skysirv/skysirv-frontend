import {
  FilterCheckboxRow,
  FilterMiniSection,
  FilterPillRow,
  RecommendedDropdownButton,
  SelectAllNoneControls,
} from "@/components/booking/shared/results/BookingFilterControls"
import {
  BookingInfoPill,
  BookingQuickChips,
  BookingResultsHeader,
  BookingResultsLayout,
} from "@/components/booking/shared/results/BookingResultsScaffold"

const sampleCruises = [
  {
    id: "cruise-1",
    cruiseLine: "Royal Caribbean",
    ship: "Wonder of the Seas",
    badge: "Family favorite",
    route: "Miami → Cozumel → Nassau → Miami",
    region: "Caribbean",
    duration: "7 nights",
    cabin: "Balcony cabin",
    departure: "Aug 18",
    price: "$842",
    total: "$1,684 total",
    lucySignal: "Strong family option with a good balance of ship experience and island stops.",
  },
  {
    id: "cruise-2",
    cruiseLine: "Norwegian Cruise Line",
    ship: "Norwegian Prima",
    badge: "Best value",
    route: "Miami → Costa Maya → Harvest Caye → Miami",
    region: "Western Caribbean",
    duration: "5 nights",
    cabin: "Oceanview cabin",
    departure: "Sep 6",
    price: "$619",
    total: "$1,238 total",
    lucySignal: "Lower sample fare and shorter duration, good if you want a lighter cruise commitment.",
  },
  {
    id: "cruise-3",
    cruiseLine: "Celebrity Cruises",
    ship: "Celebrity Beyond",
    badge: "Premium pick",
    route: "Fort Lauderdale → Aruba → Curaçao → Fort Lauderdale",
    region: "Southern Caribbean",
    duration: "8 nights",
    cabin: "Veranda cabin",
    departure: "Oct 12",
    price: "$1,124",
    total: "$2,248 total",
    lucySignal: "Better premium feel and itinerary depth, but a higher total trip cost.",
  },
]

const cruiseLineOptions = [
  { label: "Royal Caribbean", meta: "$842" },
  { label: "Norwegian", meta: "$619" },
  { label: "Celebrity", meta: "$1,124" },
  { label: "Carnival", meta: "$588" },
]

const cabinOptions = [
  { label: "Interior", meta: "from $588" },
  { label: "Oceanview", meta: "from $619" },
  { label: "Balcony", meta: "from $842" },
  { label: "Suite", meta: "from $1,480" },
]

const durationOptions = [
  { label: "3–5 nights", meta: "8" },
  { label: "6–8 nights", meta: "14" },
  { label: "9+ nights", meta: "5" },
]

const quickChips = [
  "Family friendly",
  "Balcony cabin",
  "Flexible dates",
  "Caribbean",
  "Premium ship",
]

export default function CruisesResultsPreview() {
  return (
    <BookingResultsLayout filters={<CruisesFilterPanel />}>
      <BookingQuickChips chips={quickChips} />

      <BookingResultsHeader
        title="Choose your cruise"
        subtitle="Preview layout · cruise provider wiring comes next."
      />

      <div className="space-y-2">
        {sampleCruises.map((cruise) => (
          <CruiseResultRow key={cruise.id} cruise={cruise} />
        ))}
      </div>
    </BookingResultsLayout>
  )
}

function CruisesFilterPanel() {
  return (
    <aside className="h-fit rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
      <div className="mb-4">
        <RecommendedDropdownButton />
      </div>

      <div className="space-y-5">
        <FilterMiniSection title="Cruise style">
          <FilterCheckboxRow label="Family friendly" meta="16" />
          <FilterCheckboxRow label="Premium ship" meta="9" />
          <FilterCheckboxRow label="Relaxed pace" meta="11" />
        </FilterMiniSection>

        <FilterMiniSection title="Cruise line" reset>
          <SelectAllNoneControls />

          {cruiseLineOptions.map((option) => (
            <FilterCheckboxRow
              key={option.label}
              label={option.label}
              meta={option.meta}
            />
          ))}
        </FilterMiniSection>

        <FilterMiniSection title="Cabin type" reset>
          {cabinOptions.map((option) => (
            <FilterPillRow
              key={option.label}
              label={option.label}
              meta={option.meta}
            />
          ))}
        </FilterMiniSection>

        <FilterMiniSection title="Duration" reset>
          {durationOptions.map((option) => (
            <FilterCheckboxRow
              key={option.label}
              label={option.label}
              meta={option.meta}
            />
          ))}
        </FilterMiniSection>
      </div>
    </aside>
  )
}

function CruiseResultRow({
  cruise,
}: {
  cruise: {
    cruiseLine: string
    ship: string
    badge: string
    route: string
    region: string
    duration: string
    cabin: string
    departure: string
    price: string
    total: string
    lucySignal: string
  }
}) {
  return (
    <article className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_12px_34px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_132px]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[88px_minmax(0,1fr)]">
            <div className="flex h-[88px] items-center justify-center rounded-[1rem] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-3xl">
              🚢
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-[24px] items-center rounded-full bg-green-50 px-2.5 text-[11px] font-bold text-green-700">
                  {cruise.badge}
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  {cruise.region} · {cruise.duration} · {cruise.departure}
                </span>
              </div>

              <p className="truncate text-sm font-bold text-slate-950">
                {cruise.ship}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {cruise.cruiseLine}
              </p>

              <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                {cruise.route}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <BookingInfoPill label={cruise.cabin} />
                <BookingInfoPill label={cruise.duration} />
                <BookingInfoPill label={cruise.region} />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs font-medium leading-5 text-slate-600">
            <span className="font-bold text-orange-500">Lucy note:</span>{" "}
            {cruise.lucySignal}
          </p>
        </div>

        <div className="flex min-h-[142px] flex-col items-end border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-slate-950">
              {cruise.price}
            </p>

            <p className="text-xs font-semibold text-slate-500">
              per traveler
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-700">
              {cruise.total}
            </p>
          </div>

          <CruiseValueIcons />

          <button
            type="button"
            className="mt-auto inline-flex min-h-[30px] items-center justify-center rounded-full bg-blue-700 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-600"
          >
            View cruise
          </button>
        </div>
      </div>
    </article>
  )
}

function CruiseValueIcons() {
  return (
    <div className="mt-3 flex flex-wrap justify-end gap-1.5">
      <span
        title="Family friendly"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-100 bg-green-50 text-[11px] text-green-700"
      >
        ✓
      </span>

      <span
        title="Cabin upgrade available"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[11px] text-blue-700"
      >
        ✦
      </span>

      <span
        title="Excursions may cost extra"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-500"
      >
        $
      </span>
    </div>
  )
}