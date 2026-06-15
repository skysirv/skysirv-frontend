import { quickOptionLabels } from "./bookingLabConfig"
import type { BookingMode } from "./bookingLabTypes"
import BundleSaveStrip from "./BundleSaveStrip"
import FlightTrustStrip from "./FlightTrustStrip"
import SearchButton from "./SearchButton"

export default function SearchOptionsAndButton({
  mode,
  onSearch,
  loading = false,
}: {
  mode: BookingMode
  onSearch?: () => void
  loading?: boolean
}) {
  if (mode === "flights") {
    return (
      <>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <BundleSaveStrip
            firstOption="Add a hotel"
            secondOption="Add a car"
          />

          <div className="lg:self-stretch">
            <SearchButton mode={mode} onClick={onSearch} loading={loading} />
          </div>
        </div>

        <FlightTrustStrip />
      </>
    )
  }

  if (mode === "hotels") {
    return (
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
        <BundleSaveStrip firstOption="Add a flight" secondOption="Add a car" />

        <div className="lg:self-stretch">
          <SearchButton mode={mode} onClick={onSearch} loading={loading} />
        </div>
      </div>
    )
  }

  if (mode === "cars") {
    return (
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
        <BundleSaveStrip firstOption="Add a hotel" secondOption="Add a flight" />

        <div className="lg:self-stretch">
          <SearchButton mode={mode} onClick={onSearch} loading={loading} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
      <div className="flex flex-wrap items-center gap-4 pt-1">
        {quickOptionLabels[mode].map((label) => (
          <label
            key={label}
            className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-200"
            />

            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="lg:self-stretch">
        <SearchButton mode={mode} onClick={onSearch} loading={loading} />
      </div>
    </div>
  )
}