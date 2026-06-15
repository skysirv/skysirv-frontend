import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import type { TravelersState } from "./bookingLabTypes"
import FieldIcon from "./FieldIcon"
import TravelerCounter from "./TravelerCounter"
import { formatTravelers } from "./bookingLabUtils"

export default function TravelersField({
  travelers,
  onChange,
  compact = false,
}: {
  travelers: TravelersState
  onChange: (travelers: TravelersState) => void
  compact?: boolean
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

  function updateTraveler(type: keyof TravelersState, amount: number) {
    onChange({
      ...travelers,
      [type]: Math.max(type === "adults" ? 1 : 0, travelers[type] + amount),
    })
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={
          compact
            ? "relative flex h-[46px] w-full items-center rounded-lg border border-slate-300 bg-white py-0 pl-12 pr-4 text-left text-sm font-semibold transition hover:border-blue-200 hover:ring-4 hover:ring-blue-100"
            : "relative flex h-[58px] w-full items-center rounded-2xl border border-slate-200 bg-white py-2 pl-12 pr-4 text-left text-sm font-semibold transition hover:border-blue-200 hover:ring-4 hover:ring-blue-100"
        }
      >
        <span className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-blue-700">
          <FieldIcon name="traveler" />
        </span>

        <span className="flex min-w-0 flex-col">
          {!compact ? (
            <span className="text-[11px] font-bold leading-4 text-slate-400">
              Travelers
            </span>
          ) : null}

          <span
            className={
              compact
                ? "truncate text-sm font-semibold leading-5 text-slate-800"
                : "truncate text-sm leading-5 text-slate-800"
            }
          >
            {formatTravelers(travelers)}
          </span>
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-[0_22px_65px_rgba(15,23,42,0.18)]"
        >
          <TravelerCounter
            title="Adults"
            value={travelers.adults}
            min={1}
            onMinus={() => updateTraveler("adults", -1)}
            onPlus={() => updateTraveler("adults", 1)}
          />

          <TravelerCounter
            title="Children"
            subtitle="Ages 2 to 11"
            value={travelers.children}
            min={0}
            onMinus={() => updateTraveler("children", -1)}
            onPlus={() => updateTraveler("children", 1)}
          />

          <TravelerCounter
            title="Infants on lap"
            subtitle="Under 2"
            value={travelers.infants}
            min={0}
            onMinus={() => updateTraveler("infants", -1)}
            onPlus={() => updateTraveler("infants", 1)}
          />

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}