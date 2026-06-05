import { compactTrustLabels } from "./bookingLabConfig"

export default function FlightTrustStrip() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Trusted airlines. Smarter Skysirv search.
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Compare leading airlines with Skysirv intelligence layered in.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {compactTrustLabels.map((airline) => (
            <span
              key={airline}
              className="inline-flex min-h-[28px] items-center rounded-full border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-500"
            >
              {airline}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}