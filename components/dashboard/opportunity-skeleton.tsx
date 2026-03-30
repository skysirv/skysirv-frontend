import Skeleton from "@/components/ui/skeleton"

export default function OpportunitySkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">

      {/* Title */}

      <div className="mb-4">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Description */}

      <div className="space-y-3 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Intelligence metrics */}

      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

    </div>
  )
}