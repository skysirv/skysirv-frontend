"use client"

import type { ReactNode } from "react"

type WrappedCompactModalProps = {
  eyebrow: string
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export default function WrappedCompactModal({
  eyebrow,
  title,
  description,
  onClose,
  children,
  footer,
}: WrappedCompactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              {eyebrow}
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {title}
            </h3>

            {description ? (
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="max-h-[54vh] overflow-y-auto px-6 py-5 [scrollbar-color:rgba(148,163,184,0.45)_rgba(241,245,249,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400">
          {children}
        </div>

        {footer ? (
          <div className="border-t border-slate-200 px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}