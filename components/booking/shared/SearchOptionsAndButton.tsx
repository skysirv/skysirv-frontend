import { quickOptionLabels } from "./bookingLabConfig"
import type { BookingMode } from "./bookingLabTypes"
import BookingPreferencePill from "./BookingPreferencePill"
import BundleSaveStrip from "./BundleSaveStrip"
import FlightTrustStrip from "./FlightTrustStrip"
import SearchButton from "./SearchButton"

export default function SearchOptionsAndButton({ mode }: { mode: BookingMode }) {
  if (mode === "flights") {
    return (
      <>
        <BundleSaveStrip firstOption="Add a hotel" secondOption="Add a car" />

        <FlightTrustStrip />

        <SearchButton mode={mode} />
      </>
    )
  }

  if (mode === "hotels") {
    return (
      <>
        <BundleSaveStrip firstOption="Add a flight" secondOption="Add a car" />

        <SearchButton mode={mode} />
      </>
    )
  }

  if (mode === "cars") {
    return (
      <>
        <BundleSaveStrip firstOption="Add a hotel" secondOption="Add a flight" />

        <SearchButton mode={mode} />
      </>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 pt-1">
        {quickOptionLabels[mode].map((label) => (
          <BookingPreferencePill key={label} label={label} />
        ))}
      </div>

      <SearchButton mode={mode} />
    </>
  )
}