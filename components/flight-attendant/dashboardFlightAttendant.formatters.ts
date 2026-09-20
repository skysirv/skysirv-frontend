export function sanitizeLucyText(text: string) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/^\s{0,3}#{1,6}\s+/gm, "")
        .trim()
}

export function formatLucyReplyText(reply: string) {
    const trimmed = reply.trim()

    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        return reply
    }

    try {
        const parsed = JSON.parse(trimmed)

        if (typeof parsed.reply === "string" && parsed.reply.trim()) {
            return parsed.reply.trim()
        }

        if (typeof parsed.response === "string" && parsed.response.trim()) {
            return parsed.response.trim()
        }

        if (typeof parsed.answer === "string" && parsed.answer.trim()) {
            return parsed.answer.trim()
        }

        if (parsed.action?.confirmationPrompt) {
            return parsed.action.confirmationPrompt
        }

        if (typeof parsed.message === "string" && parsed.message.trim()) {
            return parsed.message.trim()
        }
    } catch {
        return reply
    }

    return reply
}

export function normalizeFlightSearchText(value?: string | null) {
    return String(value ?? "").toUpperCase().replace(/\s+/g, "")
}

export function formatReadableFlightDate(value?: string | null) {
    if (!value) return null

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    })
}

export function formatVisibleFlightPrice(value?: number | null, currency = "USD") {
    if (typeof value !== "number" || !Number.isFinite(value)) return null

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value)
}