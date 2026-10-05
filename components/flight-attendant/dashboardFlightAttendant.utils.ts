import {
  type FlightAttendantMessage,
  type LucyChatThread,
} from "./dashboardFlightAttendant.types"

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function createLucyWelcomeMessage(
  welcome: string
): FlightAttendantMessage {
  return {
    id: "welcome-1",
    role: "assistant",
    label: "Lucy",
    text: welcome,
  }
}

export function createLucyThread(title: string, welcome: string): LucyChatThread {
  const now = Date.now()

  return {
    id: createMessageId(),
    title,
    messages: [createLucyWelcomeMessage(welcome)],
    pinned: false,
    createdAt: now,
    updatedAt: now,
  }
}