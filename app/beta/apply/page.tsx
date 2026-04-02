"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "@/components/ui/Toasts/use-toast"

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.6, ease: "easeOut" as const },
}

export default function BetaApplyPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [travelFrequency, setTravelFrequency] = useState("")
    const [bookingMethod, setBookingMethod] = useState("")
    const [reason, setReason] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!fullName.trim() || !email.trim() || !travelFrequency.trim() || !bookingMethod.trim() || !reason.trim()) {
            toast({
                title: "Missing information",
                description: "Please complete all fields before submitting your application.",
                variant: "destructive",
            })
            return
        }

        setSubmitting(true)

        try {
            // Temporary placeholder until backend beta application endpoint is connected
            await new Promise((resolve) => setTimeout(resolve, 900))

            toast({
                title: "Application received",
                description: "Your beta application has been submitted for review.",
            })

            setFullName("")
            setEmail("")
            setTravelFrequency("")
            setBookingMethod("")
            setReason("")
        } catch (error) {
            console.error("Beta application submit failed", error)

            toast({
                title: "Submission failed",
                description: "We could not submit your beta application right now.",
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_42%,#ffffff_100%)]">
                <div className="pointer-events-none absolute inset-0">
                    <motion.div
                        animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[-100px] top-16 h-80 w-80 rounded-full bg-sky-100/70 blur-2xl"
                    />
                    <motion.div
                        animate={{ x: [0, -24, 0], y: [0, -18, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[-120px] top-24 h-96 w-96 rounded-full bg-indigo-100/60 blur-2xl"
                    />
                </div>

                <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 md:pb-24 md:pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <Link
                            href="/beta"
                            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                        >
                            ← Back to Beta
                        </Link>
                    </motion.div>

                    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm backdrop-blur-sm">
                                Beta Application
                            </div>

                            <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                                Apply for Skysirv™ beta access
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                                Beta access is intentionally reviewed before invitations are sent.
                                Approved applicants will receive a private invite into the platform
                                and complimentary Lifetime Pro Subscription during and after the beta program.
                            </p>

                            <div className="mt-8 space-y-4">
                                <InfoCard
                                    title="What happens after you apply"
                                    text="Your application is reviewed manually before access is approved."
                                />
                                <InfoCard
                                    title="If approved"
                                    text="You’ll receive a private invite link to activate your account and enter the platform."
                                />
                                <InfoCard
                                    title="Beta positioning"
                                    text="This is a controlled early-access rollout for users who want to engage with the platform seriously."
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            {...fadeUp}
                            className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                                    Beta application form
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Tell us a bit about yourself and why you want access.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        How often do you travel?
                                    </label>
                                    <select
                                        value={travelFrequency}
                                        onChange={(e) => setTravelFrequency(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    >
                                        <option value="">Select one</option>
                                        <option value="occasionally">A few times a year</option>
                                        <option value="regularly">Monthly or regularly</option>
                                        <option value="frequently">Very frequently</option>
                                        <option value="power-user">Power traveler / constant flyer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        How do you currently book flights?
                                    </label>
                                    <input
                                        type="text"
                                        value={bookingMethod}
                                        onChange={(e) => setBookingMethod(e.target.value)}
                                        placeholder="Example: Google Flights, airline sites, OTA platforms, travel agent"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Why do you want access to Skysirv™?
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Tell us why you want beta access and how you’d use the platform."
                                        rows={6}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? "Submitting..." : "Submit Beta Application"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    )
}

function InfoCard({
    title,
    text,
}: {
    title: string
    text: string
}) {
    return (
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
        </div>
    )
}