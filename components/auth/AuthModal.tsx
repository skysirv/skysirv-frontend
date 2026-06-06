"use client"

import { ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

type AuthModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  maxWidthClassName?: string
  hideCloseButton?: boolean
  headerContent?: ReactNode
  disableBackdropClose?: boolean
  heroImageSrc?: string
  heroImageAlt?: string
}

export default function AuthModal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidthClassName = "max-w-md",
  hideCloseButton = false,
  headerContent,
  disableBackdropClose = false,
  heroImageSrc,
  heroImageAlt = "",
}: AuthModalProps) {
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      return
    }

    const timer = window.setTimeout(() => {
      setShouldRender(false)
    }, 300)

    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = "hidden"

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !disableBackdropClose) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose, disableBackdropClose])

  if (!mounted || !shouldRender) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex min-h-screen items-center justify-center px-4 py-6 transition-all duration-300 ease-out ${open
        ? "pointer-events-auto bg-black/40 opacity-100 backdrop-blur-sm"
        : "pointer-events-none bg-black/0 opacity-0 backdrop-blur-0"
        }`}
      onClick={open && !disableBackdropClose ? onClose : undefined}
      aria-hidden={!open}
    >
      <div
        className={`relative w-full ${maxWidthClassName} overflow-hidden rounded-[2rem] p-[3px] shadow-xl transition-all duration-300 ease-out ${open
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-1 scale-[0.992] opacity-0"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="absolute inset-[-80%] animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,rgba(34,211,238,0.95)_35deg,rgba(59,130,246,0.95)_90deg,rgba(168,85,247,0.95)_145deg,rgba(236,72,153,0.95)_205deg,rgba(251,146,60,0.95)_265deg,rgba(34,197,94,0.95)_325deg,transparent_360deg)] opacity-90"
        />

        <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-white">
          {heroImageSrc && (
            <div className="relative h-36 overflow-hidden bg-slate-100">
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                className="h-full w-full object-cover"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/5 to-blue-700/20"
              />
            </div>
          )}

          <div className="px-6 py-5 sm:px-8 sm:py-6">
            {(headerContent || title || description) && (
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  {headerContent ? (
                    headerContent
                  ) : (
                    <>
                      {title && (
                        <h2 className="text-2xl font-bold text-slate-900">
                          {title}
                        </h2>
                      )}

                      {description && (
                        <p className="mt-2 text-sm text-slate-600">
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}