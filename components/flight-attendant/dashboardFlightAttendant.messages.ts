import { type FlightAttendantMessage } from "./dashboardFlightAttendant.types"

export function appendAssistantPlaceholder(
  messages: FlightAttendantMessage[],
  messageId: string
): FlightAttendantMessage[] {
  return [
    ...messages,
    {
      id: messageId,
      role: "assistant",
      label: "Lucy",
      text: "",
    },
  ]
}

export function updateAssistantMessageText(
  messages: FlightAttendantMessage[],
  messageId: string,
  text: string
): FlightAttendantMessage[] {
  return messages.map((message) =>
    message.id === messageId
      ? {
        ...message,
        text,
      }
      : message
  )
}

export function appendAssistantMessage(
  messages: FlightAttendantMessage[],
  text: string,
  messageId: string
): FlightAttendantMessage[] {
  return [
    ...messages,
    {
      id: messageId,
      role: "assistant",
      label: "Lucy",
      text,
    },
  ]
}

export function appendUserMessage(
  messages: FlightAttendantMessage[],
  message: FlightAttendantMessage
) {
  return [...messages, message]
}