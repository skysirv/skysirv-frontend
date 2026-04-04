"use client"

import { ReactNode, useEffect } from "react"

type AuthModalProps = {
    open: boolean
    onClose: () => void
    title?: string
    description?: string
    children: ReactNode
    maxWidthClassName?: string
}

export default function AuthModal({
    open,
    onClose,
    title,
    description,
    children,
    maxWidthClassName = "max-w-md",
}: AuthModalProps) {
    useEffect(() => {
        if (!open) return

        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = originalOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidthClassName} rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8`}
                onClick={(event) => event.stopPropagation()}
            >
                {(title || description) && (
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
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
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close modal"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>
    )
}