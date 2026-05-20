import Link from "next/link"

export default function ServiceOutagePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            Service notice
          </div>

          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Skysirv systems are temporarily unavailable.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Our backend service provider is currently experiencing a service
            disruption. Your account, watchlist, saved flights, and alerts are
            safe, but some Skysirv features may be unavailable until service is
            restored.
          </p>

          <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-950">Account access</p>
              <p className="mt-1 leading-6">Sign in may be temporarily unavailable.</p>
            </div>

            <div>
              <p className="font-semibold text-slate-950">Lucy</p>
              <p className="mt-1 leading-6">Voice and dashboard intelligence may pause.</p>
            </div>

            <div>
              <p className="font-semibold text-slate-950">Monitoring</p>
              <p className="mt-1 leading-6">Route data remains protected.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Return home
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              View plans
            </Link>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            We’ll restore full access as soon as the upstream service is stable.
            Thanks for your patience while Skysirv gets back in the air.
          </p>
        </section>
      </div>
    </main>
  )
}