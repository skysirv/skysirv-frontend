"use client"

import CreateAccountForm from "@/components/auth/CreateAccountForm"

export default function CreateAccountPage() {
  return (
    <section className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your Skysirv™ account
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Start monitoring airfare with real travel intelligence
        </p>

        <div className="mt-6">
          <CreateAccountForm />
        </div>
      </div>
    </section>
  )
}