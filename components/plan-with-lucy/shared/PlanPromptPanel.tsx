import { AnimatePresence, motion } from "framer-motion"

import PromptBuilderStep from "@/components/plan-with-lucy/shared/PromptBuilderStep"
import type {
  ChoiceOption,
  ChoiceStep,
  FlowStep,
  RangeStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"

export default function PlanPromptPanel({
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
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_rgba(15,23,42,0.08)] sm:p-6">
      <AnimatePresence mode="popLayout">
        {visibleSteps.map((step, index) => (
          <motion.div
            key={step.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <PromptBuilderStep
              step={step}
              rangeValue={
                rangeValues[step.id] ??
                (step.type === "range" ? step.defaultValue : 0)
              }
              onRangeChange={(value) => {
                onRangeChange(step.id, value)
              }}
              onChoiceSelect={(option) => {
                if (step.type === "choice") {
                  onChoiceSelect(step, option)
                }
              }}
              onRangeConfirm={() => {
                if (step.type === "range") {
                  onRangeConfirm(step)
                }
              }}
            />

            {index < visibleSteps.length - 1 && (
              <div className="my-8 h-px bg-slate-200" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {visibleSteps.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="py-12 text-center"
        >
          <div className="mb-6 flex justify-center">
            <img
              src="/images/stock/lucy/lucy-watch.png"
              alt="Lucy"
              className="h-[230px] w-auto object-contain"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-800">
            Your Lucy prompt is ready.
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
            Review the prompt below, adjust anything you want, then send it to
            Lucy.
          </p>
        </motion.div>
      )}
    </div>
  )
}