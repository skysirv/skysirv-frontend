type LargeChevronProps = {
  direction?: "left" | "right" | "up" | "down"
  className?: string
}

const directionClassNames: Record<
  NonNullable<LargeChevronProps["direction"]>,
  string
> = {
  right: "rotate-0",
  down: "rotate-90",
  left: "rotate-180",
  up: "-rotate-90",
}

export default function LargeChevron({
  direction = "right",
  className = "",
}: LargeChevronProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform ${directionClassNames[direction]} ${className}`}
      fill="none"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}