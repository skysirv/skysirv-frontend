export default function LucyTripComposer() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(760px,calc(100vw-40px))] -translate-x-1/2">
      <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
        <textarea
          placeholder="Ask Lucy to shape the next part of your trip..."
          rows={2}
          className="min-h-[46px] w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg text-orange-500"
            aria-label="Voice input"
          >
            ◉
          </button>

          <span className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
            Lucy Memory
            <span aria-hidden="true">🔒</span>
          </span>

          <span className="inline-flex min-h-[30px] items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
            Trip Studio
          </span>

          <span className="inline-flex min-h-[30px] items-center rounded-full border border-orange-100 bg-orange-50 px-3 text-xs font-semibold text-orange-700">
            Travel tools
          </span>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800"
            aria-label="Send to Lucy"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}