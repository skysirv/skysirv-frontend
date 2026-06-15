export default function BookingBottomLucyComposer({
  modeLabel,
  composerText,
  onComposerChange,
  variant = "fixed",
}: {
  modeLabel: string
  composerText: string
  onComposerChange: (value: string) => void
  variant?: "fixed" | "rail"
}) {
  const wrapperClassName =
    variant === "fixed"
      ? "fixed bottom-6 left-1/2 z-50 w-[min(760px,calc(100vw-40px))] -translate-x-1/2"
      : "w-full"

  const cardClassName =
    variant === "fixed"
      ? "rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]"
      : "rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_14px_38px_rgba(15,23,42,0.07)]"

  return (
    <div className={wrapperClassName}>
      <div className={cardClassName}>
        <textarea
          value={composerText}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder="Ask Lucy about these booking options..."
          rows={variant === "rail" ? 4 : 2}
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
            Booking Assist
            <span aria-hidden="true">🔒</span>
          </span>

          <button
            type="button"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800"
            aria-label="Send to Lucy"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}