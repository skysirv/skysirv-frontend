"use client"

import styles from "./LucyVoiceOrb.module.css"

type LucyVoiceOrbStatus = "idle" | "connecting" | "listening" | "speaking" | "error"

export default function LucyVoiceOrb({ status }: { status: LucyVoiceOrbStatus }) {
  if (status === "idle" || status === "error") return null

  const speaking = status === "speaking"
  const connecting = status === "connecting"
  const label = connecting ? "Connecting…" : speaking ? "Lucy is speaking…" : "Listening…"

  return (
    <div className="mx-auto mb-4 flex w-full max-w-[880px] flex-col items-center justify-center gap-1" role="status" aria-label={label}>
      <div className={styles.stage} aria-hidden="true">
        <div className={`${styles.halo} ${speaking ? styles.haloSpeaking : ""}`} />
        <div className={`${styles.ring} ${speaking ? styles.ringSpeaking : ""}`} />
        <div className={`${styles.orb} ${speaking ? styles.orbSpeaking : ""} ${connecting ? styles.orbConnecting : ""}`}>
          <div className={styles.highlight} />
          {speaking && (
            <div className={styles.bars}>
              {[0, 1, 2, 3, 4].map((index) => (
                <span key={index} style={{ animationDelay: `${index * 110}ms` }} />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-xs font-medium tracking-wide text-slate-600">{label}</p>
    </div>
  )
}
