import type { ReactNode } from "react"

type BusinessLabSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function BusinessLabSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: BusinessLabSectionProps) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/20",
        className
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {eyebrow}
            </p>
          )}

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {children}
    </section>
  )
}