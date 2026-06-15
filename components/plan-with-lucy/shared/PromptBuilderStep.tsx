import { useState } from "react"

import type {
  ChoiceOption,
  FlowStep,
} from "@/components/plan-with-lucy/shared/planWithLucyTypes"

export default function PromptBuilderStep({
  step,
  rangeValue,
  onRangeChange,
  onChoiceSelect,
  onMultiChoiceConfirm,
  onRangeConfirm,
}: {
  step: FlowStep
  rangeValue: number
  onRangeChange: (value: number) => void
  onChoiceSelect: (option: ChoiceOption) => void
  onMultiChoiceConfirm: (options: ChoiceOption[]) => void
  onRangeConfirm: () => void
}) {
  const [selectedMultiChoiceLabels, setSelectedMultiChoiceLabels] = useState<
    string[]
  >([])

  function toggleMultiChoiceOption(option: ChoiceOption) {
    setSelectedMultiChoiceLabels((current) => {
      if (current.includes(option.label)) {
        return current.filter((label) => label !== option.label)
      }

      return [...current, option.label]
    })
  }

  if (step.type === "choice") {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">{step.title}</h2>

          {step.helper && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {step.helper}
            </p>
          )}
        </div>

        {step.variant === "pill" ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChoiceSelect(option)}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="text-lg transition group-hover:scale-110">
                  {option.icon}
                </span>

                <span>{option.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {step.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChoiceSelect(option)}
                className="group flex min-h-[86px] flex-col items-center justify-center rounded-xl border border-transparent bg-gradient-to-br from-emerald-50 via-yellow-50 to-pink-50 px-4 py-4 text-center transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_16px_35px_rgba(37,99,235,0.16)]"
              >
                <span className="text-2xl transition group-hover:scale-110">
                  {option.icon}
                </span>

                <span className="mt-2 text-sm font-semibold text-slate-700">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (step.type === "multi-choice") {
    const selectedOptions = step.options.filter((option) =>
      selectedMultiChoiceLabels.includes(option.label),
    )

    return (
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">{step.title}</h2>

          {step.helper && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {step.helper}
            </p>
          )}
        </div>

        {step.variant === "pill" ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((option) => {
              const isSelected = selectedMultiChoiceLabels.includes(
                option.label,
              )

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => toggleMultiChoiceOption(option)}
                  className={`group inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 ${isSelected
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                >
                  <span className="text-lg transition group-hover:scale-110">
                    {option.icon}
                  </span>

                  <span>{option.label}</span>

                  {isSelected && (
                    <span className="ml-1 text-xs font-black">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {step.options.map((option) => {
              const isSelected = selectedMultiChoiceLabels.includes(
                option.label,
              )

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => toggleMultiChoiceOption(option)}
                  className={`group relative flex min-h-[86px] flex-col items-center justify-center rounded-xl border px-4 py-4 text-center transition hover:-translate-y-1 ${isSelected
                    ? "border-blue-200 bg-blue-50 shadow-[0_16px_35px_rgba(37,99,235,0.14)]"
                    : "border-transparent bg-gradient-to-br from-emerald-50 via-yellow-50 to-pink-50 hover:border-blue-100 hover:shadow-[0_16px_35px_rgba(37,99,235,0.16)]"
                    }`}
                >
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-[11px] font-black text-white">
                      ✓
                    </span>
                  )}

                  <span className="text-2xl transition group-hover:scale-110">
                    {option.icon}
                  </span>

                  <span className="mt-2 text-sm font-semibold text-slate-700">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => onMultiChoiceConfirm(selectedOptions)}
          disabled={selectedOptions.length === 0}
          className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-blue-700 bg-blue-700 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          Confirm selected
        </button>
      </div>
    )
  }

  const getSliderPercent = (value: number) => {
    return ((value - step.min) / (step.max - step.min)) * 100
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">{step.title}</h2>

          {step.helper && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {step.helper}
            </p>
          )}
        </div>

        <p className="text-sm font-bold text-blue-700">
          {step.formatValue(rangeValue)}
        </p>
      </div>

      <input
        type="range"
        min={step.min}
        max={step.max}
        step={step.step ?? 1}
        value={rangeValue}
        onChange={(event) => onRangeChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-700"
      />

      <div className="relative mt-4 h-5 text-xs font-semibold text-slate-400">
        {step.marks.map((mark) => {
          const markLeft = Math.min(
            96,
            Math.max(4, getSliderPercent(mark.value)),
          )

          return (
            <span
              key={mark.label}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${markLeft}%` }}
            >
              {mark.label}
            </span>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onRangeConfirm}
        className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-blue-700 bg-blue-700 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600"
      >
        Confirm
      </button>
    </div>
  )
}