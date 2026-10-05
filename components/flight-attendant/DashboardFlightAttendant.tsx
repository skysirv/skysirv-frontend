"use client"

import { FormEvent, useEffect, useRef, useState } from "react"

import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import { getAuthToken } from "@/utils/auth-storage"

import {
  isAffirmativeLucyActionConfirmation,
  isNegativeLucyActionConfirmation,
  type LucyAction,
} from "./dashboardFlightAttendant.actions"

import {
  executeLucyAction,
} from "./dashboardFlightAttendant.actionExecution"

import {
  createLucyConversation,
  getRecentLucyConversations,
  loadLatestLucyConversation,
  loadLucyConversation,
  persistLucyConversationMessage,
  sendLucyChatMessage,
  updateLucyConversation,
  type LucyConversationSummary,
} from "./dashboardFlightAttendant.chat"

import {
  API_BASE_URL,
  LUCY_ACTIVE_CHAT_THREAD_STORAGE_KEY,
  LUCY_CHAT_THREADS_STORAGE_KEY,
  tierConfig,
} from "./dashboardFlightAttendant.config"

import {
  formatLucyReplyText,
  formatReadableFlightDate,
  formatVisibleFlightPrice,
  normalizeFlightSearchText,
  sanitizeLucyText,
} from "./dashboardFlightAttendant.formatters"

import {
  appendAssistantPlaceholder,
  appendUserMessage,
  updateAssistantMessageText,
} from "./dashboardFlightAttendant.messages"

import { typeAssistantMessage } from "./dashboardFlightAttendant.typing"

import {
  type DashboardFlightAttendantProps,
  type DashboardLucyTier,
  type DashboardRouteContext,
  type FlightAttendantMessage,
  type LucyChatThread,
} from "./dashboardFlightAttendant.types"

import {
  cn,
  createLucyThread,
  createMessageId,
} from "./dashboardFlightAttendant.utils"

import { buildLocalVisibleFlightSaveAction } from "./dashboardFlightAttendant.visibleFlights"

import {
  clearRealtimeMicrophoneResumeTimer as clearRealtimeMicrophoneResumeTimerHelper,
  pauseRealtimeMicrophone as pauseRealtimeMicrophoneHelper,
  resumeRealtimeMicrophone as resumeRealtimeMicrophoneHelper,
  scheduleRealtimeMicrophoneResume as scheduleRealtimeMicrophoneResumeHelper,
  setRealtimeMicrophoneEnabled as setRealtimeMicrophoneEnabledHelper,
} from "./dashboardFlightAttendant.voice"

import {
  handleRealtimeVoiceToolItem,
} from "./dashboardFlightAttendant.voiceTools"

import {
  appendVoiceAssistantMessage,
  appendVoiceTranscriptDelta,
  applyCompletedVoiceTranscript,
  applyRealtimeLucyTranscriptDelta,
  applyRealtimeVoiceTranscriptDelta,
  createVoiceUserMessage,
  getCompletedRealtimeVoiceTranscript,
  getCompletedRealtimeLucyTranscript,
  getCompletedVoiceTranscriptDecision,
  getPendingVoiceActionResponse,
  getRealtimeLucyAudioCompletionState,
  getRealtimeLucyAudioEventState,
  getRealtimeLucyTranscriptDelta,
  getRealtimeVoiceTranscriptDelta,
  isRealtimeVoiceSpeechStarted,
  removeVoiceTranscriptMessage,
} from "./dashboardFlightAttendant.voiceTranscript"

import {
  getRecentlyConfirmedWatchlistResponse,
} from "./dashboardFlightAttendant.watchlistVoice"

type LucyVoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error"

type LucyRealtimeSessionResponse = {
  success?: boolean
  conversationId?: string
  model?: string
  voice?: string
  plan?: string
  session?: {
    value?: string
    client_secret?: {
      value?: string
    }
    session?: {
      client_secret?: {
        value?: string
      }
    }
  }
  error?: string
}

export default function DashboardFlightAttendant({
  tier,
  placement = "floating",
  defaultOpen = false,
  dashboardRoutes = [],
  requestedConversationId = null,
  newConversationRequestKey = 0,
  initialPrompt = null,
  onActiveConversationChange,
  onConversationCreated,
  onConversationUpdated,
}: DashboardFlightAttendantProps) {
  const config = tierConfig[tier]
  const isWorkspace = placement === "workspace"

  const [open, setOpen] = useState(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] =
    useState<FlightAttendantMessage[]>(
      isWorkspace
        ? []
        : [
          {
            id: "welcome-1",
            role: "assistant",
            label: "Lucy",
            text: config.welcome,
          },
        ]
    )
  const [chatInput, setChatInput] = useState("")
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null)
  const [selectedAttachmentPreviewUrl, setSelectedAttachmentPreviewUrl] =
    useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false)
  const [conversationRestoring, setConversationRestoring] =
    useState(true)

  const isWorkspaceEmpty =
    isWorkspace &&
    !conversationRestoring &&
    !messages.some((message) => message.role === "user")

  const [recentLucyConversations, setRecentLucyConversations] =
    useState<LucyConversationSummary[]>([])

  const [recentConversationsOpen, setRecentConversationsOpen] =
    useState(false)

  const [conversationSwitching, setConversationSwitching] =
    useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [pendingLucyAction, setPendingLucyAction] =
    useState<LucyAction | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<LucyVoiceStatus>("idle")
  const suppressNextVoiceAssistantReplyRef = useRef(false)
  const suppressNextRealtimeSpeechTextRef = useRef(false)
  const localRealtimeSpeechMessageIdRef = useRef<string | null>(null)
  const pendingLucyActionRef = useRef<LucyAction | null>(null)
  const pendingRealtimeToolCallIdRef = useRef<string | null>(null)
  const activeLucyConversationIdRef = useRef<string | null>(null)
  const lastNewConversationRequestKeyRef =
    useRef(newConversationRequestKey)
  const lastInitialPromptRef =
    useRef<string | null>(null)
  const lastVoiceToolCallRef = useRef<{
    key: string
    timestamp: number
  } | null>(null)
  const hasHomepagePromptRef =
    useRef(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const attachmentMenuRef = useRef<HTMLDivElement | null>(null)
  const attachmentInputRef = useRef<HTMLInputElement | null>(null)
  const composerFormRef = useRef<HTMLFormElement | null>(null)

  const realtimePeerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const realtimeLocalStreamRef = useRef<MediaStream | null>(null)
  const realtimeMicTrackRef = useRef<MediaStreamTrack | null>(null)
  const realtimeAudioSenderRef = useRef<RTCRtpSender | null>(null)
  const realtimeAudioElementRef = useRef<HTMLAudioElement | null>(null)
  const realtimeDataChannelRef = useRef<RTCDataChannel | null>(null)
  const realtimeMicPausedForLucyRef = useRef(false)
  const realtimeMicResumeTimerRef = useRef<number | null>(null)
  const latestDashboardRoutesRef = useRef<DashboardRouteContext[]>(dashboardRoutes)
  const confirmedVoiceWatchlistRoutesRef = useRef<
    Array<{
      origin: string
      destination: string
      departureDate: string
      routeLabel?: string
      confirmedAt: number
    }>
  >([])

  useEffect(() => {
    const incomingPrompt = initialPrompt?.trim()

    if (incomingPrompt) {
      hasHomepagePromptRef.current = true
      setConversationRestoring(false)
      return
    }

    if (hasHomepagePromptRef.current) {
      setConversationRestoring(false)
      return
    }

    const token = getAuthToken() || ""
    const apiBaseUrl = API_BASE_URL || ""

    if (!token || !apiBaseUrl) {
      setConversationRestoring(false)
      return
    }

    let active = true

    async function resumeLatestLucyConversation() {
      setConversationRestoring(true)

      try {
        const latestConversation =
          await loadLatestLucyConversation({
            apiBaseUrl,
            token,
          })

        if (!active) return

        if (
          latestConversation &&
          latestConversation.messages.length > 0
        ) {
          activeLucyConversationIdRef.current =
            latestConversation.conversationId

          onActiveConversationChange?.(
            latestConversation.conversationId
          )

          setMessages(latestConversation.messages)
        }
      } catch {
        // Conversation continuity should never block Lucy from opening normally.
      } finally {
        if (active) {
          setConversationRestoring(false)
        }
      }
    }

    void resumeLatestLucyConversation()

    return () => {
      active = false
    }
  }, [initialPrompt])

  useEffect(() => {
    if (!requestedConversationId) return

    if (
      requestedConversationId ===
      activeLucyConversationIdRef.current
    ) {
      return
    }

    void handleOpenLucyConversation(
      requestedConversationId
    )
  }, [requestedConversationId])

  useEffect(() => {
    const prompt = initialPrompt?.trim()

    if (!prompt) return

    const homepagePrompt = prompt

    if (
      lastInitialPromptRef.current ===
      homepagePrompt
    ) {
      return
    }

    setChatInput(homepagePrompt)

    const token = getAuthToken()

    if (!token) {
      return
    }

    lastInitialPromptRef.current =
      homepagePrompt

    async function launchHomepagePrompt() {
      await handleNewLucyConversation()

      setChatInput(homepagePrompt)

      window.setTimeout(() => {
        composerFormRef.current?.requestSubmit()
      }, 0)
    }

    void launchHomepagePrompt()
  }, [initialPrompt])

  useEffect(() => {
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, chatLoading, assistantTyping, open, expanded])

  useEffect(() => {
    if (!attachmentMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(target)
      ) {
        setAttachmentMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [attachmentMenuOpen])

  useEffect(() => {
    if (
      !selectedAttachment ||
      !selectedAttachment.type.startsWith("image/")
    ) {
      setSelectedAttachmentPreviewUrl(null)
      return
    }

    const previewUrl = URL.createObjectURL(selectedAttachment)

    setSelectedAttachmentPreviewUrl(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [selectedAttachment])

  useEffect(() => {
    if (!expanded) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [expanded])

  useEffect(() => {
    return () => {
      if (realtimeMicResumeTimerRef.current !== null) {
        window.clearTimeout(realtimeMicResumeTimerRef.current)
        realtimeMicResumeTimerRef.current = null
      }

      realtimePeerConnectionRef.current?.close()
      realtimePeerConnectionRef.current = null

      realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
        track.stop()
      })
      realtimeLocalStreamRef.current = null
      realtimeMicTrackRef.current = null
      realtimeAudioSenderRef.current = null

      if (realtimeAudioElementRef.current) {
        realtimeAudioElementRef.current.pause()
        realtimeAudioElementRef.current.srcObject = null
        realtimeAudioElementRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    latestDashboardRoutesRef.current = dashboardRoutes
  }, [dashboardRoutes])

  async function typeAssistantReply(
    messageId: string,
    fullText: string
  ) {
    await typeAssistantMessage({
      messageId,
      fullText,
      setMessages,
      setAssistantTyping,
    })
  }

  async function appendTypedAssistantReply(fullText: string) {
    const assistantMessageId = createMessageId()

    setMessages((prev) =>
      appendAssistantPlaceholder(prev, assistantMessageId)
    )

    await typeAssistantReply(assistantMessageId, fullText)
  }

  function sendRealtimeToolCallOutput(
    callId: string,
    output: Record<string, unknown>
  ) {
    const dataChannel = realtimeDataChannelRef.current

    if (!callId) return
    if (!dataChannel || dataChannel.readyState !== "open") return

    try {
      dataChannel.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(output),
          },
        })
      )
    } catch {
      // Realtime state sync should never block the underlying Skysirv action.
    }
  }

  async function handleConfirmPendingLucyAction(
    action: LucyAction,
    token: string
  ) {
    if (!API_BASE_URL) return

    const realtimeToolCallId =
      pendingRealtimeToolCallIdRef.current

    setChatLoading(true)

    try {
      const result = await executeLucyAction({
        action,
        token,
        apiBaseUrl: API_BASE_URL,
      })

      if (result.confirmedWatchlistRoute) {
        confirmedVoiceWatchlistRoutesRef.current = [
          {
            ...result.confirmedWatchlistRoute,
            confirmedAt: Date.now(),
          },
          ...confirmedVoiceWatchlistRoutesRef.current,
        ].slice(0, 10)
      }

      if (realtimeToolCallId) {
        sendRealtimeToolCallOutput(
          realtimeToolCallId,
          {
            status: "completed",
            actionType: action.type,
            message: result.reply,
          }
        )
      }

      pendingRealtimeToolCallIdRef.current = null
      setPendingLucyAction(null)
      pendingLucyActionRef.current = null

      await appendTypedAssistantReply(result.reply)

      if (
        realtimeDataChannelRef.current?.readyState === "open"
      ) {
        speakWithRealtimeLucyVoice(result.reply)
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        "I couldn’t save that action yet. Please try again in a moment."

      if (realtimeToolCallId) {
        sendRealtimeToolCallOutput(
          realtimeToolCallId,
          {
            status: "failed",
            actionType: action.type,
            message: errorMessage,
          }
        )
      }

      pendingRealtimeToolCallIdRef.current = null
      pendingLucyActionRef.current = null
      setPendingLucyAction(null)

      await appendTypedAssistantReply(errorMessage)

      if (
        realtimeDataChannelRef.current?.readyState === "open"
      ) {
        speakWithRealtimeLucyVoice(errorMessage)
      }
    } finally {
      setChatLoading(false)
    }
  }

  async function setRealtimeMicrophoneEnabled(enabled: boolean) {
    await setRealtimeMicrophoneEnabledHelper({
      enabled,
      localStreamRef: realtimeLocalStreamRef,
      micTrackRef: realtimeMicTrackRef,
      audioSenderRef: realtimeAudioSenderRef,
    })
  }

  function clearRealtimeMicrophoneResumeTimer() {
    clearRealtimeMicrophoneResumeTimerHelper(
      realtimeMicResumeTimerRef
    )
  }

  function pauseRealtimeMicrophoneForLucy() {
    pauseRealtimeMicrophoneHelper({
      clearTimer: clearRealtimeMicrophoneResumeTimer,
      isPausedRef: realtimeMicPausedForLucyRef,
      disableMicrophone: () => {
        void setRealtimeMicrophoneEnabled(false)
      },
    })
  }

  function resumeRealtimeMicrophoneAfterLucy() {
    resumeRealtimeMicrophoneHelper({
      clearTimer: clearRealtimeMicrophoneResumeTimer,
      isPausedRef: realtimeMicPausedForLucyRef,
      enableMicrophone: () => {
        void setRealtimeMicrophoneEnabled(true)
      },
    })
  }

  function scheduleRealtimeMicrophoneResume(delayMs = 1400) {
    scheduleRealtimeMicrophoneResumeHelper({
      timerRef: realtimeMicResumeTimerRef,
      delayMs,
      resumeMicrophone: resumeRealtimeMicrophoneAfterLucy,
    })
  }

  function stopLucyVoiceSession() {
    clearRealtimeMicrophoneResumeTimer()

    realtimeMicPausedForLucyRef.current = false
    suppressNextVoiceAssistantReplyRef.current = false
    suppressNextRealtimeSpeechTextRef.current = false
    localRealtimeSpeechMessageIdRef.current = null
    lastVoiceToolCallRef.current = null
    pendingRealtimeToolCallIdRef.current = null

    void setRealtimeMicrophoneEnabled(true)

    realtimeDataChannelRef.current?.close()
    realtimeDataChannelRef.current = null
    realtimePeerConnectionRef.current?.close()
    realtimePeerConnectionRef.current = null

    realtimeLocalStreamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    realtimeLocalStreamRef.current = null
    realtimeMicTrackRef.current = null
    realtimeAudioSenderRef.current = null

    if (realtimeAudioElementRef.current) {
      realtimeAudioElementRef.current.pause()
      realtimeAudioElementRef.current.srcObject = null
      realtimeAudioElementRef.current = null
    }

    setVoiceStatus("idle")
  }

  function speakWithRealtimeLucyVoice(text: string) {
    const dataChannel = realtimeDataChannelRef.current
    const cleanText = text.trim()

    if (!cleanText) return
    if (!dataChannel || dataChannel.readyState !== "open") return

    pauseRealtimeMicrophoneForLucy()
    setVoiceStatus("speaking")

    localRealtimeSpeechMessageIdRef.current = null
    suppressNextRealtimeSpeechTextRef.current = true

    try {
      dataChannel.send(
        JSON.stringify({
          type: "response.create",
          response: {
            instructions: `Say exactly this in Lucy's voice, in English, with no extra words: ${JSON.stringify(
              cleanText
            )}`,
          },
        })
      )
    } catch {
      suppressNextRealtimeSpeechTextRef.current = false
      resumeRealtimeMicrophoneAfterLucy()
      setVoiceStatus("listening")
    }
  }

  async function startLucyVoiceSession() {
    if (tier === "free") {
      await appendTypedAssistantReply(
        "Lucy voice is available on Pro and Business plans."
      )
      return
    }

    if (!API_BASE_URL) {
      await appendTypedAssistantReply(
        "Lucy voice is not configured yet. Please try again once the API connection is available."
      )
      return
    }

    const token = getAuthToken()

    if (!token) {
      setAuthRequired(true)
      setAuthModalOpen(true)
      return
    }

    if (voiceStatus !== "idle") {
      stopLucyVoiceSession()
      return
    }

    setVoiceStatus("connecting")

    try {
      const sessionResponse = await fetch(
        `${API_BASE_URL}/api/flight-attendant/realtime-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dashboardRoutes: latestDashboardRoutesRef.current,
            conversationId: activeLucyConversationIdRef.current,
          }),
        }
      )

      const sessionData =
        (await sessionResponse.json().catch(() => null)) as
        | LucyRealtimeSessionResponse
        | null

      if (!sessionResponse.ok) {
        throw new Error(
          sessionData?.error || "Lucy voice could not be started."
        )
      }

      if (sessionData?.conversationId) {
        activeLucyConversationIdRef.current =
          sessionData.conversationId
      }

      const clientSecret =
        sessionData?.session?.value ||
        sessionData?.session?.client_secret?.value ||
        sessionData?.session?.session?.client_secret?.value

      if (!clientSecret) {
        throw new Error("Lucy voice session did not return a client secret.")
      }

      const peerConnection = new RTCPeerConnection()
      realtimePeerConnectionRef.current = peerConnection

      const audioElement = document.createElement("audio")
      audioElement.autoplay = true
      realtimeAudioElementRef.current = audioElement

      peerConnection.ontrack = (event) => {
        audioElement.srcObject = event.streams[0]
        setVoiceStatus("speaking")
      }

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      realtimeLocalStreamRef.current = localStream

      const micTrack = localStream.getAudioTracks()[0] ?? null
      realtimeMicTrackRef.current = micTrack

      if (micTrack) {
        realtimeAudioSenderRef.current = peerConnection.addTrack(
          micTrack,
          localStream
        )
      }

      const dataChannel = peerConnection.createDataChannel("oai-events")
      realtimeDataChannelRef.current = dataChannel

      dataChannel.addEventListener("open", () => {
        setVoiceStatus("listening")
      })

      let activeUserVoiceMessageId: string | null = null
      let activeAssistantVoiceMessageId: string | null = null

      dataChannel.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data)

          if (
            data?.type === "response.output_audio_transcript.delta" ||
            data?.type === "response.output_audio_transcript.done" ||
            data?.type === "response.done"
          ) {
            console.log("Lucy realtime transcript event:", {
              type: data.type,
              delta: data.delta,
              transcript: data.transcript,
              output: data.output,
              activeAssistantVoiceMessageId,
              suppressNextVoiceAssistantReply: suppressNextVoiceAssistantReplyRef.current,
              suppressNextRealtimeSpeechText: suppressNextRealtimeSpeechTextRef.current,
            })
          }

          if (
            data?.type === "response.output_item.done" ||
            data?.type === "conversation.item.done"
          ) {
            const realtimeToolCallId = handleRealtimeVoiceToolItem(
              data.item,
              {
                lastVoiceToolCallRef,
                pendingLucyActionRef,
                dataChannelRef: realtimeDataChannelRef,
                setPendingLucyAction,
                setMessages,
                speakConfirmation: speakWithRealtimeLucyVoice,
                suppressNextAssistantReplyRef: suppressNextVoiceAssistantReplyRef,
                clearActiveAssistantMessage: () => {
                  activeAssistantVoiceMessageId = null
                },
                executeImmediateAction: (
                  action,
                  realtimeToolCallId
                ) => {
                  pendingRealtimeToolCallIdRef.current =
                    realtimeToolCallId

                  pendingLucyActionRef.current = null
                  setPendingLucyAction(null)

                  window.setTimeout(() => {
                    void handleConfirmPendingLucyAction(
                      action,
                      token
                    )
                  }, 0)
                },
              }
            )

            if (realtimeToolCallId) {
              pendingRealtimeToolCallIdRef.current = realtimeToolCallId
            }
          }

          const realtimeVoiceTranscriptDelta =
            getRealtimeVoiceTranscriptDelta(data)

          if (realtimeVoiceTranscriptDelta !== null) {
            const currentActiveUserVoiceMessageId =
              activeUserVoiceMessageId

            setMessages((prev) => {
              const result = applyRealtimeVoiceTranscriptDelta({
                messages: prev,
                activeMessageId: currentActiveUserVoiceMessageId,
                delta: realtimeVoiceTranscriptDelta,
                createMessageId,
              })

              activeUserVoiceMessageId = result.messageId

              return result.messages
            })
          }

          const completedTranscript =
            getCompletedRealtimeVoiceTranscript(data)

          if (completedTranscript) {
            suppressNextVoiceAssistantReplyRef.current = false

            const transcriptDecision = getCompletedVoiceTranscriptDecision({
              transcript: completedTranscript,
              pendingAction: pendingLucyActionRef.current,
              lucySessionActive: true,
            })

            if (transcriptDecision === "ignore") {
              suppressNextVoiceAssistantReplyRef.current = true
              suppressNextRealtimeSpeechTextRef.current = false

              const completedUserMessageId =
                activeUserVoiceMessageId || createMessageId()

              activeUserVoiceMessageId =
                completedUserMessageId

              setMessages((prev) =>
                applyCompletedVoiceTranscript({
                  messages: prev,
                  messageId: completedUserMessageId,
                  transcript: completedTranscript,
                })
              )

              activeUserVoiceMessageId = null
              activeAssistantVoiceMessageId = null
              return
            }

            if (transcriptDecision === "too_short") {
              const emptyUserMessageId = activeUserVoiceMessageId

              if (emptyUserMessageId) {
                setMessages((prev) =>
                  removeVoiceTranscriptMessage({
                    messages: prev,
                    messageId: emptyUserMessageId,
                  })
                )
              }

              activeUserVoiceMessageId = null
              return
            }

            if (activeUserVoiceMessageId) {
              const completedUserMessageId = activeUserVoiceMessageId

              setMessages((prev) =>
                applyCompletedVoiceTranscript({
                  messages: prev,
                  messageId: completedUserMessageId,
                  transcript: completedTranscript,
                })
              )
            }

            const voiceConversationId =
              activeLucyConversationIdRef.current

            const voiceToken = getAuthToken()
            const voiceApiBaseUrl = API_BASE_URL || ""

            if (
              voiceConversationId &&
              voiceToken &&
              voiceApiBaseUrl
            ) {
              void persistLucyConversationMessage({
                apiBaseUrl: voiceApiBaseUrl,
                token: voiceToken,
                conversationId: voiceConversationId,
                role: "user",
                content: completedTranscript,
                source: "realtime_voice",
                clientMessageId: activeUserVoiceMessageId,
              }).catch(() => {
                // Voice persistence should never interrupt the live session.
              })
            }

            const token = getAuthToken()

            const actionToConfirm = pendingLucyActionRef.current

            const pendingActionResponse = getPendingVoiceActionResponse({
              transcript: completedTranscript,
              pendingAction: actionToConfirm,
            })

            const recentlyConfirmedWatchlistResponse =
              getRecentlyConfirmedWatchlistResponse({
                transcript: completedTranscript,
                confirmedRoutes: confirmedVoiceWatchlistRoutesRef.current,
              })

            if (recentlyConfirmedWatchlistResponse) {
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              const watchlistReplyMessageId = createMessageId()

              setMessages((prev) =>
                appendVoiceAssistantMessage({
                  messages: prev,
                  messageId: watchlistReplyMessageId,
                  text: recentlyConfirmedWatchlistResponse.reply,
                })
              )

              activeUserVoiceMessageId = null
              return
            }

            if (pendingActionResponse.decision === "negative") {
              const realtimeToolCallId =
                pendingRealtimeToolCallIdRef.current

              if (realtimeToolCallId) {
                sendRealtimeToolCallOutput(
                  realtimeToolCallId,
                  {
                    status: "declined",
                    actionType: actionToConfirm?.type ?? null,
                    message: pendingActionResponse.reply,
                  }
                )
              }

              pendingRealtimeToolCallIdRef.current = null
              pendingLucyActionRef.current = null
              setPendingLucyAction(null)
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              const negativeReplyMessageId = createMessageId()

              setMessages((prev) =>
                appendVoiceAssistantMessage({
                  messages: prev,
                  messageId: negativeReplyMessageId,
                  text: pendingActionResponse.reply!,
                })
              )

              activeUserVoiceMessageId = null
              return
            }

            if (
              token &&
              actionToConfirm &&
              pendingActionResponse.decision === "affirmative"
            ) {
              pendingLucyActionRef.current = null
              setPendingLucyAction(null)
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              try {
                realtimeDataChannelRef.current?.send(
                  JSON.stringify({
                    type: "response.cancel",
                  })
                )
              } catch {
                // Ignore cancel errors.
              }

              window.setTimeout(() => {
                handleConfirmPendingLucyAction(actionToConfirm, token)
              }, 0)

              activeUserVoiceMessageId = null
              return
            }

            const localVoiceSaveFlightAction = buildLocalVisibleFlightSaveAction({
              message: completedTranscript,
              messages,
              dashboardRoutes: latestDashboardRoutesRef.current,
            })

            if (localVoiceSaveFlightAction) {
              setPendingLucyAction(localVoiceSaveFlightAction)
              pendingLucyActionRef.current = localVoiceSaveFlightAction
              suppressNextVoiceAssistantReplyRef.current = true
              activeAssistantVoiceMessageId = null

              try {
                realtimeDataChannelRef.current?.send(
                  JSON.stringify({
                    type: "response.cancel",
                  })
                )
              } catch {
                // Ignore cancel errors.
              }

              const saveFlightConfirmationMessageId = createMessageId()

              setMessages((prev) =>
                appendVoiceAssistantMessage({
                  messages: prev,
                  messageId: saveFlightConfirmationMessageId,
                  text:
                    localVoiceSaveFlightAction.confirmationPrompt ||
                    "Would you like me to save this flight to your Saved Flights?",
                })
              )

              activeUserVoiceMessageId = null
              return
            }

            activeUserVoiceMessageId = null
          }

          const completedRealtimeLucyTranscript =
            getCompletedRealtimeLucyTranscript(data)

          if (
            completedRealtimeLucyTranscript &&
            !suppressNextRealtimeSpeechTextRef.current &&
            !suppressNextVoiceAssistantReplyRef.current
          ) {
            const completedAssistantMessageId =
              activeAssistantVoiceMessageId || createMessageId()

            activeAssistantVoiceMessageId =
              completedAssistantMessageId

            setMessages((prev) => {
              const existingAssistantMessage =
                prev.some(
                  (message) =>
                    message.id === completedAssistantMessageId
                )

              if (existingAssistantMessage) {
                return updateAssistantMessageText(
                  prev,
                  completedAssistantMessageId,
                  completedRealtimeLucyTranscript
                )
              }

              return appendVoiceAssistantMessage({
                messages: prev,
                messageId: completedAssistantMessageId,
                text: completedRealtimeLucyTranscript,
              })
            })
          }

          const voiceConversationId =
            activeLucyConversationIdRef.current

          const voiceToken = getAuthToken()
          const voiceApiBaseUrl = API_BASE_URL || ""

          if (
            voiceConversationId &&
            voiceToken &&
            voiceApiBaseUrl
          ) {
            void persistLucyConversationMessage({
              apiBaseUrl: voiceApiBaseUrl,
              token: voiceToken,
              conversationId: voiceConversationId,
              role: "assistant",
              content: completedRealtimeLucyTranscript,
              source: "realtime_voice",
              clientMessageId:
                activeAssistantVoiceMessageId,
            }).catch(() => {
              // Voice persistence should never interrupt the live session.
            })
          }

          const {
            isAudioDelta: isLucyAudioDelta,
            isTranscriptDelta: isLucyTranscriptDelta,
            isAudioDone: isLucyAudioDone,
          } = getRealtimeLucyAudioEventState(data)

          if (isLucyAudioDelta || isLucyTranscriptDelta) {
            pauseRealtimeMicrophoneForLucy()
            setVoiceStatus("speaking")
          }

          if (isLucyAudioDone) {
            scheduleRealtimeMicrophoneResume(1800)

            activeAssistantVoiceMessageId = null
            localRealtimeSpeechMessageIdRef.current = null

            const audioCompletionState =
              getRealtimeLucyAudioCompletionState({
                hasPendingAction: Boolean(
                  pendingLucyActionRef.current
                ),
                suppressRealtimeSpeechText:
                  suppressNextRealtimeSpeechTextRef.current,
              })

            if (
              audioCompletionState.shouldClearRealtimeSpeechTextSuppression
            ) {
              suppressNextRealtimeSpeechTextRef.current = false
            }

            if (
              audioCompletionState.shouldClearVoiceAssistantReplySuppression
            ) {
              suppressNextVoiceAssistantReplyRef.current = false
            }

            if (realtimePeerConnectionRef.current) {
              window.setTimeout(() => {
                if (realtimePeerConnectionRef.current) {
                  setVoiceStatus("listening")
                }
              }, 1800)
            }
          }

          if (suppressNextVoiceAssistantReplyRef.current) {
            return
          }

          if (isRealtimeVoiceSpeechStarted(data)) {
            suppressNextRealtimeSpeechTextRef.current = false

            suppressNextVoiceAssistantReplyRef.current = Boolean(
              pendingLucyActionRef.current
            )

            activeAssistantVoiceMessageId = null

            const nextUserVoiceMessageId =
              createMessageId()

            activeUserVoiceMessageId =
              nextUserVoiceMessageId

            setMessages((prev) => {
              const result = createVoiceUserMessage({
                messages: prev,
                createMessageId,
                messageId: nextUserVoiceMessageId,
              })

              return result.messages
            })

            setVoiceStatus("listening")
          }
        } catch {
          // Realtime events are optional for this first voice pass.
        }
      })

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      )

      if (!sdpResponse.ok) {
        throw new Error("Lucy voice connection could not be completed.")
      }

      const answerSdp = await sdpResponse.text()

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      })

      setVoiceStatus("listening")
    } catch (error: any) {
      stopLucyVoiceSession()
      setVoiceStatus("error")

      await appendTypedAssistantReply(
        error?.message ||
        "Lucy voice could not be started. Please try again in a moment."
      )

      window.setTimeout(() => {
        setVoiceStatus("idle")
      }, 1800)
    }
  }

  async function handleSendFlightAttendantMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const message = chatInput.trim()

    const shouldAutoTitleConversation =
      recentLucyConversations.some(
        (conversation) =>
          conversation.id ===
          activeLucyConversationIdRef.current &&
          conversation.title === "New conversation"
      )

    if (!message || chatLoading || assistantTyping) return

    const token = getAuthToken()

    const userMessage: FlightAttendantMessage = {
      id: createMessageId(),
      role: "user",
      label: "You",
      text: message,
    }

    setMessages((prev) => appendUserMessage(prev, userMessage))
    setChatInput("")
    setAuthRequired(false)

    if (!token) {
      setAuthRequired(true)

      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            "Please sign in again to continue with Lucy. This keeps your Skysirv travel intelligence, preferences, and memories securely connected to your account.",
        },
      ])

      return
    }

    if (!API_BASE_URL) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            "Lucy is not configured yet. Please try again once the Skysirv connection is available.",
        },
      ])

      return
    }

    if (pendingLucyAction && isNegativeLucyActionConfirmation(message)) {
      setPendingLucyAction(null)

      await appendTypedAssistantReply(
        "No problem — I won’t save that action."
      )

      return
    }

    if (pendingLucyAction && isAffirmativeLucyActionConfirmation(message)) {
      await handleConfirmPendingLucyAction(pendingLucyAction, token)
      return
    }

    const localVisibleFlightSaveAction = buildLocalVisibleFlightSaveAction({
      message,
      messages,
      dashboardRoutes,
    })

    if (localVisibleFlightSaveAction) {
      setPendingLucyAction(localVisibleFlightSaveAction)

      await appendTypedAssistantReply(
        localVisibleFlightSaveAction.confirmationPrompt ||
        "Would you like me to save this flight to your Saved Flights?"
      )

      return
    }

    setChatLoading(true)

    try {
      const result = await sendLucyChatMessage({
        apiBaseUrl: API_BASE_URL,
        token,
        message,
        tier,
        dashboardRoutes,
        messages: [...messages, userMessage],
        conversationId: activeLucyConversationIdRef.current,
      })

      if (result.conversationId) {
        activeLucyConversationIdRef.current =
          result.conversationId
      }

      if (
        shouldAutoTitleConversation &&
        activeLucyConversationIdRef.current
      ) {
        try {
          const updatedConversation =
            await updateLucyConversation({
              apiBaseUrl: API_BASE_URL,
              token,
              conversationId:
                activeLucyConversationIdRef.current,
              title: message.slice(0, 80),
            })

          setRecentLucyConversations((current) =>
            current.map((conversation) =>
              conversation.id === updatedConversation.id
                ? updatedConversation
                : conversation
            )
          )

          onConversationUpdated?.(
            updatedConversation
          )
        } catch (error) {
          console.error(
            "Unable to auto-title Lucy conversation",
            error
          )
        }
      }

      const assistantMessageId = createMessageId()

      if (result.action) {
        setPendingLucyAction(result.action)
        pendingLucyActionRef.current = result.action
      }

      setChatLoading(false)

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          label: "Lucy",
          text: "",
        },
      ])

      await typeAssistantReply(assistantMessageId, result.reply)
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          label: "Lucy",
          text:
            error?.message ||
            "Something went wrong while contacting Lucy. Please try again.",
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  async function handleNewLucyConversation() {
    const token = getAuthToken() || ""
    const apiBaseUrl = API_BASE_URL || ""

    if (!token) {
      setAuthRequired(true)
      setAuthModalOpen(true)
      return
    }

    if (!apiBaseUrl || conversationSwitching) return

    if (voiceStatus !== "idle") {
      stopLucyVoiceSession()
    }

    setConversationSwitching(true)
    setRecentConversationsOpen(false)

    try {
      const conversation =
        await createLucyConversation({
          apiBaseUrl,
          token,
          title: "New conversation",
        })

      activeLucyConversationIdRef.current =
        conversation.id

      onActiveConversationChange?.(
        conversation.id
      )

      setPendingLucyAction(null)
      pendingLucyActionRef.current = null
      pendingRealtimeToolCallIdRef.current = null

      setMessages(
        isWorkspace
          ? []
          : [
            {
              id: createMessageId(),
              role: "assistant",
              label: "Lucy",
              text: config.welcome,
            },
          ]
      )

      setRecentLucyConversations((prev) => [
        conversation,
        ...prev.filter(
          (item) => item.id !== conversation.id
        ),
      ])

      onConversationCreated?.(conversation)
    } catch (error) {
      console.error(
        "Unable to create Lucy conversation",
        error
      )
    } finally {
      setConversationSwitching(false)
    }
  }

  useEffect(() => {
    if (
      newConversationRequestKey ===
      lastNewConversationRequestKeyRef.current
    ) {
      return
    }

    lastNewConversationRequestKeyRef.current =
      newConversationRequestKey

    void handleNewLucyConversation()
  }, [newConversationRequestKey])

  async function handleToggleRecentLucyConversations() {
    if (recentConversationsOpen) {
      setRecentConversationsOpen(false)
      return
    }

    const token = getAuthToken() || ""
    const apiBaseUrl = API_BASE_URL || ""

    if (!token) {
      setAuthRequired(true)
      setAuthModalOpen(true)
      return
    }

    if (!apiBaseUrl || conversationSwitching) return

    setConversationSwitching(true)

    try {
      const conversations =
        await getRecentLucyConversations({
          apiBaseUrl,
          token,
          limit: 20,
        })

      setRecentLucyConversations(conversations)
      setRecentConversationsOpen(true)
    } catch (error) {
      console.error(
        "Unable to load recent Lucy conversations",
        error
      )
    } finally {
      setConversationSwitching(false)
    }
  }

  async function handleOpenLucyConversation(
    conversationId: string
  ) {
    const token = getAuthToken() || ""
    const apiBaseUrl = API_BASE_URL || ""

    if (
      !token ||
      !apiBaseUrl ||
      conversationSwitching
    ) {
      return
    }

    if (
      conversationId ===
      activeLucyConversationIdRef.current
    ) {
      setRecentConversationsOpen(false)
      return
    }

    if (voiceStatus !== "idle") {
      stopLucyVoiceSession()
    }

    setConversationSwitching(true)
    setConversationRestoring(true)
    setRecentConversationsOpen(false)

    try {
      const conversation =
        await loadLucyConversation({
          apiBaseUrl,
          token,
          conversationId,
        })

      activeLucyConversationIdRef.current =
        conversation.conversationId

      onActiveConversationChange?.(
        conversation.conversationId
      )

      setPendingLucyAction(null)
      pendingLucyActionRef.current = null
      pendingRealtimeToolCallIdRef.current = null

      setMessages(
        conversation.messages.length > 0
          ? conversation.messages
          : isWorkspace
            ? []
            : [
              {
                id: createMessageId(),
                role: "assistant",
                label: "Lucy",
                text: config.welcome,
              },
            ]
      )
    } catch (error) {
      console.error(
        "Unable to open Lucy conversation",
        error
      )
    } finally {
      setConversationRestoring(false)
      setConversationSwitching(false)
    }
  }

  return (
    <>

      <div
        onClick={expanded ? () => setExpanded(false) : undefined}
        className={
          expanded
            ? "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
            : placement === "workspace"
              ? "flex h-full min-h-0 w-full flex-col"
              : placement === "inline"
                ? "w-full"
                : "fixed right-5 top-24 z-[80] hidden lg:block"
        }
      >
        {open ? (
          <div
            onClick={
              expanded
                ? (event) => event.stopPropagation()
                : undefined
            }
            className={cn(
              isWorkspace
                ? "flex h-full min-h-0 w-full flex-col overflow-hidden bg-white text-slate-900 shadow-none"
                : "overflow-y-auto rounded-[1.75rem] border border-white/10 bg-[#050b18] text-white shadow-[0_24px_70px_rgba(2,6,23,0.28)]",
              expanded
                ? "flex h-[min(760px,calc(100vh-3rem))] w-full max-w-3xl flex-col shadow-2xl"
                : placement === "workspace"
                  ? "flex h-full min-h-0 w-full"
                  : placement === "inline"
                    ? "flex h-[360px] w-full flex-col"
                    : "w-[390px]"
            )}
          >
            {!isWorkspace && (
              <div className="relative border-b border-white/10 bg-[#050b18] px-5 py-2">
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                  <div>
                    <p className="text-medium font-semibold tracking-[-0.03em] text-white">
                      Lucy
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your AI Travel Companion
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNewLucyConversation}
                    disabled={conversationSwitching}
                    className="inline-flex h-8 w-[72px] items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    New
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleRecentLucyConversations}
                    disabled={conversationSwitching}
                    className={cn(
                      "inline-flex h-8 w-[72px] items-center justify-center rounded-full border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                      recentConversationsOpen
                        ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                        : "border-white/10 bg-white/[0.05] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                    )}
                  >
                    Recent
                  </button>

                  <div className="hidden h-8 w-[72px] items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 text-xs font-semibold text-emerald-200 sm:inline-flex">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    </span>

                    Online
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpanded((current) => !current)
                    }
                    aria-label={
                      expanded
                        ? "Close expanded Lucy chat"
                        : "Expand Lucy chat"
                    }
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                  >
                    {expanded ? (
                      <span className="text-lg leading-none">
                        ×
                      </span>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                      >
                        <path
                          d="M8 4H4v4M4 4l6 6M16 20h4v-4M20 20l-6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {recentConversationsOpen && (
                  <div className="absolute right-4 top-full z-50 mt-2 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#071120] shadow-2xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Recent conversations
                      </p>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto p-2">
                      {recentLucyConversations.length > 0 ? (
                        recentLucyConversations.map(
                          (conversation) => {
                            const isActive =
                              conversation.id ===
                              activeLucyConversationIdRef.current

                            return (
                              <button
                                key={conversation.id}
                                type="button"
                                onClick={() =>
                                  handleOpenLucyConversation(
                                    conversation.id
                                  )
                                }
                                className={cn(
                                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition",
                                  isActive
                                    ? "bg-cyan-300/10 text-cyan-100"
                                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                                )}
                              >
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-medium">
                                    {conversation.title}
                                  </span>

                                  <span className="mt-1 block text-xs text-slate-500">
                                    {new Date(
                                      conversation.updatedAt
                                    ).toLocaleDateString(
                                      undefined,
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </span>

                                {isActive && (
                                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">
                                    Active
                                  </span>
                                )}
                              </button>
                            )
                          }
                        )
                      ) : (
                        <div className="px-3 py-6 text-center text-sm text-slate-500">
                          No previous conversations yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={cn(
                isWorkspace && isWorkspaceEmpty
                  ? "flex min-h-0 flex-1 flex-col justify-center"
                  : "contents"
              )}
            >

              <div
                className={cn(
                  "relative",
                  isWorkspace && isWorkspaceEmpty
                    ? "overflow-visible"
                    : "overflow-y-auto",
                  isWorkspace
                    ? isWorkspaceEmpty
                      ? "bg-white px-6 py-0"
                      : "lucy-workspace-scrollbar min-h-0 flex-1 bg-white px-6 py-8"
                    : "bg-[#071120] px-5 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-300/20",
                  expanded
                    ? "min-h-0 flex-1"
                    : placement === "workspace"
                      ? isWorkspaceEmpty
                        ? "shrink-0"
                        : "min-h-0 flex-1"
                      : placement === "inline"
                        ? "h-[230px]"
                        : "h-[360px]"
                )}
              >
                <div
                  className={cn(
                    "mx-auto w-full",
                    isWorkspace
                      ? isWorkspaceEmpty
                        ? "max-w-[880px]"
                        : "max-w-[880px] space-y-8 pb-12"
                      : "space-y-5 pb-2"
                  )}
                >
                  {isWorkspaceEmpty && (
                    <div className="pb-6 text-center">
                      <h1 className="text-[26px] font-medium tracking-[-0.035em] text-slate-900">
                        Where would you like to begin?
                      </h1>
                    </div>
                  )}
                  {conversationRestoring ? (
                    <div
                      className={cn(
                        "flex items-center justify-center",
                        isWorkspace
                          ? "absolute inset-0"
                          : "py-8"
                      )}
                    >
                      <div className="relative h-12 w-12">
                        {[
                          { top: "0%", left: "50%" },
                          { top: "14.5%", left: "85.5%" },
                          { top: "50%", left: "100%" },
                          { top: "85.5%", left: "85.5%" },
                          { top: "100%", left: "50%" },
                          { top: "85.5%", left: "14.5%" },
                          { top: "50%", left: "0%" },
                          { top: "14.5%", left: "14.5%" },
                        ].map((position, index) => (
                          <span
                            key={index}
                            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-cyan-500"
                            style={{
                              top: position.top,
                              left: position.left,
                              animationDelay: `${index * 110}ms`,
                              animationDuration: "880ms",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : !isWorkspaceEmpty ? (
                    messages.map((message) => (
                      <AssistantBubble
                        key={message.id}
                        text={message.text}
                        align={
                          message.role === "user"
                            ? "right"
                            : "left"
                        }
                        workspace={isWorkspace}
                      />
                    ))
                  ) : null}

                  {chatLoading && !conversationRestoring && (
                    <ThinkingDotsBubble workspace={isWorkspace} />
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {authRequired && !isWorkspace && (
                <div
                  className={cn(
                    "p-4",
                    isWorkspace
                      ? isWorkspaceEmpty
                        ? "shrink-0 bg-white px-6 py-0"
                        : "border-t border-slate-200 bg-white px-6 py-5"
                      : "bg-white px-6 py-5"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={cn(
                        "text-xs leading-5",
                        isWorkspace
                          ? "text-slate-600"
                          : "text-slate-300"
                      )}
                    >
                      Sign in again to keep Lucy connected to your account.
                    </p>

                    <button
                      type="button"
                      onClick={() => setAuthModalOpen(true)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        isWorkspace
                          ? "border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50"
                          : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
                      )}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              )}

              <form
                ref={composerFormRef}
                onSubmit={handleSendFlightAttendantMessage}
                className={cn(
                  "p-4",
                  isWorkspace
                    ? isWorkspaceEmpty
                      ? "shrink-0 border-0 bg-white px-6 py-0"
                      : "bg-white px-6 py-5"
                    : "border-t border-white/10 bg-[#050b18]"
                )}
              >
                <div
                  className={cn(
                    "mx-auto flex w-full items-center gap-2",
                    isWorkspace ? "max-w-[880px]" : ""
                  )}
                >
                  <div
                    className={cn(
                      "relative flex-1",
                      isWorkspace
                        ? "overflow-visible rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition"
                        : ""
                    )}
                  >
                    {isWorkspace && selectedAttachment && (
                      <div className="px-3 pb-1 pt-3">
                        {selectedAttachmentPreviewUrl ? (
                          <div className="relative h-[84px] w-[84px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            <img
                              src={selectedAttachmentPreviewUrl}
                              alt={selectedAttachment.name}
                              className="h-full w-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => setSelectedAttachment(null)}
                              aria-label="Remove attachment"
                              title="Remove attachment"
                              className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-950"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                                fill="none"
                              >
                                <path
                                  d="M6 6l12 12M18 6 6 18"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="relative flex max-w-[280px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                              >
                                <path
                                  d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 3v5h5"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            <div className="min-w-0 pr-7">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {selectedAttachment.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {(selectedAttachment.size / 1024).toFixed(0)} KB
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedAttachment(null)}
                              aria-label="Remove attachment"
                              title="Remove attachment"
                              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                                fill="none"
                              >
                                <path
                                  d="M6 6l12 12M18 6 6 18"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {isWorkspace && (
                      <button
                        type="button"
                        onClick={() =>
                          setAttachmentMenuOpen((current) => !current)
                        }
                        aria-label="Add attachment"
                        title="Add attachment"
                        className="absolute bottom-[7px] left-1.5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <img
                          src="/images/stock/lucy-chat/composer/attachment.svg"
                          alt=""
                          aria-hidden="true"
                          className="h-[18px] w-[18px] object-contain"
                        />
                      </button>
                    )}

                    {isWorkspace && attachmentMenuOpen && (
                      <div
                        ref={attachmentMenuRef}
                        className="absolute bottom-[calc(100%+10px)] left-0 z-30 w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setAttachmentMenuOpen(false)
                            attachmentInputRef.current?.click()
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          <span className="flex h-8 w-8 items-center justify-center">
                            <img
                              src="/images/stock/lucy-chat/attachments-menu/upload-file.svg"
                              alt=""
                              aria-hidden="true"
                              className="h-5 w-5 object-contain"
                            />
                          </span>

                          <span>Upload file</span>
                        </button>

                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          <span className="flex h-8 w-8 items-center justify-center">
                            <img
                              src="/images/stock/lucy-chat/attachments-menu/trip-context.svg"
                              alt=""
                              aria-hidden="true"
                              className="h-5 w-5 object-contain"
                            />
                          </span>

                          <span>Add trip context</span>
                        </button>
                      </div>
                    )}

                    {isWorkspace && (
                      <input
                        ref={attachmentInputRef}
                        type="file"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null
                          setSelectedAttachment(file)
                          event.target.value = ""
                        }}
                      />
                    )}

                    <input
                      type="text"
                      value={chatInput}
                      onChange={(event) =>
                        setChatInput(event.target.value)
                      }
                      placeholder={config.placeholder}
                      className={cn(
                        "min-h-[54px] w-full rounded-[1.5rem] px-5 text-sm outline-none transition",
                        isWorkspace
                          ? "border-0 bg-transparent pl-14 pr-24 text-[15px] font-medium text-slate-950 shadow-none placeholder:text-slate-950 focus:ring-0"
                          : "border border-white/10 bg-white/[0.06] px-14 pr-14 text-white placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                      )}
                    />

                    {isWorkspace && (
                      <button
                        type="button"
                        onClick={startLucyVoiceSession}
                        disabled={chatLoading || assistantTyping}
                        aria-label={
                          voiceStatus === "idle"
                            ? "Start Lucy voice"
                            : "End Lucy voice"
                        }
                        title={
                          voiceStatus === "idle"
                            ? "Start Lucy voice"
                            : voiceStatus === "connecting"
                              ? "Connecting"
                              : voiceStatus === "listening"
                                ? "Listening"
                                : voiceStatus === "speaking"
                                  ? "Speaking"
                                  : "End Lucy voice"
                        }
                        className={cn(
                          "absolute bottom-[9px] right-1.5 inline-flex h-9 w-9 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50",
                          voiceStatus === "idle"
                            ? "text-slate-500 hover:bg-slate-100 hover:text-cyan-700"
                            : "bg-cyan-50 text-cyan-700"
                        )}
                      >
                        <img
                          src="/images/stock/lucy-chat/composer/voice.svg"
                          alt=""
                          aria-hidden="true"
                          className={cn(
                            "h-[18px] w-[18px] object-contain",
                            voiceStatus !== "idle" && "animate-pulse"
                          )}
                        />
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={
                        chatLoading ||
                        assistantTyping ||
                        !chatInput.trim()
                      }
                      className={cn(
                        "absolute inline-flex h-9 w-9 items-center justify-center rounded-full transition disabled:cursor-not-allowed",
                        isWorkspace
                          ? "bottom-[9px] right-12 bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          : "right-1.5 top-1/2 -translate-y-1/2 bg-cyan-300 text-slate-950 shadow-sm hover:bg-cyan-200"
                      )}
                    >
                      {chatLoading || assistantTyping ? (
                        "…"
                      ) : (
                        <img
                          src="/images/stock/lucy-chat/composer/send.svg"
                          alt=""
                          aria-hidden="true"
                          className="h-[18px] w-[18px] object-contain"
                        />
                      )}
                    </button>
                  </div>

                  {!isWorkspace && tier !== "free" && (
                    <button
                      type="button"
                      onClick={startLucyVoiceSession}
                      disabled={chatLoading || assistantTyping}
                      className={cn(
                        "inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-full border px-5 text-sm font-semibold transition disabled:cursor-not-allowed",
                        isWorkspace
                          ? voiceStatus === "idle"
                            ? "border-slate-200 bg-slate-50 text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50"
                            : "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : voiceStatus === "idle"
                            ? "border-white/10 bg-white/[0.06] text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                            : "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                      )}
                    >
                      <span
                        className="mr-2 inline-flex h-5 items-center gap-0.5"
                        aria-hidden="true"
                      >
                        <span
                          className={cn(
                            "h-1 w-0.5 rounded-full bg-current",
                            voiceStatus !== "idle" &&
                            "animate-pulse"
                          )}
                        />

                        <span
                          className={cn(
                            "h-3 w-0.5 rounded-full bg-current",
                            voiceStatus !== "idle" &&
                            "animate-pulse"
                          )}
                        />

                        <span
                          className={cn(
                            "h-5 w-0.5 rounded-full bg-current",
                            voiceStatus !== "idle" &&
                            "animate-pulse"
                          )}
                        />

                        <span
                          className={cn(
                            "h-3 w-0.5 rounded-full bg-current",
                            voiceStatus !== "idle" &&
                            "animate-pulse"
                          )}
                        />

                        <span
                          className={cn(
                            "h-1 w-0.5 rounded-full bg-current",
                            voiceStatus !== "idle" &&
                            "animate-pulse"
                          )}
                        />
                      </span>

                      {voiceStatus === "idle"
                        ? "Chat"
                        : voiceStatus === "connecting"
                          ? "Connecting"
                          : voiceStatus === "listening"
                            ? "Listening"
                            : voiceStatus === "speaking"
                              ? "Speaking"
                              : "End"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700 ring-1 ring-cyan-200">
              L
            </span>

            <span className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {config.badge}
              </span>

              <span className="block text-sm font-semibold text-slate-950">
                Ask Lucy
              </span>
            </span>
          </button>
        )}
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
      >
        <AuthPanel
          onSigninComplete={() => {
            setAuthModalOpen(false)
            setAuthRequired(false)
          }}
          onSignupComplete={() => {
            setAuthModalOpen(false)
          }}
        />
      </AuthModal>
    </>
  )

  function AssistantBubble({
    text,
    align,
    workspace = false,
  }: {
    text: string
    align: "left" | "right"
    workspace?: boolean
  }) {
    const cleanText = sanitizeLucyText(formatLucyReplyText(text))

    if (!cleanText) return null

    if (align === "left") {
      return (
        <div className="flex justify-start">
          <div
            className={cn(
              "max-w-[92%] px-1 py-1",
              workspace ? "text-slate-700" : ""
            )}
          >
            <p
              className={cn(
                "whitespace-pre-line text-sm leading-7",
                workspace ? "text-slate-700" : "text-slate-100"
              )}
            >
              {cleanText}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[82%] rounded-[1.25rem] px-4 py-3",
            workspace
              ? "border border-slate-200 bg-slate-50 shadow-sm"
              : "border border-white/10 bg-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          )}
        >
          <p
            className={cn(
              "whitespace-pre-line text-sm leading-6",
              workspace ? "text-slate-900" : "text-slate-100"
            )}
          >
            {cleanText}
          </p>
        </div>
      </div>
    )
  }

  function ThinkingDotsBubble({
    workspace = false,
  }: {
    workspace?: boolean
  }) {
    return (
      <div className="flex justify-start">
        <div className="px-1 py-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 animate-pulse rounded-full",
                workspace ? "bg-cyan-500" : "bg-cyan-300"
              )}
            />

            <span
              className={cn(
                "h-2 w-2 animate-pulse rounded-full",
                workspace ? "bg-cyan-500" : "bg-cyan-300"
              )}
              style={{ animationDelay: "120ms" }}
            />

            <span
              className={cn(
                "h-2 w-2 animate-pulse rounded-full",
                workspace ? "bg-cyan-500" : "bg-cyan-300"
              )}
              style={{ animationDelay: "240ms" }}
            />
          </div>
        </div>
      </div>
    )
  }
}