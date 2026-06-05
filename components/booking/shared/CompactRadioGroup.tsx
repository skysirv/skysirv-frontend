import type { FlightTripType } from "./bookingLabTypes"
import { cn } from "./bookingLabUtils"

export default function CompactRadioGroup({
  value,
  onChange,
}: {
  value: FlightTripType
  onChange: (value: FlightTripType) => void
}) {
  const tripTypes: Array<{ label: string; value: FlightTripType }> = [
    { label: "One-way", value: "one-way" },
    { label: "Round-trip", value: "round-trip" },
    { label: "Multi-destination", value: "multi-city" },
  ]

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      {tripTypes.map((tripType) => (
        <button
          key={tripType.value}
          type="button"
          onClick={() => onChange(tripType.value)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"
        >
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border transition",
              value === tripType.value
                ? "border-blue-700"
                : "border-slate-300 bg-white",
            )}
          >
            {value === tripType.value && (
              <span className="h-2 w-2 rounded-full bg-blue-700" />
            )}
          </span>

          {tripType.label}
        </button>
      ))}
    </div>
  )
}