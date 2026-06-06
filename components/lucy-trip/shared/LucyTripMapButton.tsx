type LucyTripMapButtonProps = {
  onClick: () => void
}

export default function LucyTripMapButton({ onClick }: LucyTripMapButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-8 top-20 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-xl text-white shadow-[0_18px_45px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
      aria-label="Open Lucy trip map"
      title="Open Lucy trip map"
    >
      🗺️
    </button>
  )
}