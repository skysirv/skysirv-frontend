"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

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
        <>
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pt-32 text-white">
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        animate={{ opacity: [0.16, 0.28, 0.16], scale: [1, 1.04, 1] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%)]"
                    />
                    <motion.div
                        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
                        transition={{ duration: 8.6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[-40px] top-[-20px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
                        transition={{ duration: 9.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-[-40px] left-[-20px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10 lg:px-12">
                    {/* HERO */}
                    <div className="mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm"
                        >
                            Limited Beta Access
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
                            className="mt-8 text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
                        >
                            Join the Skysirv™ Beta
                            before wider rollout begins
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
                            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl"
                        >
                            Skysirv™ is building an Airfare Intelligence Network designed to go
                            beyond flight search — helping travelers monitor routes, detect
                            stronger timing, and make more informed booking decisions through a
                            deeper intelligence layer.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.58, ease: "easeOut" }}
                            className="mt-10 flex flex-wrap items-center justify-center gap-3"
                        >
                            <BetaPill label="Early platform access" />
                            <BetaPill label="Live dashboard experience" />
                            <BetaPill label="Evolving intelligence stack" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24, duration: 0.58, ease: "easeOut" }}
                            className="mt-10 flex flex-wrap justify-center gap-4"
                        >
                            <Link
                                href="/beta/apply"
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                            >
                                Join the Beta
                            </Link>

                            <Link
                                href="/signin"
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Already have access?
                            </Link>
                        </motion.div>
                    </div>

                    {/* WHY BETA */}
                    <div className="mx-auto mt-16 max-w-6xl">
                        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Why beta
                            </p>

                            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                Early access to a more intelligent way to watch airfare
                            </h2>

                            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
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
                                    className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-sm"
                                >
                                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-sky-200">
                                        ✦
                                    </div>
                                    <p className="text-sm leading-7 text-slate-300">{benefit}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* INTELLIGENCE LAYER */}
                    <div className="mx-auto mt-16 max-w-6xl">
                        <motion.div {...fadeUp} className="max-w-3xl">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Intelligence layer
                            </p>

                            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                The proprietary systems behind the platform
                            </h2>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
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
                                    className="group h-full rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-7 shadow-[0_25px_60px_rgba(2,6,23,0.35)]"
                                >
                                    <div className="flex h-full flex-col justify-between">
                                        <div>
                                            <div className="inline-flex items-center rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-200">
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

                    {/* BETA EXPERIENCE */}
                    <div className="mx-auto mt-16 max-w-6xl">
                        <motion.div
                            {...fadeUp}
                            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm"
                        >
                            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                                <div className="relative p-8 sm:p-10 md:p-12">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-sky-950/20" />
                                    <div className="relative">
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                            What beta users get
                                        </p>

                                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                            A first look at the Skysirv™ dashboard ecosystem
                                        </h2>

                                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
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
                                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
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

                    {/* CLOSING CTA */}
                    <div className="mx-auto mt-20 max-w-4xl">
                        <motion.div
                            {...fadeUp}
                            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-white shadow-[0_25px_70px_rgba(2,6,23,0.38)] backdrop-blur-sm"
                        >
                            <motion.div
                                animate={{ opacity: [0.12, 0.24, 0.12], scale: [1, 1.04, 1] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_38%)]"
                            />

                            <div className="relative">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                                    Limited beta access
                                </p>

                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                                    Step into the Skysirv™ beta
                                </h2>

                                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                    Apply for early access to the platform, and if approved, you’ll receive
                                    an invitation into the first wave of Skysirv™ beta users.
                                </p>

                                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Link
                                        href="/beta/apply"
                                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                    >
                                        Join the Beta
                                    </Link>

                                    <Link
                                        href="/signin"
                                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Already have access?
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <BetaFooter />
            </section>
        </>
    )
}

function BetaPill({ label }: { label: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
            {label}
        </div>
    )
}

function FeaturePill({ label }: { label: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 backdrop-blur-sm">
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

function BetaFooter() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
                <div className="flex max-w-xs flex-col justify-start text-center md:text-left">
                    <Link
                        href="/"
                        className="text-xl font-bold leading-none text-white transition hover:text-slate-300"
                    >
                        Skysirv™
                    </Link>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                        Flight intelligence that helps travelers understand pricing and
                        book with more confidence.
                    </p>
                </div>

                <div className="text-center md:text-left">
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                        Products
                    </h3>

                    <ul className="mt-4 space-y-3 text-sm text-slate-400">
                        <li>
                            <Link href="/pricing" className="transition hover:text-white">
                                Pricing
                            </Link>
                        </li>

                        <li>
                            <Link href="/booking" className="transition hover:text-white">
                                Booking
                            </Link>
                        </li>

                        <li>
                            <Link href="/ai-assistant" className="transition hover:text-white">
                                Skysirv Flight Attendant™
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="text-center md:text-left">
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                        Company
                    </h3>

                    <ul className="mt-4 space-y-3 text-sm text-slate-400">
                        <li>
                            <Link href="/about" className="transition hover:text-white">
                                About
                            </Link>
                        </li>

                        <li>
                            <Link href="/beta" className="transition hover:text-white">
                                Skysirv™ Beta
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="text-center md:text-left">
                    <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                        Legal
                    </h3>

                    <ul className="mt-4 space-y-3 text-sm text-slate-400">
                        <li>
                            <Link href="/privacy" className="transition hover:text-white">
                                Privacy
                            </Link>
                        </li>

                        <li>
                            <Link href="/terms" className="transition hover:text-white">
                                Terms
                            </Link>
                        </li>

                        <li>
                            <Link href="/refund-policy" className="transition hover:text-white">
                                Refund Policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 pt-6 text-center">
                <p className="text-sm text-slate-300">
                    &copy; {new Date().getFullYear()} Skysirv™. All rights reserved.
                </p>
            </div>
        </div>
    )
}