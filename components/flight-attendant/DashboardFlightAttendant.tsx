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
  sendLucyChatMessage,
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
}: DashboardFlightAttendantProps) {
  const config = tierConfig[tier]

  const [open, setOpen] = useState(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] = useState<FlightAttendantMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      label: "Lucy",
      text: config.welcome,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [assistantTyping, setAssistantTyping] = useState(false)
  const [authRequired, setAuthRequired] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [pendingLucyAction, setPendingLucyAction] =
    useState<LucyAction | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<LucyVoiceStatus>("idle")
  const suppressNextVoiceAssistantReplyRef = useRef(false)
  const suppressNextRealtimeSpeechTextRef = useRef(false)
  const localRealtimeSpeechMessageIdRef = useRef<string | null>(null)
  const pendingLucyActionRef = useRef<LucyAction | null>(null)
  const lastVoiceToolCallRef = useRef<{
    key: string
    timestamp: number
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
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
    if (!open) return

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages, chatLoading, assistantTyping, open, expanded])

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

  async function handleConfirmPendingLucyAction(
    action: LucyAction,
    token: string
  ) {
    if (!API_BASE_URL) return

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

      setPendingLucyAction(null)
      pendingLucyActionRef.current = null

      await appendTypedAssistantReply(result.reply)

      if (voiceStatus !== "idle") {
        speakWithRealtimeLucyVoice(result.reply)
      }
    } catch (error: any) {
      await appendTypedAssistantReply(
        error?.message ||
        "I couldn’t save that action yet. Please try again in a moment."
      )
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
            handleRealtimeVoiceToolItem(data.item, {
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
            })
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

              if (activeUserVoiceMessageId) {
                const ignoredUserMessageId = activeUserVoiceMessageId

                setMessages((prev) =>
                  removeVoiceTranscriptMessage({
                    messages: prev,
                    messageId: ignoredUserMessageId,
                  })
                )
              }

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
            activeUserVoiceMessageId = null
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

          const realtimeLucyTranscriptDelta =
            getRealtimeLucyTranscriptDelta(data)

          if (realtimeLucyTranscriptDelta !== null) {
            if (suppressNextRealtimeSpeechTextRef.current) {
              return
            }

            if (localRealtimeSpeechMessageIdRef.current) {
              const localMessageId = localRealtimeSpeechMessageIdRef.current

              setMessages((prev) =>
                appendVoiceTranscriptDelta({
                  messages: prev,
                  messageId: localMessageId,
                  delta: realtimeLucyTranscriptDelta,
                })
              )

              setVoiceStatus("speaking")
              return
            }

            const currentActiveAssistantVoiceMessageId =
              activeAssistantVoiceMessageId

            setMessages((prev) => {
              const result = applyRealtimeLucyTranscriptDelta({
                messages: prev,
                activeMessageId: currentActiveAssistantVoiceMessageId,
                delta: realtimeLucyTranscriptDelta,
                createMessageId,
              })

              activeAssistantVoiceMessageId = result.messageId

              return result.messages
            })

            setVoiceStatus("speaking")
          }

          if (isRealtimeVoiceSpeechStarted(data)) {
            suppressNextRealtimeSpeechTextRef.current = false

            suppressNextVoiceAssistantReplyRef.current = Boolean(
              pendingLucyActionRef.current
            )

            activeAssistantVoiceMessageId = null

            setMessages((prev) => {
              const result = createVoiceUserMessage({
                messages: prev,
                createMessageId,
              })

              activeUserVoiceMessageId = result.messageId

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
      })

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

  return (
    <>
      <div
        onClick={expanded ? () => setExpanded(false) : undefined}
        className={
          expanded
            ? "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
            : placement === "inline"
              ? "w-full"
              : "fixed right-5 top-24 z-[80] hidden lg:block"
        }
      >
        {open ? (
          <div
            onClick={expanded ? (event) => event.stopPropagation() : undefined}
            className={cn(
              "overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#050b18] text-white shadow-[0_24px_70px_rgba(2,6,23,0.28)]",
              expanded
                ? "flex h-[min(760px,calc(100vh-3rem))] w-full max-w-3xl flex-col shadow-2xl"
                : placement === "inline"
                  ? "flex h-[360px] w-full flex-col"
                  : "w-[390px]"
            )}
          >
            <div className="border-b border-white/10 bg-[#050b18] px-5 py-2">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                <div>
                  <p className="text-medium font-semibold tracking-[-0.03em] text-white">
                    Lucy
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Your AI Travel Companion
                  </p>
                </div>

                <div className="hidden -translate-x-2 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm font-semibold text-emerald-200 sm:inline-flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                  Online
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded((current) => !current)}
                  aria-label={expanded ? "Close expanded Lucy chat" : "Expand Lucy chat"}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                >
                  {expanded ? (
                    <span className="text-lg leading-none">×</span>
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
            </div>

            <div
              className={cn(
                "overflow-y-auto bg-[#071120] px-5 py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-300/20",
                expanded
                  ? "min-h-0 flex-1"
                  : placement === "inline"
                    ? "h-[230px]"
                    : "h-[360px]"
              )}
            >
              <div className="space-y-5 pb-2">
                {messages.map((message) => (
                  <AssistantBubble
                    key={message.id}
                    text={message.text}
                    align={message.role === "user" ? "right" : "left"}
                  />
                ))}

                {chatLoading && <ThinkingDotsBubble />}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {authRequired && (
              <div className="border-t border-white/10 bg-cyan-300/10 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-300">
                    Sign in again to keep Lucy connected to your account.
                  </p>

                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="shrink-0 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSendFlightAttendantMessage}
              className="border-t border-white/10 bg-[#050b18] p-4"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    placeholder={config.placeholder}
                    className="min-h-[46px] w-full rounded-full border border-white/10 bg-white/[0.06] px-4 pr-14 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
                  />

                  <button
                    type="submit"
                    disabled={chatLoading || assistantTyping || !chatInput.trim()}
                    className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cyan-300 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {chatLoading || assistantTyping ? (
                      "…"
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="block h-5 w-5 -translate-x-[1px] translate-y-[1px] -rotate-12"
                        fill="none"
                      >
                        <path
                          d="M21 3L10.5 13.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 3L14.5 21L10.5 13.5L3 9.5L21 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {tier !== "free" && (
                  <button
                    type="button"
                    onClick={startLucyVoiceSession}
                    disabled={chatLoading || assistantTyping}
                    className={cn(
                      "inline-flex min-h-[46px] shrink-0 items-center justify-center rounded-full border px-5 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition disabled:cursor-not-allowed disabled:opacity-70",
                      voiceStatus === "idle"
                        ? "border-white/10 bg-white/[0.06] text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                        : "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                    )}
                  >
                    <span className="mr-2 inline-flex h-5 items-center gap-0.5" aria-hidden="true">
                      <span className={cn("h-1 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-3 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-5 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-3 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
                      <span className={cn("h-1 w-0.5 rounded-full bg-current", voiceStatus !== "idle" && "animate-pulse")} />
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
}

function AssistantBubble({
  text,
  align,
}: {
  text: string
  align: "left" | "right"
}) {
  const cleanText = sanitizeLucyText(formatLucyReplyText(text))

  if (!cleanText) return null

  if (align === "left") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[92%] px-1 py-1">
          <p className="whitespace-pre-line text-sm leading-6 text-slate-100">
            {cleanText}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[86%] rounded-[1.4rem] border border-white/10 bg-white/[0.08] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <p className="whitespace-pre-line text-sm leading-6 text-slate-100">
          {cleanText}
        </p>
      </div>
    </div>
  )
}

function ThinkingDotsBubble() {
  return (
    <div className="flex justify-start">
      <div className="px-1 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-cyan-300"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>
    </div>
  )
}