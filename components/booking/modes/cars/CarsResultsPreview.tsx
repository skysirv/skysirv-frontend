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

const sampleCars = [
  {
    id: "car-1",
    supplier: "Hertz",
    vehicle: "Toyota Corolla or similar",
    badge: "Best value",
    pickup: "Airport pickup",
    category: "Compact",
    seats: "5 seats",
    bags: "2 bags",
    transmission: "Automatic",
    mileage: "Unlimited mileage",
    price: "$38",
    total: "$190 total",
    lucySignal: "Strong value for a simple city rental with flexible pickup.",
  },
  {
    id: "car-2",
    supplier: "Avis",
    vehicle: "Hyundai Tucson or similar",
    badge: "Family pick",
    pickup: "Airport pickup",
    category: "SUV",
    seats: "5 seats",
    bags: "4 bags",
    transmission: "Automatic",
    mileage: "Unlimited mileage",
    price: "$62",
    total: "$310 total",
    lucySignal: "Better luggage space and comfort if you’re traveling with kids.",
  },
  {
    id: "car-3",
    supplier: "Budget",
    vehicle: "Kia Picanto or similar",
    badge: "Cheapest",
    pickup: "City pickup",
    category: "Economy",
    seats: "4 seats",
    bags: "1 bag",
    transmission: "Automatic",
    mileage: "Limited mileage",
    price: "$31",
    total: "$155 total",
    lucySignal: "Lowest sample price, but less space and less airport convenience.",
  },
]

const companyOptions = [
  { label: "Hertz", meta: "$38" },
  { label: "Avis", meta: "$62" },
  { label: "Budget", meta: "$31" },
  { label: "Enterprise", meta: "$49" },
]

const vehicleOptions = [
  { label: "Economy", meta: "from $31" },
  { label: "Compact", meta: "from $38" },
  { label: "SUV", meta: "from $62" },
]

const pickupOptions = [
  { label: "Airport pickup", meta: "12" },
  { label: "City pickup", meta: "6" },
  { label: "Same drop-off", meta: "18" },
]

const quickChips = [
  "Airport pickup",
  "Unlimited mileage",
  "SUV",
  "Compact",
  "Free cancellation",
]

export default function CarsResultsPreview() {
  return (
    <BookingResultsLayout filters={<CarsFilterPanel />}>
      <BookingQuickChips chips={quickChips} />

      <BookingResultsHeader
        title="Choose your car rental"
        subtitle="Preview layout · car rental provider wiring comes next."
      />

      <div className="space-y-2">
        {sampleCars.map((car) => (
          <CarResultRow key={car.id} car={car} />
        ))}
      </div>
    </BookingResultsLayout>
  )
}

function CarsFilterPanel() {
  return (
    <aside className="h-fit rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_14px_38px_rgba(15,23,42,0.07)]">
      <div className="mb-4">
        <RecommendedDropdownButton />
      </div>

      <div className="space-y-5">
        <FilterMiniSection title="Rental perks">
          <FilterCheckboxRow label="Free cancellation" meta="14" />
          <FilterCheckboxRow label="Unlimited mileage" meta="11" />
          <FilterCheckboxRow label="Pay at pickup" meta="8" />
        </FilterMiniSection>

        <FilterMiniSection title="Vehicle type" reset>
          {vehicleOptions.map((option) => (
            <FilterPillRow
              key={option.label}
              label={option.label}
              meta={option.meta}
            />
          ))}
        </FilterMiniSection>

        <FilterMiniSection title="Rental company" reset>
          <SelectAllNoneControls />

          {companyOptions.map((option) => (
            <FilterCheckboxRow
              key={option.label}
              label={option.label}
              meta={option.meta}
            />
          ))}
        </FilterMiniSection>

        <FilterMiniSection title="Pickup" reset>
          {pickupOptions.map((option) => (
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

function CarResultRow({
  car,
}: {
  car: {
    supplier: string
    vehicle: string
    badge: string
    pickup: string
    category: string
    seats: string
    bags: string
    transmission: string
    mileage: string
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
            <div className="flex h-[88px] items-center justify-center rounded-[1rem] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-3xl">
              🚗
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-[24px] items-center rounded-full bg-green-50 px-2.5 text-[11px] font-bold text-green-700">
                  {car.badge}
                </span>

                <span className="text-xs font-semibold text-slate-400">
                  {car.pickup}
                </span>
              </div>

              <p className="truncate text-sm font-bold text-slate-950">
                {car.vehicle}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {car.supplier} · {car.category}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <BookingInfoPill label={car.seats} />
                <BookingInfoPill label={car.bags} />
                <BookingInfoPill label={car.transmission} />
                <BookingInfoPill label={car.mileage} />
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs font-medium leading-5 text-slate-600">
            <span className="font-bold text-orange-500">Lucy note:</span>{" "}
            {car.lucySignal}
          </p>
        </div>

        <div className="flex min-h-[142px] flex-col items-end border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-slate-950">
              {car.price}
            </p>

            <p className="text-xs font-semibold text-slate-500">
              per day
            </p>

            <p className="mt-0.5 text-xs font-bold text-slate-700">
              {car.total}
            </p>
          </div>

          <CarValueIcons />

          <button
            type="button"
            className="mt-auto inline-flex min-h-[30px] items-center justify-center rounded-full bg-blue-700 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-600"
          >
            View car
          </button>
        </div>
      </div>
    </article>
  )
}

function CarValueIcons() {
  return (
    <div className="mt-3 flex flex-wrap justify-end gap-1.5">
      <span
        title="Free cancellation"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-100 bg-green-50 text-[11px] text-green-700"
      >
        ✓
      </span>

      <span
        title="Automatic transmission"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[11px] text-blue-700"
      >
        A
      </span>

      <span
        title="Luggage space"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] text-slate-500"
      >
        🧳
      </span>
    </div>
  )
}