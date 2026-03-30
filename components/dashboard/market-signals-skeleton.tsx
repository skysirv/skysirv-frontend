import Skeleton from "@/components/ui/skeleton"

export default function MarketSignalsSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">

      {/* Title */}

      <div className="mb-4">
        <Skeleton className="h-5 w-36" />
      </div>

      {/* Signals */}

      <div className="space-y-4">

        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />

      </div>

    </div>
  )
}