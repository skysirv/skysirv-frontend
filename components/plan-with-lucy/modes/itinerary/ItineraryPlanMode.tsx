import PlanPromptPanel from "@/components/plan-with-lucy/shared/PlanPromptPanel"
import type {
  ChoiceOption,
  ChoiceStep,
  FlowStep,
  RangeStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"

export default function ItineraryPlanMode({
  visibleSteps,
  rangeValues,
  onRangeChange,
  onChoiceSelect,
  onRangeConfirm,
}: {
  visibleSteps: FlowStep[]
  rangeValues: Record<string, number>
  onRangeChange: (stepId: string, value: number) => void
  onChoiceSelect: (step: ChoiceStep, option: ChoiceOption) => void
  onRangeConfirm: (step: RangeStep) => void
}) {
  return (
    <PlanPromptPanel
      visibleSteps={visibleSteps}
      rangeValues={rangeValues}
      onRangeChange={onRangeChange}
      onChoiceSelect={onChoiceSelect}
      onRangeConfirm={onRangeConfirm}
    />
  )
}