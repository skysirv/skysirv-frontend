export type PlanningMode = "flights" | "hotels" | "cars" | "cruises" | "itinerary"
export type ItineraryBookingMode = "flights" | "hotels" | "cars" | "cruises"

export type ChoiceOption = {
  icon: string
  label: string
  value?: string
}

export type ChoiceStep = {
  id: string
  type: "choice"
  title: string
  helper?: string
  variant?: "card" | "pill"
  requiresTripInclude?: ItineraryBookingMode[]
  options: ChoiceOption[]
  prompt: (value: string) => string
}

export type MultiChoiceStep = {
  id: string
  type: "multi-choice"
  title: string
  helper?: string
  variant?: "card" | "pill"
  icon: string
  requiresTripInclude?: ItineraryBookingMode[]
  options: ChoiceOption[]
  prompt: (values: string[]) => string
}

export type RangeStep = {
  id: string
  type: "range"
  title: string
  helper?: string
  requiresTripInclude?: ItineraryBookingMode[]
  min: number
  max: number
  step?: number
  defaultValue: number
  marks: Array<{ label: string; value: number }>
  icon: string
  formatValue: (value: number) => string
  prompt: (value: string) => string
}

export type FlowStep = ChoiceStep | MultiChoiceStep | RangeStep

export type ModeFlow = {
  id: PlanningMode
  label: string
  title: string
  subtitle: string
  promptStart: string
  steps: FlowStep[]
}

export type ConfirmedAnswer = {
  icon: string
  label: string
  values?: string[]
}