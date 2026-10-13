"use client"

import styles from "./LucyVoiceOrb.module.css"

type LucyVoiceOrbStatus = "idle" | "connecting" | "listening" | "speaking" | "error"

export default function LucyVoiceOrb({ status }: { status: LucyVoiceOrbStatus }) {
  if (status === "idle" || status === "error") return null

  const speaking = status === "speaking"
  const connecting = status === "connecting"
  const label = connecting ? "Connecting" : speaking ? "Lucy is speaking" : "Listening"

  return (
    <div className="mx-auto mb-4 flex w-full max-w-[880px] items-center justify-center" role="status" aria-label={label}>
      <div className={`${styles.stage} ${speaking ? styles.speaking : ""} ${connecting ? styles.connecting : ""}`} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.orb}>
          <div className={styles.cloudOne} />
          <div className={styles.cloudTwo} />
          <div className={styles.cloudThree} />
          <div className={styles.shine} />
        </div>
      </div>
    </div>
  )
}
