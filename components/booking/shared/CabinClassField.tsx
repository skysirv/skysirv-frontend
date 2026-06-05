import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { cabinOptions } from "./bookingLabConfig"
import FieldIcon from "./FieldIcon"

export default function CabinClassField({
  cabinClass,
  onChange,
}: {
  cabinClass: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef.current) return

      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-[58px] w-full items-center rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-left text-sm font-semibold transition hover:border-blue-200 hover:ring-4 hover:ring-blue-100"
      >
        <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-blue-700">
          <FieldIcon name="seat" />
        </span>

        <span className="flex min-w-0 flex-col">
          <span className="text-[11px] font-bold leading-4 text-slate-400">
            Cabin Class
          </span>
          <span className="truncate text-sm leading-5 text-slate-800">
            {cabinClass}
          </span>
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 top-full z-50 mt-2 w-[min(280px,calc(100vw-48px))] rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-[0_22px_65px_rgba(15,23,42,0.18)]"
        >
          {cabinOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
              className="flex min-h-[42px] w-full items-center justify-between rounded-xl px-3 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{option}</span>

              {cabinClass === option && (
                <span className="text-blue-700">✓</span>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}