"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function BookingPage() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    animate={{ opacity: [0.14, 0.24, 0.14], scale: [1, 1.03, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_38%)]"
                />
                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
                    transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-[-40px] top-[-10px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -18, 0], y: [0, 20, 0] }}
                    transition={{ duration: 9.1, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-40px] left-[-20px] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
                />
            </div>

            <div className="relative mx-auto flex max-w-7xl flex-col px-6 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur-sm"
                    >
                        Skysirv™ Booking
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.7, ease: "easeOut" }}
                        className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
                    >
                        Booking built on
                        <span className="block bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
                            fare intelligence, not guesswork
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
                        className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl"
                    >
                        Skysirv™ Booking is planned as the execution layer for travelers who
                        want to move from route monitoring into smarter booking decisions
                        with more timing clarity, better context, and less noise.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.55, ease: "easeOut" }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-3"
                    >
                        <PreviewPill label="Timing-aware booking flow" />
                        <PreviewPill label="Intelligence-backed fare context" />
                        <PreviewPill label="Premium travel focus" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24, duration: 0.55, ease: "easeOut" }}
                        className="mt-10 flex flex-wrap justify-center gap-4"
                    >
                        <Link
                            href="/beta"
                            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Join the beta program
                        </Link>

                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            View pricing
                        </Link>
                    </motion.div>
                </div>

                <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
                    <PreviewCard
                        eyebrow="Step 1"
                        title="Search with context"
                        text="Booking is expected to begin with route-aware search, giving travelers more than raw fares by surfacing signal, timing, and pricing structure around each option."
                    />

                    <PreviewCard
                        eyebrow="Step 2"
                        title="Understand the moment"
                        text="Instead of forcing rushed decisions, the experience is intended to help users see whether a fare looks calm, aggressive, rising, or worth watching a little longer."
                    />

                    <PreviewCard
                        eyebrow="Step 3"
                        title="Book with more confidence"
                        text="The long-term goal is a smoother path from monitoring to action, so travelers can move on opportunities with a clearer sense of why now may be the right time."
                    />
                </div>

                <div className="mx-auto mt-16 max-w-6xl">
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-sm sm:p-10">
                        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                            <div>
                                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                    Early preview
                                </div>

                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    A future booking layer designed to feel calmer, sharper, and more disciplined.
                                </h2>

                                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                    Please pardon the appearance while the full Skysirv™ Booking
                                    experience is being shaped. Over time, this area is expected to
                                    connect monitoring, pricing behavior, and booking execution into
                                    one cleaner decision workflow.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <FeatureBlock
                                    title="Live price context"
                                    text="More than fare listings alone."
                                />
                                <FeatureBlock
                                    title="Signal-driven timing"
                                    text="Better context around when to act."
                                />
                                <FeatureBlock
                                    title="Premium cabin focus"
                                    text="Built with high-value trips in mind."
                                />
                                <FeatureBlock
                                    title="Seamless workflow"
                                    text="From watching to booking in one system."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-16 max-w-4xl text-center">
                    <p className="text-sm uppercase tracking-[0.16em] text-slate-400">
                        Coming in the months ahead
                    </p>

                    <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Skysirv Booking will turn intelligence into action.
                    </h3>

                    <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                        In the meantime, this preview is here to show the direction: a smarter
                        booking layer built to help travelers move with more confidence when
                        the market presents the right opportunity.
                    </p>
                </div>
            </div>
        </section>
    )
}

function PreviewPill({ label }: { label: string }) {
    return (
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
            {label}
        </div>
    )
}

function PreviewCard({
    eyebrow,
    title,
    text,
}: {
    eyebrow: string
    title: string
    text: string
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22 }}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
        >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
        </motion.div>
    )
}

function FeatureBlock({
    title,
    text,
}: {
    title: string
    text: string
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-base font-semibold text-white">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
        </div>
    )
}