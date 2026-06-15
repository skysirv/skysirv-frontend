import { notFound } from "next/navigation"
import BookingLabShell from "@/components/booking/BookingLabShell"

type BookingModeSlug =
  | "flights"
  | "hotels"
  | "car-rentals"
  | "cruises"
  | "featured-experiences"

type BookingMode =
  | "flights"
  | "hotels"
  | "cars"
  | "cruises"
  | "experiences"

const modeMap: Record<BookingModeSlug, BookingMode> = {
  flights: "flights",
  hotels: "hotels",
  "car-rentals": "cars",
  cruises: "cruises",
  "featured-experiences": "experiences",
}

export default function BookingModePage({
  params,
}: {
  params: { mode: string }
}) {
  const initialMode = modeMap[params.mode as BookingModeSlug]

  if (!initialMode) {
    notFound()
  }

  return <BookingLabShell initialMode={initialMode} />
}