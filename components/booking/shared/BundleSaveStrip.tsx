export default function BundleSaveStrip({
  firstOption,
  secondOption,
}: {
  firstOption: string
  secondOption: string
}) {
  return (
    <div className="flex w-fit max-w-full flex-wrap items-center gap-3 rounded-xl border border-lime-200 bg-lime-100 px-4 py-3">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-200 text-green-700">
          $
        </span>
        Bundle + save
      </span>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-200"
        />
        {firstOption}
      </label>

      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-200"
        />
        {secondOption}
      </label>
    </div>
  )
}