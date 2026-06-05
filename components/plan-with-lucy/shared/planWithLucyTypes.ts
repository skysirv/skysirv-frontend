export type PlanningMode = "flights" | "hotels" | "cars" | "cruises" | "itinerary"

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
  options: ChoiceOption[]
  prompt: (value: string) => string
}

export type RangeStep = {
  id: string
  type: "range"
  title: string
  helper?: string
  min: number
  max: number
  step?: number
  defaultValue: number
  marks: Array<{ label: string; value: number }>
  icon: string
  formatValue: (value: number) => string
  prompt: (value: string) => string
}

export type FlowStep = ChoiceStep | RangeStep

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
}