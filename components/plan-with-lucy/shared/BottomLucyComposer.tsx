import { motion } from "framer-motion"
import LargeChevron from "@/components/ui/LargeChevron"

import type {
  ConfirmedAnswer,
  FlowStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"

export default function BottomLucyComposer({
  modeLabel,
  composerText,
  confirmedSteps,
  confirmedAnswers,
  onComposerChange,
  onSend,
}: {
  modeLabel: string
  composerText: string
  confirmedSteps: FlowStep[]
  confirmedAnswers: Record<string, ConfirmedAnswer>
  onComposerChange: (value: string) => void
  onSend?: () => void
}) {
  const visibleConfirmedSteps = confirmedSteps.slice(0, 9)
  const hiddenConfirmedStepCount = Math.max(
    0,
    confirmedSteps.length - visibleConfirmedSteps.length,
  )

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100vw-40px)] max-w-3xl -translate-x-1/2">
      <div className="rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)]">
        <textarea
          value={composerText}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder="Get Lucy started with a prompt..."
          rows={2}
          className="min-h-[46px] w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 text-sm font-medium leading-6 text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-lg text-orange-500"
            aria-label="Voice input"
          >
            ◉
          </button>

          <span className="inline-flex min-h-[30px] items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-500">
            Deep Planning
            <span aria-hidden="true">🔒</span>
          </span>

          <span className="inline-flex min-h-[30px] items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
            {modeLabel}
          </span>

          <div className="flex flex-nowrap items-center -space-x-2">
            {visibleConfirmedSteps.map((step) => {
              const answer = confirmedAnswers[step.id]

              if (!answer) return null

              return (
                <motion.span
                  key={step.id}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  title={answer.label}
                  aria-label={answer.label}
                  className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-sm text-blue-700 shadow-sm ring-2 ring-white"
                >
                  {answer.icon}
                </motion.span>
              )
            })}

            {hiddenConfirmedStepCount > 0 && (
              <span
                title={`${hiddenConfirmedStepCount} more confirmed prompt selections`}
                className="relative inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-2 text-[10px] font-black text-slate-500 shadow-sm ring-2 ring-white"
              >
                +{hiddenConfirmedStepCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onSend}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-sm transition hover:bg-blue-800"
            aria-label="Send to Lucy"
          >
            <LargeChevron direction="right" />
          </button>
        </div>
      </div>
    </div>
  )
}