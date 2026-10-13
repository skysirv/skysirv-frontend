import type React from "react"

import {
    updateAssistantMessageText,
} from "./dashboardFlightAttendant.messages"

import { type FlightAttendantMessage } from "./dashboardFlightAttendant.types"

export async function typeAssistantMessage({
    messageId,
    fullText,
    setMessages,
    setAssistantTyping,
    signal,
}: {
    messageId: string
    fullText: string
    setMessages: React.Dispatch<
        React.SetStateAction<FlightAttendantMessage[]>
    >
    setAssistantTyping: React.Dispatch<React.SetStateAction<boolean>>
    signal?: AbortSignal
}) {
    if (signal?.aborted) return
    setAssistantTyping(true)
    const chunks = fullText.split(/(\s+)/)
    try {
        await new Promise<void>((resolve) => {
            let index = 0
            let settled = false
            let timer: number | null = null
            const finish = () => {
                if (settled) return
                settled = true
                if (timer !== null) window.clearInterval(timer)
                signal?.removeEventListener("abort", finish)
                resolve()
            }
            signal?.addEventListener("abort", finish, { once: true })
            if (signal?.aborted) return finish()
            timer = window.setInterval(() => {
                if (signal?.aborted) return finish()
                index += 1
                setMessages((prev) =>
                    updateAssistantMessageText(prev, messageId, chunks.slice(0, index).join(""))
                )
                if (index >= chunks.length) finish()
            }, 22)
        })
    } finally {
        if (!signal?.aborted) setAssistantTyping(false)
    }
}
