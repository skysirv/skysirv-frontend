import type { FieldIconName } from "./bookingLabTypes"
import FieldIcon from "./FieldIcon"

export default function CompactField({
  placeholder,
  type = "text",
  icon = "search",
}: {
  placeholder: string
  type?: "text" | "number"
  icon?: FieldIconName
}) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-blue-700">
        <FieldIcon name={icon} />
      </span>

      <input
        type={type}
        placeholder={placeholder}
        className="h-[58px] w-full rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  )
}