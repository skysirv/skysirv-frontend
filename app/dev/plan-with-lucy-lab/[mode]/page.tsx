import { notFound } from "next/navigation"
import PlanWithLucyLabShell from "@/components/plan-with-lucy/PlanWithLucyLabShell"

type LabModeSlug =
  | "flights"
  | "hotels"
  | "car-rentals"
  | "cruises"
  | "itinerary"

type PlanningMode = "flights" | "hotels" | "cars" | "cruises" | "itinerary"

const modeMap: Record<LabModeSlug, PlanningMode> = {
  flights: "flights",
  hotels: "hotels",
  "car-rentals": "cars",
  cruises: "cruises",
  itinerary: "itinerary",
}

export default function PlanWithLucyModePage({
  params,
}: {
  params: { mode: string }
}) {
  const initialMode = modeMap[params.mode as LabModeSlug]

  if (!initialMode) {
    notFound()
  }

  return <PlanWithLucyLabShell initialMode={initialMode} />
}