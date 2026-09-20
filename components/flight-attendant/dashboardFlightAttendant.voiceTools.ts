import type React from "react"

import {
    normalizeLucyAction,
    type LucyAction,
} from "./dashboardFlightAttendant.actions"

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
        return
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
}

export function handleRealtimeWatchlistToolCall(
    item: any,
    dependencies: RealtimeVoiceToolHandlerDependencies
) {
    if (item?.name !== "prepare_watchlist_route") return

    const rawArguments =
        typeof item.arguments === "string" ? item.arguments : ""

    if (!rawArguments) return

    try {
        const parsed = JSON.parse(rawArguments)

        const action = normalizeLucyAction({
            type: "add_watchlist_route",
            status: "needs_confirmation",
            origin: parsed.origin,
            destination: parsed.destination,
            departureDate: parsed.departureDate,
            routeLabel: parsed.routeLabel,
            confirmationPrompt: parsed.confirmationPrompt,
        })

        if (!action || action.type !== "add_watchlist_route") return

        const duplicateKey = [
            action.type,
            action.origin,
            action.destination,
            action.departureDate,
        ].join(":")

        const confirmationText =
            action.confirmationPrompt ||
            `Add ${action.origin} → ${action.destination} for ${action.departureDate} to your watchlist?`

        prepareRealtimeConfirmation({
            action,
            confirmationText,
            duplicateKey,
            dependencies,
        })
    } catch {
        // Ignore malformed realtime tool arguments.
    }
}

export function handleRealtimeSaveVisibleFlightToolCall(
    item: any,
    dependencies: RealtimeVoiceToolHandlerDependencies
) {
    if (item?.name !== "prepare_save_visible_flight") return

    const rawArguments =
        typeof item.arguments === "string" ? item.arguments : ""

    if (!rawArguments) return

    try {
        const parsed = JSON.parse(rawArguments)

        const parsedPrice =
            typeof parsed.price === "number"
                ? parsed.price
                : Number(parsed.price)

        const action = normalizeLucyAction({
            type: "save_visible_flight",
            status: "needs_confirmation",
            origin: parsed.origin,
            destination: parsed.destination,
            departureDate: parsed.departureDate,
            airline: parsed.airline,
            airlineName: parsed.airlineName,
            flightNumber: parsed.flightNumber,
            price: Number.isFinite(parsedPrice) ? parsedPrice : null,
            currency: parsed.currency,
            flightLabel: parsed.flightLabel,
            confirmationPrompt: parsed.confirmationPrompt,
        })

        if (!action || action.type !== "save_visible_flight") return

        const duplicateKey = [
            action.type,
            action.origin,
            action.destination,
            action.departureDate ?? "",
            action.flightNumber ?? "",
        ].join(":")

        const confirmationText =
            action.confirmationPrompt ||
            `Save ${action.flightLabel ||
            action.flightNumber ||
            "that flight"
            } to your Saved Flights?`

        prepareRealtimeConfirmation({
            action,
            confirmationText,
            duplicateKey,
            dependencies,
        })
    } catch {
        // Ignore malformed realtime save-flight tool arguments.
    }
}

export function handleRealtimeSaveLucyMemoryToolCall(
    item: any,
    dependencies: RealtimeVoiceToolHandlerDependencies
) {
    if (item?.name !== "prepare_save_lucy_memory") return

    const rawArguments =
        typeof item.arguments === "string" ? item.arguments : ""

    if (!rawArguments) return

    try {
        const parsed = JSON.parse(rawArguments)

        const action = normalizeLucyAction({
            type: "save_lucy_memory",
            status: "needs_confirmation",
            memoryType: parsed.memoryType,
            memoryKey: parsed.memoryKey,
            memoryText: parsed.memoryText,
            memoryValueJson: parsed.memoryValueJson ?? null,
            confirmationPrompt: parsed.confirmationPrompt,
        })

        if (!action || action.type !== "save_lucy_memory") return

        const duplicateKey = [
            action.type,
            action.memoryType,
            action.memoryKey,
        ].join(":")

        const confirmationText =
            action.confirmationPrompt ||
            "Would you like me to remember that for future Skysirv sessions?"

        prepareRealtimeConfirmation({
            action,
            confirmationText,
            duplicateKey,
            dependencies,
        })
    } catch {
        // Ignore malformed realtime memory arguments.
    }
}