import FieldIcon from "./FieldIcon"

export default function CompactDateField({
  placeholder,
  value,
  onClick,
  compact = false,
}: {
  placeholder: string
  value: string
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        compact
          ? "relative flex h-[46px] w-full items-center rounded-lg border border-slate-300 bg-white py-0 pl-12 pr-4 text-left text-sm font-semibold transition hover:border-blue-200 hover:ring-4 hover:ring-blue-100"
          : "relative flex h-[58px] w-full items-center rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-left text-sm font-semibold transition hover:border-blue-200 hover:ring-4 hover:ring-blue-100"
      }
    >
      <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-blue-700">
        <FieldIcon name="calendar" />
      </span>

      <span className={value ? "text-slate-800" : "text-slate-400"}>
        {value || placeholder}
      </span>
    </button>
  )
}