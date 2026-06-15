import type { BookingMode } from "./bookingLabTypes"

function getSearchButtonLabel(mode: BookingMode) {
  if (mode === "flights") return "Search flights"
  if (mode === "hotels") return "Search hotels"
  if (mode === "cars") return "Search car rentals"
  return "Search cruises"
}

export default function SearchButton({
  mode,
  onClick,
  loading = false,
}: {
  mode: BookingMode
  onClick?: () => void
  loading?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-blue-700 bg-blue-700 px-6 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Searching..." : getSearchButtonLabel(mode)}
    </button>
  )
}