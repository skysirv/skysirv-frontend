import PlanPromptPanel from "@/components/plan-with-lucy/shared/PlanPromptPanel"
import type {
  ChoiceOption,
  ChoiceStep,
  FlowStep,
  MultiChoiceStep,
  RangeStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"

export default function CarsPlanMode({
  visibleSteps,
  rangeValues,
  onRangeChange,
  onChoiceSelect,
  onMultiChoiceConfirm,
  onRangeConfirm,
}: {
  visibleSteps: FlowStep[]
  rangeValues: Record<string, number>
  onRangeChange: (stepId: string, value: number) => void
  onChoiceSelect: (step: ChoiceStep, option: ChoiceOption) => void
  onMultiChoiceConfirm: (step: MultiChoiceStep, options: ChoiceOption[]) => void
  onRangeConfirm: (step: RangeStep) => void
}) {
  return (
    <PlanPromptPanel
      visibleSteps={visibleSteps}
      rangeValues={rangeValues}
      onRangeChange={onRangeChange}
      onChoiceSelect={onChoiceSelect}
      onMultiChoiceConfirm={onMultiChoiceConfirm}
      onRangeConfirm={onRangeConfirm}
    />
  )
}