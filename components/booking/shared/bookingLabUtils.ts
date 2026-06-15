import type { DateRange, TravelersState } from "./bookingLabTypes"

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function formatBookingDate(date: Date | null) {
  if (!date) return ""

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
}

export function formatDateRange(range: DateRange) {
  const start = formatBookingDate(range.start)
  const end = formatBookingDate(range.end)

  if (start && end) return `${start} – ${end}`
  if (start) return `${start} – Returning`

  return ""
}

export function formatTravelers(travelers: TravelersState) {
  const adultLabel = travelers.adults === 1 ? "Adult" : "Adults"
  const childLabel = travelers.children === 1 ? "Child" : "Children"
  const infantLabel = travelers.infants === 1 ? "Infant" : "Infants"

  if (travelers.children > 0 && travelers.infants > 0) {
    const countedTravelers = travelers.adults + travelers.children

    return `${countedTravelers} Travelers, ${travelers.infants} ${infantLabel}`
  }

  if (travelers.children > 0) {
    return `${travelers.adults} ${adultLabel}, ${travelers.children} ${childLabel}`
  }

  if (travelers.infants > 0) {
    return `${travelers.adults} ${adultLabel}, ${travelers.infants} ${infantLabel}`
  }

  return `${travelers.adults} ${adultLabel}`
}

export function isSameDate(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

export function isDateBetween(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
) {
  if (!startDate || !endDate) return false

  const time = date.getTime()

  return time > startDate.getTime() && time < endDate.getTime()
}

export function getMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Array<Date | null> = []

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    days.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day))
  }

  return days
}