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

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

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
        ? "pointer-events-auto bg-black/40 backdrop-blur-sm opacity-100"
        : "pointer-events-none bg-black/0 backdrop-blur-0 opacity-0"
        }`}
      onClick={open && !disableBackdropClose ? onClose : undefined}
      aria-hidden={!open}
    >
      <div
        className={`w-full ${maxWidthClassName} rounded-3xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-300 ease-out sm:p-8 ${open
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-1 scale-[0.992] opacity-0"
          }`}
        onClick={(event) => event.stopPropagation()}
      >
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
    </div>,
    document.body
  )
}