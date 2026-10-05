import type React from "react"

import type { LucyAction } from "./dashboardFlightAttendant.actions"

import {
  buildLucyActionFromToolCall,
  type LucyToolCallInput,
} from "./dashboardFlightAttendant.toolActions"

import type { FlightAttendantMessage } from "./dashboardFlightAttendant.types"

import { createMessageId } from "./dashboardFlightAttendant.utils"

type LastVoiceToolCall = {
  key: string
  timestamp: number
}

export type RealtimeVoiceToolHandlerDependencies = {
  lastVoiceToolCallRef: React.MutableRefObject<LastVoiceToolCall | null>
  pendingLucyActionRef: React.MutableRefObject<LucyAction | null>
  dataChannelRef: React.MutableRefObject<RTCDataChannel | null>
  setPendingLucyAction: React.Dispatch<React.SetStateAction<LucyAction | null>>
  setMessages: React.Dispatch<
    React.SetStateAction<FlightAttendantMessage[]>
  >
  speakConfirmation: (text: string) => void
  suppressNextAssistantReplyRef: React.MutableRefObject<boolean>
  clearActiveAssistantMessage: () => void
  executeImmediateAction: (
    action: LucyAction,
    realtimeToolCallId: string | null
  ) => void
}

export function shouldIgnoreDuplicateVoiceToolCall(
  key: string,
  lastCallRef: React.MutableRefObject<LastVoiceToolCall | null>
) {
  const now = Date.now()
  const lastCall = lastCallRef.current

  if (
    lastCall &&
    lastCall.key === key &&
    now - lastCall.timestamp < 5000
  ) {
    return true
  }

  lastCallRef.current = {
    key,
    timestamp: now,
  }

  return false
}

function prepareRealtimeConfirmation({
  action,
  confirmationText,
  duplicateKey,
  dependencies,
}: {
  action: LucyAction
  confirmationText: string
  duplicateKey: string
  dependencies: RealtimeVoiceToolHandlerDependencies
}) {
  const {
    lastVoiceToolCallRef,
    pendingLucyActionRef,
    dataChannelRef,
    setPendingLucyAction,
    setMessages,
    speakConfirmation,
    suppressNextAssistantReplyRef,
    clearActiveAssistantMessage,
  } = dependencies

  if (
    shouldIgnoreDuplicateVoiceToolCall(
      duplicateKey,
      lastVoiceToolCallRef
    )
  ) {
    return false
  }

  setPendingLucyAction(action)
  pendingLucyActionRef.current = action
  clearActiveAssistantMessage()
  suppressNextAssistantReplyRef.current = true

  try {
    dataChannelRef.current?.send(
      JSON.stringify({
        type: "response.cancel",
      })
    )
  } catch {
    // Ignore cancel errors.
  }

  setMessages((prev) => {
    const lastMessage = prev[prev.length - 1]

    if (
      lastMessage?.role === "assistant" &&
      lastMessage.text.trim() === confirmationText.trim()
    ) {
      return prev
    }

    return [
      ...prev,
      {
        id: createMessageId(),
        role: "assistant",
        label: "Lucy",
        text: confirmationText,
      },
    ]
  })

  speakConfirmation(confirmationText)

  return true
}

export function handleRealtimeVoiceToolItem(
  item: LucyToolCallInput,
  dependencies: RealtimeVoiceToolHandlerDependencies
) {
  const realtimeToolCallId =
    typeof item.call_id === "string" &&
      item.call_id.trim()
      ? item.call_id.trim()
      : null

  const preparedAction = buildLucyActionFromToolCall(item)

  if (!preparedAction) return null

  if (
    preparedAction.action.type ===
    "save_lucy_memory"
  ) {
    if (
      shouldIgnoreDuplicateVoiceToolCall(
        preparedAction.duplicateKey,
        dependencies.lastVoiceToolCallRef
      )
    ) {
      return null
    }

    dependencies.clearActiveAssistantMessage()

    dependencies.suppressNextAssistantReplyRef.current =
      true

    try {
      dependencies.dataChannelRef.current?.send(
        JSON.stringify({
          type: "response.cancel",
        })
      )
    } catch {
      // Ignore cancel errors.
    }

    dependencies.executeImmediateAction(
      preparedAction.action,
      realtimeToolCallId
    )

    return null
  }

  const didPrepare = prepareRealtimeConfirmation({
    action: preparedAction.action,
    confirmationText:
      preparedAction.confirmationText,
    duplicateKey:
      preparedAction.duplicateKey,
    dependencies,
  })

  if (!didPrepare) return null

  return realtimeToolCallId
}