"use client"

import { motion, AnimatePresence } from "framer-motion"

type WelcomeModalProps = {
  open: boolean
  plan: "free" | "pro" | "business"
  onContinue: () => void
}

function getPlanCopy(plan: "free" | "pro" | "business") {
  if (plan === "pro") {
    return {
      eyebrow: "Welcome to Pro",
      title: "Your Pro intelligence dashboard is ready",
      description:
        "You now have access to deeper route behavior, stronger signals, and a more capable Skysirv intelligence layer.",
      buttonLabel: "Enter Pro Dashboard",
    }
  }

  if (plan === "business") {
    return {
      eyebrow: "Welcome to Business",
      title: "Your full intelligence dashboard is ready",
      description:
        "You now have access to the full Skysirv intelligence engine, broader monitoring power, and deeper route analysis.",
      buttonLabel: "Enter Business Dashboard",
    }
  }

  return {
    eyebrow: "Welcome to Free",
    title: "Your Free dashboard is ready",
    description:
      "You’re all set to begin monitoring routes, previewing intelligence, and exploring the Skysirv experience.",
    buttonLabel: "Enter Free Dashboard",
  }
}

export default function WelcomeModal({
  open,
  plan,
  onContinue,
}: WelcomeModalProps) {
  const copy = getPlanCopy(plan)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-slate-950/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-10"
            >
              <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                {copy.eyebrow}
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {copy.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {copy.description}
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={onContinue}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {copy.buttonLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}