"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect } from "react"

const fadeUp = {
    initial: { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.6, ease: "easeOut" as const },
}

const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
}

const intelligenceLayers = [
    {
        title: "Skysirv Monitor™",
        description:
            "Persistent route monitoring built to watch airfare behavior beyond a single search session.",
    },
    {
        title: "Skysirv Signals™",
        description:
            "Intelligence-based fare signal detection designed to surface stronger timing opportunities.",
    },
    {
        title: "Skysirv Price Behavior™",
        description:
            "Route-level pricing behavior analysis that helps reveal pressure, direction, and volatility.",
    },
    {
        title: "Skysirv Predict™",
        description:
            "Forward-looking signal logic designed to support sharper booking decisions before the market shifts.",
    },
    {
        title: "Skyscore™",
        description:
            "A proprietary decision-quality layer built to reflect timing confidence and booking strength.",
    },
    {
        title: "Skysirv Insights™",
        description:
            "Condensed route intelligence designed to turn complex airfare movement into readable guidance.",
    },
    {
        title: "Skysirv Route Digest™",
        description:
            "A cleaner summary layer for understanding monitored route conditions at a glance.",
    },
    {
        title: "Skysirv Intelligence Engine™",
        description:
            "The core system connecting monitoring, signals, scoring, and route intelligence into one network.",
    },
]

const betaBenefits = [
    "Early access to the live Skysirv™ platform",
    "First look at the evolving intelligence dashboard experience",
    "Access to proprietary airfare intelligence layers as they expand",
    "A chance to help shape the product before wider rollout",
]

export default function BetaPage() {

    useEffect(() => {
        const originalBackground = document.body.style.background
        const originalBackgroundColor = document.body.style.backgroundColor

        document.body.style.background =
            "linear-gradient(to bottom, rgb(2 6 23), rgb(2 6 23), rgb(15 23 42))"
        document.body.style.backgroundColor = "rgb(2 6 23)"

        return () => {
            document.body.style.background = originalBackground
            document.body.style.backgroundColor = originalBackgroundColor
        }
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[-100px] top-16 h-80 w-80 rounded-full bg-sky-100/70 blur-2xl"
                    />
                    <motion.div
                        animate={{ x: [0, -28, 0], y: [0, -18, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[-120px] top-24 h-96 w-96 rounded-full bg-indigo-100/60 blur-2xl"
                    />
                    <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -24, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-80px] left-1/3 h-80 w-80 rounded-full bg-cyan-100/10 blur-2xl"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-16 md:pb-32 md:pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                            Limited Beta Access
                        </div>

                        <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl md:text-7xl">
                            Join the Skysirv™ Beta
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                            Skysirv™ is building an Airfare Intelligence Network designed to go
                            beyond flight search — helping travelers monitor routes, detect
                            better timing, and make more informed booking decisions with a
                            deeper intelligence layer behind every move.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/beta/apply"
                                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)] transition hover:bg-slate-800"
                            >
                                Join the Beta
                            </Link>

                            <Link
                                href="/signin"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/85 px-6 py-3 text-sm font-medium text-slate-900 shadow-sm backdrop-blur-sm transition hover:bg-slate-50"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                                Early platform access
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                                Live dashboard experience
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                                Evolving intelligence stack
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Beta */}
            <section className="px-6 py-16 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                            Why beta
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Early access to a more intelligent way to watch airfare
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            This beta is for travelers who want more than fare snapshots and
                            generic search results. It is an early look at a platform being
                            shaped around route monitoring, signal quality, and decision-ready
                            intelligence.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
                    >
                        {betaBenefits.map((benefit) => (
                            <motion.div
                                key={benefit}
                                variants={staggerItem}
                                className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)]"
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 shadow-inner">
                                    ✦
                                </div>
                                <p className="text-sm leading-7 text-slate-700">{benefit}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Intelligence Layer */}
            <section className="relative overflow-hidden px-6 py-16 md:py-24">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_35%,#ffffff_100%)]" />

                <div className="relative mx-auto max-w-6xl">
                    <motion.div {...fadeUp} className="max-w-3xl">
                        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                            Intelligence layer
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            The proprietary systems behind the platform
                        </h2>
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            Skysirv™ is being built as more than a single feature. The beta
                            gives early users access to the first connected layers of an
                            airfare intelligence system designed to work in synchrony.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.12 }}
                        className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        {intelligenceLayers.map((item) => (
                            <motion.div
                                key={item.title}
                                variants={staggerItem}
                                className="group h-full rounded-[1.75rem] border border-slate-800/90 bg-[linear-gradient(180deg,#0b1728_0%,#0f1d31_42%,#13243b_100%)] p-7 shadow-[0_20px_50px_rgba(2,6,23,0.16)]"
                            >
                                <div className="flex h-full flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-300">
                                            Beta Access
                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold text-white">
                                            {item.title}
                                        </h3>

                                        <p className="mt-4 text-sm leading-7 text-slate-300">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Beta Experience */}
            <section className="px-6 py-16 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        {...fadeUp}
                        className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.07)]"
                    >
                        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                            <div className="relative p-8 sm:p-10 md:p-12">
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-sky-50/60" />
                                <div className="relative">
                                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                                        What beta users get
                                    </p>

                                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                        A first look at the Skysirv™ dashboard ecosystem
                                    </h2>

                                    <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                                        Beta users step into the live product experience — from route
                                        monitoring and intelligence signals to annual wrapped views
                                        and tiered dashboards designed around decision quality, not
                                        just search.
                                    </p>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        <FeaturePill label="Live route monitoring" />
                                        <FeaturePill label="Intelligence dashboards" />
                                        <FeaturePill label="Signal-based decision support" />
                                        <FeaturePill label="Early product evolution" />
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white sm:p-10 md:p-12">
                                <motion.div
                                    animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
                                    transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute right-[-20px] top-[-20px] h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"
                                />
                                <motion.div
                                    animate={{ x: [0, -12, 0], y: [0, 16, 0] }}
                                    transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-[-30px] left-[-20px] h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl"
                                />

                                <div className="relative">
                                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-300">
                                        Beta philosophy
                                    </p>

                                    <div className="mt-6 space-y-5">
                                        <StoryPoint
                                            title="Selective by design"
                                            text="Beta access is application-based and reviewed before invitations are sent, keeping the rollout intentional and controlled."
                                        />
                                        <StoryPoint
                                            title="Built in the open"
                                            text="Early adopters get access while the platform continues to sharpen its intelligence layers and product polish."
                                        />
                                        <StoryPoint
                                            title="Serious platform direction"
                                            text="The goal is not a generic fare tool — it is a networked intelligence platform for air travel decision-making."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="px-6 pb-20 pt-8 md:pb-28">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        {...fadeUp}
                        className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-center text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
                    >
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.06, 1] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_38%)]"
                        />

                        <div className="relative">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                                Limited beta access
                            </p>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                                Step into the Skysirv™ beta
                            </h2>

                            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                Apply for early access to the platform, and if approved, you’ll receive
                                an invitation into the first wave of Skysirv™ beta users.
                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href="/beta/apply"
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-950 shadow-lg transition hover:bg-slate-100"
                                >
                                    Join the Beta
                                </Link>

                                <Link
                                    href="/signin"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
                                >
                                    Already have access?
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

function FeaturePill({ label }: { label: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {label}
        </div>
    )
}

function StoryPoint({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
        </div>
    )
}