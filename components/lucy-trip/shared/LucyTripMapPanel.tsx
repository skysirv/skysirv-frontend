type LucyTripMapPanelProps = {
  open: boolean
  onClose: () => void
}

const mockMapPoints = [
  {
    label: "Destination idea",
    detail: "Florence city center",
    colorClassName: "bg-emerald-500",
  },
  {
    label: "Airport anchor",
    detail: "Boston departure route",
    colorClassName: "bg-blue-500",
  },
  {
    label: "Food area",
    detail: "Local dinner neighborhoods",
    colorClassName: "bg-orange-500",
  },
]

export default function LucyTripMapPanel({
  open,
  onClose,
}: LucyTripMapPanelProps) {
  if (!open) return null

  return (
    <aside className="fixed right-6 top-20 z-40 hidden h-[calc(100vh-7rem)] w-[390px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.14)] xl:block">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-900">
              Lucy trip map
            </p>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Location ideas from this planning session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-xl leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close Lucy trip map"
          >
            ×
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50">
          <div className="absolute left-[18%] top-[24%] h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_0_8px_rgba(16,185,129,0.16)]" />
          <div className="absolute right-[24%] top-[38%] h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_0_8px_rgba(59,130,246,0.16)]" />
          <div className="absolute bottom-[24%] left-[42%] h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_0_8px_rgba(249,115,22,0.16)]" />

          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="inline-flex min-h-[34px] items-center justify-center rounded-full bg-emerald-500 px-4 text-xs font-bold text-white shadow-sm"
              >
                Follow Lucy
              </button>

              <button
                type="button"
                className="inline-flex min-h-[34px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700"
              >
                Show all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {mockMapPoints.map((point) => (
                <div key={point.label} className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${point.colorClassName}`}
                    aria-hidden="true"
                  />

                  <span>
                    <span className="block text-xs font-bold text-slate-900">
                      {point.label}
                    </span>

                    <span className="mt-0.5 block text-xs font-medium text-slate-500">
                      {point.detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}