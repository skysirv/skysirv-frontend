"use client"

import { useState } from "react"

import LucyTripComposer from "@/components/lucy-trip/shared/LucyTripComposer"
import LucyTripGuideContent from "@/components/lucy-trip/shared/LucyTripGuideContent"
import LucyTripLeftRail from "@/components/lucy-trip/shared/LucyTripLeftRail"
import LucyTripMapButton from "@/components/lucy-trip/shared/LucyTripMapButton"
import LucyTripMapPanel from "@/components/lucy-trip/shared/LucyTripMapPanel"
import LucyTripTopBar from "@/components/lucy-trip/shared/LucyTripTopBar"

export default function LucyTripLabShell() {
  const [mapPanelOpen, setMapPanelOpen] = useState(false)

  return (
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="relative h-screen overflow-hidden bg-white px-5 pb-10 pt-5 sm:px-8">
        <LucyTripTopBar />

        <LucyTripLeftRail />

        <LucyTripGuideContent />

        <LucyTripMapButton onClick={() => setMapPanelOpen(true)} />

        <LucyTripMapPanel
          open={mapPanelOpen}
          onClose={() => setMapPanelOpen(false)}
        />

        <LucyTripComposer />
      </section>
    </main>
  )
}