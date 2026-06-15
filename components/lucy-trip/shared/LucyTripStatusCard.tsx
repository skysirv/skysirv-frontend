export default function LucyTripStatusCard() {
  return (
    <div className="rounded-2xl bg-slate-50/80 px-5 py-4">
      <div className="space-y-3 text-sm font-medium leading-6 text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-50 text-xs text-orange-500">
            ◉
          </span>
          <span>Lucy is shaping your travel brief...</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs text-blue-600">
            ✓
          </span>
          <span>Route and flight logic prepared</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs text-emerald-600">
            ✓
          </span>
          <span>Trip style and destination signals organized</span>
        </div>
      </div>
    </div>
  )
}