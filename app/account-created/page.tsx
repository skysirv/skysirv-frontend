"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AccountCreatedPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000) // TEMP for inspection (change back to 2500 later)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-white flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">

        <h1 className="text-2xl font-bold text-slate-900">
          Account Created
        </h1>

        <p className="mt-5 text-base text-slate-600 leading-relaxed">
          Thank you for creating your Skysirv account.
        </p>

        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          You should receive an activation email shortly.
        </p>

        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Please check your inbox and click the activation link to continue.
        </p>

        <p className="mt-5 text-base text-slate-500 leading-relaxed">
          If you don’t see the email, check your spam folder.
        </p>

      </div>

    </section>
  )
}