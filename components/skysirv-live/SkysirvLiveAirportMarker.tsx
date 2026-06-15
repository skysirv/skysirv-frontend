import { Marker } from "react-map-gl/mapbox"
import {
  getSeverityStyles,
  type SkysirvLiveAirport,
} from "@/components/skysirv-live/skysirv-live-data"

export default function SkysirvLiveAirportMarker({
  airport,
}: {
  airport: SkysirvLiveAirport
}) {
  const styles = getSeverityStyles(airport.severity)

  return (
    <Marker
      longitude={airport.longitude}
      latitude={airport.latitude}
      anchor="bottom"
    >
      <button
        type="button"
        className="group relative flex flex-col items-center"
        aria-label={`${airport.code} ${styles.label}`}
      >
        <span
          className={`relative h-4 w-4 rounded-full border-[3px] border-white ${styles.dot} shadow-[0_8px_18px_rgba(15,23,42,0.22)]`}
        />

        <span className="mt-1 rounded-full bg-white px-3 py-1 text-xs font-black tracking-tight text-slate-800 shadow-[0_10px_22px_rgba(15,23,42,0.18)]">
          {airport.code}
        </span>
      </button>
    </Marker>
  )
}