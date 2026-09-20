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
}: {
    messageId: string
    fullText: string
    setMessages: React.Dispatch<
        React.SetStateAction<FlightAttendantMessage[]>
    >
    setAssistantTyping: React.Dispatch<React.SetStateAction<boolean>>
}) {
    setAssistantTyping(true)

    const chunks = fullText.split(/(\s+)/)

    await new Promise<void>((resolve) => {
        let index = 0

        const timer = window.setInterval(() => {
            index += 1

            setMessages((prev) =>
                updateAssistantMessageText(
                    prev,
                    messageId,
                    chunks.slice(0, index).join("")
                )
            )

            if (index >= chunks.length) {
                window.clearInterval(timer)
                resolve()
            }
        }, 22)
    })

    setAssistantTyping(false)
}