"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"

type BookingLucyComposerContextValue = {
  modeLabel: string
  composerText: string
  onComposerChange: (value: string) => void
}

const BookingLucyComposerContext =
  createContext<BookingLucyComposerContextValue | null>(null)

export function BookingLucyComposerProvider({
  value,
  children,
}: {
  value: BookingLucyComposerContextValue
  children: ReactNode
}) {
  return (
    <BookingLucyComposerContext.Provider value={value}>
      {children}
    </BookingLucyComposerContext.Provider>
  )
}

export function useBookingLucyComposer() {
  return useContext(BookingLucyComposerContext)
}