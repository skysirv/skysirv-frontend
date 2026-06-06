import Link from "next/link"

export default function LucyTripTopBar() {
  return (
    <>
      <div className="fixed left-5 top-5 z-50 flex items-center gap-3">
        <Link
          href="/dev/plan-smarter-lab"
          className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-blue-700 bg-blue-700 px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          <span aria-hidden="true">←</span>
          Plan smarter
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-bold text-slate-800">
            Lucy Trip Studio
          </span>

          <button
            type="button"
            className="inline-flex min-h-[32px] items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
          >
            Share
          </button>
        </div>
      </div>

      <div className="fixed right-5 top-5 z-50 flex items-center gap-3">
        <button
          type="button"
          className="inline-flex min-h-[38px] items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white"
        >
          <span
            aria-hidden="true"
            className="fi fi-us rounded-[2px]"
            style={{ width: "20px", height: "15px" }}
          />
          USD
          <span aria-hidden="true" className="text-slate-400">
            ⌄
          </span>
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white shadow-sm"
          aria-label="Account"
          title="Account"
        >
          A
        </button>
      </div>
    </>
  )
}