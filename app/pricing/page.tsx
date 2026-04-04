"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import AuthModal from "@/components/auth/AuthModal"
import CreateAccountForm from "@/components/auth/CreateAccountForm"

type Billing = "monthly" | "annual"

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ")
}

export default function PricingPage() {
    const [billing, setBilling] = useState<Billing>("monthly")
    const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false)

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

    const prices = useMemo(() => {
        const monthly = { free: 0, pro: 19, enterprise: 59 }
        const annual = { free: 0, pro: 15, enterprise: 49 }

        return billing === "monthly" ? monthly : annual
    }, [billing])

    const billingLabel =
        billing === "monthly"
            ? "Billed monthly"
            : "Billed annually (save ~20%)"

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

                <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12">
                    {/* HERO */}
                    <div className="mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm"
                        >
                            Skysirv™ Pricing
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.06, duration: 0.72, ease: "easeOut" }}
                            className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
                        >
                            Choose the intelligence layer
                            <span className="block bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
                                built for your travel style
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.14, duration: 0.62, ease: "easeOut" }}
                            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl"
                        >
                            Start free, monitor the routes that matter, and upgrade when you want
                            deeper fare intelligence, smarter signals, and a stronger timing edge.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.58, ease: "easeOut" }}
                            className="mt-10 flex flex-wrap items-center justify-center gap-3"
                        >
                            <MarketingPill label="Signal-first monitoring" />
                            <MarketingPill label="Adaptive fare scoring" />
                            <MarketingPill label="Forecast intelligence" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24, duration: 0.58, ease: "easeOut" }}
                            className="mt-10 flex justify-center"
                        >
                            <button
                                type="button"
                                onClick={() => setCreateAccountModalOpen(true)}
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition hover:bg-slate-200"
                            >
                                Create account to continue
                            </button>
                        </motion.div>
                    </div>

                    {/* VALUE STRIP */}
                    <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
                        <ValuePanel
                            title="Free"
                            text="Get started with core monitoring and basic fare visibility."
                        />
                        <ValuePanel
                            title="Pro"
                            text="Unlock stronger pricing context, signals, and predictive timing support."
                        />
                        <ValuePanel
                            title="Enterprise"
                            text="Access the full Skysirv intelligence environment for maximum leverage."
                        />
                    </div>

                    {/* PRICING PANEL */}
                    <div className="mx-auto mt-16 max-w-6xl">
                        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:px-8 sm:py-10">
                            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                                <div className="max-w-3xl">
                                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                        Pricing overview
                                    </div>

                                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                        Start free — upgrade when intelligence becomes leverage
                                    </h2>

                                    <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
                                        Skysirv™ is built for travelers who want signal over noise —
                                        and timing advantage over guesswork.
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 p-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setBilling("monthly")}
                                        className={cn(
                                            "rounded-lg px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-500",
                                            billing === "monthly"
                                                ? "bg-white text-slate-950 shadow-sm"
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Monthly
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setBilling("annual")}
                                        className={cn(
                                            "rounded-lg px-4 py-2 text-sm font-medium transition focus:ring-2 focus:ring-slate-500",
                                            billing === "annual"
                                                ? "bg-white text-slate-950 shadow-sm"
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        Annual
                                    </button>
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-400">{billingLabel}</p>

                            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                                <MarketingTierCard
                                    title="Free"
                                    subtitle="Basic fare monitoring"
                                    price={prices.free}
                                    priceNote="Always free"
                                    accent={false}
                                    badge={undefined}
                                    ctaLabel="Create account"
                                    ctaVariant="secondary"
                                    onClick={() => setCreateAccountModalOpen(true)}
                                    bullets={[
                                        { label: "Watchlist", value: "Up to 3 routes" },
                                        { label: "Price history", value: "Basic snapshots" },
                                        { label: "Skyscore™", value: "Preview only" },
                                        { label: "Skysirv Signals™", value: "Limited alerts" },
                                        { label: "Monitoring", value: "Standard cadence" },
                                    ]}
                                />

                                <MarketingTierCard
                                    title="Pro"
                                    subtitle="Advanced intelligence"
                                    price={prices.pro}
                                    priceNote={
                                        billing === "annual"
                                            ? "per month billed annually"
                                            : "per month"
                                    }
                                    accent
                                    badge="Most Popular"
                                    ctaLabel="Create account"
                                    ctaVariant="primary"
                                    onClick={() => setCreateAccountModalOpen(true)}
                                    bullets={[
                                        { label: "Watchlist", value: "Up to 25 routes" },
                                        { label: "Price Behavior™", value: "30–90 day analysis" },
                                        { label: "Skyscore™", value: "Full intelligence scoring" },
                                        { label: "Skysirv Signals™", value: "Smart drop detection" },
                                        { label: "Skysirv Predict™", value: "Forecast signals" },
                                    ]}
                                />

                                <MarketingTierCard
                                    title="Enterprise"
                                    subtitle="Full Skysirv engine"
                                    price={prices.enterprise}
                                    priceNote={
                                        billing === "annual"
                                            ? "per month billed annually"
                                            : "per month"
                                    }
                                    accent={false}
                                    badge="Full System Access"
                                    ctaLabel="Create account"
                                    ctaVariant="secondary"
                                    onClick={() => setCreateAccountModalOpen(true)}
                                    bullets={[
                                        { label: "Watchlist", value: "Unlimited routes" },
                                        { label: "Price Behavior™", value: "Extended history" },
                                        { label: "Skysirv Predict™", value: "Forecast modeling" },
                                        { label: "Skysirv Insights™", value: "Advanced analysis" },
                                        { label: "Intelligence Engine™", value: "Full system access" },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM STORY */}
                    <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Why pricing matters
                            </p>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                This is not just a pricing page. It is your entry point into a calmer booking workflow.
                            </h2>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                Skysirv™ is designed to help travelers monitor routes, understand
                                pricing behavior, and make more disciplined booking decisions
                                using structured signals instead of raw fare noise.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <SlateMetricCard
                                    label="Free"
                                    value="Entry"
                                    subtext="Basic route visibility"
                                />
                                <SlateMetricCard
                                    label="Pro"
                                    value="Advantage"
                                    subtext="Timing + scoring + signals"
                                />
                                <SlateMetricCard
                                    label="Enterprise"
                                    value="Full Engine"
                                    subtext="Deep intelligence access"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <SlateFeatureCard
                                title="Clarity"
                                text="Organize route behavior into something easier to read and act on."
                            />
                            <SlateFeatureCard
                                title="Timing"
                                text="Recognize meaningful market moments before they disappear."
                            />
                            <SlateFeatureCard
                                title="Confidence"
                                text="Use structured summaries and scoring to reduce booking uncertainty."
                            />
                            <SlateFeatureCard
                                title="Discipline"
                                text="Turn a noisy airfare market into a cleaner decision process."
                            />
                        </div>
                    </div>

                    {/* COMPARISON TABLE */}
                    <div className="mx-auto mt-20 max-w-6xl">
                        <DetailedPricingTableDark />
                    </div>

                    {/* FINAL CTA */}
                    <div className="mx-auto mt-20 max-w-6xl">
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center shadow-[0_25px_70px_rgba(2,6,23,0.38)] backdrop-blur-sm sm:px-8 sm:py-16">
                            <div className="pointer-events-none absolute inset-0">
                                <motion.div
                                    animate={{ opacity: [0.12, 0.2, 0.12], scale: [1, 1.03, 1] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_40%)]"
                                />
                            </div>

                            <div className="relative mx-auto max-w-3xl">
                                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                    Start with the plan that fits now.
                                    <span className="block text-slate-300">
                                        Upgrade when you want deeper intelligence.
                                    </span>
                                </h2>

                                <p className="mt-6 text-lg leading-8 text-slate-300">
                                    Create your account, verify your email, and continue through the
                                    correct Skysirv onboarding flow without skipping a step.
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCreateAccountModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                    >
                                        Create account to continue
                                    </button>

                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Back to homepage
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <PricingFooter />
            </section>

            <AuthModal
                open={createAccountModalOpen}
                onClose={() => setCreateAccountModalOpen(false)}
                title="Create your Skysirv™ account"
                description="Start monitoring airfare with real travel intelligence"
                maxWidthClassName="max-w-sm"
            >
                <CreateAccountForm />
            </AuthModal>
        </>
    )
}

function MarketingPill({ label }: { label: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
            {label}
        </div>
    )
}

function ValuePanel({
    title,
    text,
}: {
    title: string
    text: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
        </motion.div>
    )
}

function MarketingTierCard(props: {
    title: string
    subtitle: string
    price: number
    priceNote: string
    bullets: Array<{ label: string; value: string }>
    accent: boolean
    badge?: string
    ctaLabel: string
    ctaVariant: "primary" | "secondary"
    onClick: () => void
}) {
    const {
        title,
        subtitle,
        price,
        priceNote,
        bullets,
        accent,
        badge,
        ctaLabel,
        ctaVariant,
        onClick,
    } = props

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.22 }}
            className={cn(
                "relative overflow-hidden rounded-[1.75rem] border p-7 shadow-[0_25px_60px_rgba(2,6,23,0.35)]",
                accent
                    ? "border-sky-400/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 ring-1 ring-sky-300/20"
                    : "border-white/10 bg-gradient-to-b from-slate-900 to-slate-950"
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent)]" />

            {accent && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300/50 via-white/60 to-sky-300/50" />
            )}

            <div className="relative">
                <div className="mb-3 flex min-h-[24px] justify-end">
                    {badge && (
                        <span
                            className={cn(
                                "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
                                accent
                                    ? "border border-sky-300/20 bg-sky-400/10 text-sky-200"
                                    : "border border-white/10 bg-white/5 text-slate-300"
                            )}
                        >
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{subtitle}</p>

                <div className="mt-6 text-5xl font-semibold tracking-tight text-white">
                    {price === 0 ? "$0" : `$${price}`}
                </div>

                <p className="mt-2 text-xs text-slate-400">{priceNote}</p>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onClick}
                        className={cn(
                            "w-full rounded-xl px-4 py-3 text-sm font-medium transition",
                            ctaVariant === "primary"
                                ? "bg-white text-slate-950 hover:bg-slate-200"
                                : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        )}
                    >
                        {ctaLabel}
                    </button>
                </div>

                <div className="mt-7 space-y-3">
                    {bullets.map((bullet) => (
                        <div
                            key={bullet.label}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                        >
                            <span className="text-xs font-medium text-slate-400">
                                {bullet.label}
                            </span>
                            <span className="text-xs text-slate-200">{bullet.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

function SlateMetricCard({
    label,
    value,
    subtext,
}: {
    label: string
    value: string
    subtext: string
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-xs text-slate-400">{subtext}</p>
        </div>
    )
}

function SlateFeatureCard({
    title,
    text,
}: {
    title: string
    text: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
        </motion.div>
    )
}

function PricingFooter() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-16 text-center md:max-w-4xl md:text-left">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:justify-items-center md:text-center">
                {/* Brand */}
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

                {/* Products */}
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

                {/* Company */}
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
                                Beta Program
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal */}
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

function DetailedPricingTableDark() {
    const plans = ["Free", "Pro", "Enterprise"]

    const sections = [
        {
            title: "Core Monitoring",
            rows: [
                {
                    label: "Watchlist",
                    values: ["3 routes", "25 routes", "Unlimited"],
                },
                {
                    label: "Monitoring cadence",
                    values: ["Standard", "High frequency", "Real-time priority"],
                },
                {
                    label: "Route coverage",
                    values: ["Basic", "Expanded", "Global coverage"],
                },
            ],
        },
        {
            title: "Skysirv Intelligence Layer",
            rows: [
                {
                    label: "Skysirv Monitor™",
                    values: [
                        "Basic monitoring",
                        "High-frequency monitoring",
                        "Priority monitoring",
                    ],
                },
                {
                    label: "Skysirv Signals™",
                    values: [
                        "Limited alerts",
                        "Smart drop detection",
                        "Priority intelligence alerts",
                    ],
                },
                {
                    label: "Skysirv Price Behavior™",
                    values: [
                        "Basic snapshots",
                        "30–90 day analysis",
                        "Extended behavioral history",
                    ],
                },
                {
                    label: "Skysirv Predict™",
                    values: ["—", "Forecast signals", "Deep forecasting models"],
                },
                {
                    label: "Skyscore™",
                    values: ["Preview only", "Full scoring", "Advanced scoring"],
                },
                {
                    label: "Skysirv Insights™",
                    values: ["—", "Standard insights", "Advanced route analysis"],
                },
                {
                    label: "Skysirv Route Digest™",
                    values: ["—", "Included", "Enhanced summaries"],
                },
                {
                    label: "Skysirv Intelligence Engine™",
                    values: ["—", "Partial access", "Full system access"],
                },
            ],
        },
        {
            title: "Advanced Intelligence",
            rows: [
                { label: "Trend analysis", values: ["—", "Standard", "Advanced"] },
                {
                    label: "Volatility insights",
                    values: ["—", "Included", "Enhanced"],
                },
                {
                    label: "Historical depth",
                    values: ["Limited", "Expanded", "Full dataset"],
                },
            ],
        },
        {
            title: "Platform Access",
            rows: [
                { label: "Dashboard", values: ["✔", "✔", "✔"] },
                { label: "Alerts", values: ["Basic", "Smart alerts", "Priority alerts"] },
                { label: "Multi-device sync", values: ["✔", "✔", "✔"] },
            ],
        },
    ]

    return (
        <div className="mx-auto max-w-6xl">
            <h3 className="text-5xl font-semibold text-white">
                Full feature breakdown
            </h3>

            <p className="mt-2 text-lg text-slate-400">
                Compare Skysirv™ intelligence capabilities across all plans
            </p>

            <div className="mt-10 overflow-x-auto">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-sm">
                    <div className="grid min-w-[700px] grid-cols-4 border-b border-white/10 bg-white/[0.04] text-sm font-medium text-slate-300">
                        <div className="px-6 py-4">Feature</div>
                        {plans.map((plan) => (
                            <div key={plan} className="px-6 py-4 text-center">
                                {plan}
                            </div>
                        ))}
                    </div>

                    {sections.map((section) => (
                        <div key={section.title}>
                            <div className="border-t border-white/10 bg-white/[0.03] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                {section.title}
                            </div>

                            {section.rows.map((row, index) => (
                                <div
                                    key={row.label}
                                    className={cn(
                                        "grid min-w-[700px] grid-cols-4 border-t border-white/5 text-sm",
                                        index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                                    )}
                                >
                                    <div className="px-6 py-4 font-medium text-slate-200">
                                        {row.label}
                                    </div>

                                    {row.values.map((value, idx) => (
                                        <div
                                            key={idx}
                                            className="px-6 py-4 text-center text-slate-400"
                                        >
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}