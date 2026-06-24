"use client"

import { Marker } from "react-map-gl/mapbox"

import type { SkysirvLiveAircraft } from "@/components/skysirv-live/skysirv-live-data"

export default function SkysirvLiveAircraftMarker({
  aircraft,
  isSelected = false,
}: {
  aircraft: SkysirvLiveAircraft
  isSelected?: boolean
}) {
  return (
    <Marker
      longitude={aircraft.longitude}
      latitude={aircraft.latitude}
      anchor="center"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`relative flex h-9 w-9 items-center justify-center drop-shadow-[0_8px_14px_rgba(15,23,42,0.28)] transition ${isSelected ? "scale-125" : ""
            }`}
          style={{
            transform: `rotate(${aircraft.heading - 60}deg)`,
          }}
          title={`${aircraft.flightNumber} · ${aircraft.originCode} to ${aircraft.destinationCode}`}
        >
          <img
            src="/images/skysirv-live/aircraft-marker.svg"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
          />
        </div>
      </div>
    </Marker>
  )
}