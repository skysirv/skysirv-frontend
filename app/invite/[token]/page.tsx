"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearAuthSession } from "@/utils/auth-storage"

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()

  useEffect(() => {
    clearAuthSession()
    window.dispatchEvent(new Event("skysirv-auth-changed"))

    router.replace(
      `/dashboard/pro?welcome=1&gifted=true&setupLifetimePro=1&inviteToken=${encodeURIComponent(params.token)}`
    )
  }, [params.token, router])

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-md">
        <p className="text-sm font-medium text-slate-600">
          Preparing your Lifetime Pro dashboard...
        </p>
      </div>
    </section>
  )
}