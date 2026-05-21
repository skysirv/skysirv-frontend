"use client"

export default function FreeLucyPreviewLab() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Meet Lucy, Skysirv's Flight Attendant
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            AI route help is available with Pro
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Ask Lucy about route timing, saved flights, fare movement, and when
            a booking decision may be worth reviewing.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Locked
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm leading-6 text-slate-600">
            “Lucy, why is BOS → MIA worth watching this week?”
          </p>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3">
          <p className="text-sm leading-6 text-slate-700">
            Upgrade to Pro to unlock Lucy-powered route explanations, saved
            flight context, and booking-timing guidance.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
          >
            Unlock Lucy
          </button>

          <button
            type="button"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            Compare plans
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Free includes basic route tracking and saved flights. Lucy chat is
        included with paid plans.
      </p>
    </div>
  )
}