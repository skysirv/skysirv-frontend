export default function AboutPage() {
  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-white px-6 py-20">

      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-semibold text-slate-900">
          About Skysirv
        </h1>

        <p className="mt-6 text-slate-600 leading-relaxed">
          Skysirv is an airfare intelligence platform designed to help travelers
          understand price behavior instead of reacting blindly to airfare
          changes. By analyzing pricing patterns, volatility, and historical
          behavior, Skysirv provides signals that help travelers decide when to
          monitor, wait, or book with confidence.
        </p>

        <p className="mt-4 text-slate-600 leading-relaxed">
          Traditional flight search tools show prices. Skysirv explains them.
          Our intelligence engine evaluates pricing conditions across routes and
          transforms raw fare data into actionable travel insights.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-slate-900">
          The Skysirv Intelligence Engine™
        </h2>

        <p className="mt-4 text-slate-600 leading-relaxed">
          The Skysirv Intelligence Engine™ continuously monitors airfare markets,
          identifies meaningful price signals, and interprets how fares behave
          over time so travelers can make better booking decisions.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-slate-900">
          Contact
        </h2>

        <p className="mt-4 text-slate-600">
          For general inquiries, partnerships, or support related to the
          Skysirv platform, please contact us at:
        </p>

        <p className="mt-2 font-medium text-slate-900">
          support@skysirv.com
        </p>

      </div>

    </section>
  )
}