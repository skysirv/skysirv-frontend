import {
  isAffirmativeLucyActionConfirmation,
  isNegativeLucyActionConfirmation,
  type LucyAction,
} from "./dashboardFlightAttendant.actions"

import {
  isClearlyLucySessionEntryIntent,
} from "./dashboardFlightAttendant.voiceSession"

import type { FlightAttendantMessage } from "./dashboardFlightAttendant.types"

/* -------------------------------------------------------------------------- */
/* Shared types                                                               */
/* -------------------------------------------------------------------------- */

export type CompletedVoiceTranscriptDecision =
  | "ignore"
  | "too_short"
  | "continue"

export type PendingVoiceActionConfirmationDecision =
  | "negative"
  | "affirmative"
  | "none"

/* -------------------------------------------------------------------------- */
/* Realtime protocol readers                                                  */
/* -------------------------------------------------------------------------- */

export function getRealtimeLucyAudioEventState(data: any) {
  const isAudioDelta =
    data?.type === "response.audio.delta" ||
    data?.type === "response.output_audio.delta"

  const isTranscriptDelta =
    data?.type === "response.output_audio_transcript.delta" &&
    typeof data.delta === "string"

  const isAudioDone =
    data?.type === "response.output_audio_transcript.done" ||
    data?.type === "response.done"

  return {
    isAudioDelta,
    isTranscriptDelta,
    isAudioDone,
  }
}

export function getCompletedRealtimeVoiceTranscript(data: any) {
  if (
    data?.type !== "conversation.item.input_audio_transcription.completed" ||
    typeof data.transcript !== "string" ||
    !data.transcript.trim()
  ) {
    return null
  }

  return normalizeCompletedVoiceTranscript(data.transcript)
}

export function getRealtimeVoiceTranscriptDelta(data: any) {
  if (
    data?.type !== "conversation.item.input_audio_transcription.delta" ||
    typeof data.delta !== "string"
  ) {
    return null
  }

  return data.delta
}

export function getRealtimeLucyTranscriptDelta(data: any) {
  if (
    data?.type !== "response.output_audio_transcript.delta" ||
    typeof data.delta !== "string"
  ) {
    return null
  }

  return data.delta
}

export function getCompletedRealtimeLucyTranscript(data: any) {
  if (
    data?.type !== "response.output_audio_transcript.done" ||
    typeof data.transcript !== "string" ||
    !data.transcript.trim()
  ) {
    return null
  }

  return data.transcript.trim()
}

export function isRealtimeVoiceSpeechStarted(data: any) {
  return data?.type === "input_audio_buffer.speech_started"
}

/* -------------------------------------------------------------------------- */
/* Transcript normalization and Skysirv intent                                */
/* -------------------------------------------------------------------------- */

export function normalizeCompletedVoiceTranscript(transcript: string) {
  return transcript.trim()
}

/* -------------------------------------------------------------------------- */
/* Completed transcript decisions                                             */
/* -------------------------------------------------------------------------- */

export function hasPendingVoiceAction(
  pendingAction: LucyAction | null
) {
  return Boolean(pendingAction)
}

export function shouldIgnoreVoiceTranscript({
  transcript,
  hasPendingAction,
  lucySessionActive = false,
}: {
  transcript: string
  hasPendingAction: boolean
  lucySessionActive?: boolean
}) {
  if (hasPendingAction || lucySessionActive) return false

  return !isClearlyLucySessionEntryIntent(transcript)
}

export function isVoiceTranscriptTooShort(transcript: string) {
  return transcript.length < 3
}

export function getCompletedVoiceTranscriptDecision({
  transcript,
  pendingAction,
  lucySessionActive = false,
}: {
  transcript: string
  pendingAction: LucyAction | null
  lucySessionActive?: boolean
}): CompletedVoiceTranscriptDecision {
  const hasPendingAction = hasPendingVoiceAction(pendingAction)

  if (
    shouldIgnoreVoiceTranscript({
      transcript,
      hasPendingAction,
      lucySessionActive,
    })
  ) {
    return "ignore"
  }

  if (isVoiceTranscriptTooShort(transcript)) {
    return "too_short"
  }

  return "continue"
}

/* -------------------------------------------------------------------------- */
/* Pending Lucy action interpretation                                         */
/* -------------------------------------------------------------------------- */

export function isNegativePendingVoiceActionConfirmation({
  transcript,
  pendingAction,
}: {
  transcript: string
  pendingAction: LucyAction | null
}) {
  if (!pendingAction) return false

  return isNegativeLucyActionConfirmation(transcript)
}

export function isAffirmativePendingVoiceActionConfirmation({
  transcript,
  pendingAction,
}: {
  transcript: string
  pendingAction: LucyAction | null
}) {
  if (!pendingAction) return false

  return isAffirmativeLucyActionConfirmation(transcript)
}

export function getPendingVoiceActionConfirmationDecision({
  transcript,
  pendingAction,
}: {
  transcript: string
  pendingAction: LucyAction | null
}): PendingVoiceActionConfirmationDecision {
  if (
    isNegativePendingVoiceActionConfirmation({
      transcript,
      pendingAction,
    })
  ) {
    return "negative"
  }

  if (
    isAffirmativePendingVoiceActionConfirmation({
      transcript,
      pendingAction,
    })
  ) {
    return "affirmative"
  }

  return "none"
}

export function getNegativePendingVoiceActionReply() {
  return "No problem — I won’t save that action."
}

export function getPendingVoiceActionResponse({
  transcript,
  pendingAction,
}: {
  transcript: string
  pendingAction: LucyAction | null
}) {
  const decision = getPendingVoiceActionConfirmationDecision({
    transcript,
    pendingAction,
  })

  if (decision === "negative") {
    return {
      decision,
      reply: getNegativePendingVoiceActionReply(),
    }
  }

  if (decision === "affirmative") {
    return {
      decision,
      reply: null,
    }
  }

  return {
    decision,
    reply: null,
  }
}

/* -------------------------------------------------------------------------- */
/* Voice message transformations                                              */
/* -------------------------------------------------------------------------- */

export function appendEmptyVoiceUserMessage({
  messages,
  messageId,
}: {
  messages: FlightAttendantMessage[]
  messageId: string
}) {
  return [
    ...messages,
    {
      id: messageId,
      role: "user" as const,
      label: "You",
      text: "",
    },
  ]
}

export function appendEmptyVoiceAssistantMessage({
  messages,
  messageId,
}: {
  messages: FlightAttendantMessage[]
  messageId: string
}) {
  return [
    ...messages,
    {
      id: messageId,
      role: "assistant" as const,
      label: "Lucy",
      text: "",
    },
  ]
}

export function appendVoiceAssistantMessage({
  messages,
  text,
  messageId,
}: {
  messages: FlightAttendantMessage[]
  text: string
  messageId: string
}) {
  return [
    ...messages,
    {
      id: messageId,
      role: "assistant" as const,
      label: "Lucy",
      text,
    },
  ]
}

export function appendVoiceTranscriptDelta({
  messages,
  messageId,
  delta,
}: {
  messages: FlightAttendantMessage[]
  messageId: string
  delta: string
}) {
  return messages.map((message) =>
    message.id === messageId
      ? {
        ...message,
        text: `${message.text}${delta}`,
      }
      : message
  )
}

export function applyCompletedVoiceTranscript({
  messages,
  messageId,
  transcript,
}: {
  messages: FlightAttendantMessage[]
  messageId: string
  transcript: string
}) {
  return messages.map((message) =>
    message.id === messageId
      ? {
        ...message,
        text: transcript,
      }
      : message
  )
}

export function removeVoiceTranscriptMessage({
  messages,
  messageId,
}: {
  messages: FlightAttendantMessage[]
  messageId: string
}) {
  return messages.filter((message) => message.id !== messageId)
}

/* -------------------------------------------------------------------------- */
/* Assistant transcript message resolution                                    */
/* -------------------------------------------------------------------------- */

export function findEmptyVoiceAssistantMessage(
  messages: FlightAttendantMessage[]
) {
  return messages
    .slice()
    .reverse()
    .find(
      (message) =>
        message.role === "assistant" &&
        message.label === "Lucy" &&
        !message.text.trim()
    )
}

export function resolveVoiceAssistantMessageId({
  messages,
  createMessageId,
}: {
  messages: FlightAttendantMessage[]
  createMessageId: () => string
}) {
  const existingEmptyAssistantMessage =
    findEmptyVoiceAssistantMessage(messages)

  return {
    messageId:
      existingEmptyAssistantMessage?.id || createMessageId(),
    shouldAppendMessage: !existingEmptyAssistantMessage,
  }
}

export function applyRealtimeVoiceTranscriptDelta({
  messages,
  activeMessageId,
  delta,
  createMessageId,
}: {
  messages: FlightAttendantMessage[]
  activeMessageId: string | null
  delta: string
  createMessageId: () => string
}) {
  const messageId = activeMessageId || createMessageId()

  const messagesWithUser =
    activeMessageId
      ? messages
      : appendEmptyVoiceUserMessage({
        messages,
        messageId,
      })

  return {
    messageId,
    messages: appendVoiceTranscriptDelta({
      messages: messagesWithUser,
      messageId,
      delta,
    }),
  }
}

export function createVoiceUserMessage({
  messages,
  createMessageId,
}: {
  messages: FlightAttendantMessage[]
  createMessageId: () => string
}) {
  const messageId = createMessageId()

  return {
    messageId,
    messages: appendEmptyVoiceUserMessage({
      messages,
      messageId,
    }),
  }
}

export function applyRealtimeLucyTranscriptDelta({
  messages,
  activeMessageId,
  delta,
  createMessageId,
}: {
  messages: FlightAttendantMessage[]
  activeMessageId: string | null
  delta: string
  createMessageId: () => string
}) {
  const resolution = activeMessageId
    ? {
      messageId: activeMessageId,
      shouldAppendMessage: false,
    }
    : resolveVoiceAssistantMessageId({
      messages,
      createMessageId,
    })

  const messagesWithAssistant =
    resolution.shouldAppendMessage
      ? appendEmptyVoiceAssistantMessage({
        messages,
        messageId: resolution.messageId,
      })
      : messages

  return {
    messageId: resolution.messageId,
    messages: appendVoiceTranscriptDelta({
      messages: messagesWithAssistant,
      messageId: resolution.messageId,
      delta,
    }),
  }
}

export function getRealtimeLucyAudioCompletionState({
  hasPendingAction,
  suppressRealtimeSpeechText,
}: {
  hasPendingAction: boolean
  suppressRealtimeSpeechText: boolean
}) {
  return {
    shouldClearRealtimeSpeechTextSuppression:
      suppressRealtimeSpeechText,
    shouldClearVoiceAssistantReplySuppression:
      !hasPendingAction,
  }
}