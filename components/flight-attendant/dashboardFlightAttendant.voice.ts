import type React from "react"

export function clearRealtimeMicrophoneResumeTimer(
    timerRef: React.MutableRefObject<number | null>
) {
    if (timerRef.current === null) return

    window.clearTimeout(timerRef.current)
    timerRef.current = null
}

export function pauseRealtimeMicrophone({
    clearTimer,
    isPausedRef,
    disableMicrophone,
}: {
    clearTimer: () => void
    isPausedRef: React.MutableRefObject<boolean>
    disableMicrophone: () => void
}) {
    clearTimer()

    if (isPausedRef.current) return

    isPausedRef.current = true
    disableMicrophone()
}

export function resumeRealtimeMicrophone({
    clearTimer,
    isPausedRef,
    enableMicrophone,
}: {
    clearTimer: () => void
    isPausedRef: React.MutableRefObject<boolean>
    enableMicrophone: () => void
}) {
    clearTimer()

    if (!isPausedRef.current) return

    isPausedRef.current = false
    enableMicrophone()
}

export function scheduleRealtimeMicrophoneResume({
    timerRef,
    delayMs = 1400,
    resumeMicrophone,
}: {
    timerRef: React.MutableRefObject<number | null>
    delayMs?: number
    resumeMicrophone: () => void
}) {
    clearRealtimeMicrophoneResumeTimer(timerRef)

    timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        resumeMicrophone()
    }, delayMs)
}

export function cleanupRealtimeAudioElement(
    audioElementRef: React.MutableRefObject<HTMLAudioElement | null>
) {
    const audioElement = audioElementRef.current

    if (!audioElement) return

    audioElement.pause()
    audioElement.srcObject = null
    audioElementRef.current = null
}

export async function setRealtimeMicrophoneEnabled({
    enabled,
    localStreamRef,
    micTrackRef,
    audioSenderRef,
}: {
    enabled: boolean
    localStreamRef: React.MutableRefObject<MediaStream | null>
    micTrackRef: React.MutableRefObject<MediaStreamTrack | null>
    audioSenderRef: React.MutableRefObject<RTCRtpSender | null>
}) {
    const micTrack = micTrackRef.current
    const audioSender = audioSenderRef.current

    localStreamRef.current?.getAudioTracks().forEach((track) => {
        track.enabled = enabled
    })

    if (!audioSender) return

    try {
        if (!enabled) {
            await audioSender.replaceTrack(null)
            return
        }

        if (micTrack && micTrack.readyState === "live") {
            await audioSender.replaceTrack(micTrack)
        }
    } catch (error) {
        console.warn("Lucy realtime microphone toggle failed", error)
    }
}