"use client"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  clearAuthSession,
  getAuthToken,
} from "@/utils/auth-storage"
import DashboardFlightAttendant from "@/components/flight-attendant/DashboardFlightAttendant"
import AuthModal from "@/components/auth/AuthModal"
import AuthPanel from "@/components/auth/AuthPanel"
import {
  deleteLucyConversation,
  getRecentLucyConversations,
  updateLucyConversation,
  type LucyConversationSummary,
} from "@/components/flight-attendant/dashboardFlightAttendant.chat"

const LUCY_HOMEPAGE_PROMPT_KEY =
  "skysirv-lucy-homepage-prompt"

function RailIcon({
  children,
  active = false,
  onClick,
  ariaLabel,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={[
        "flex h-10 w-10 items-center justify-center rounded-xl transition",
        active
          ? "bg-cyan-50 text-cyan-700"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function SectionHeading({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="px-3 pb-2 pt-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-950">
        {children}
      </p>
    </div>
  )
}

function LucyRailItem({
  label,
  icon,
  menuOpen,
  onMenuToggle,
  onClick,
  onPinAction,
  onMoveToPlannedTrip,
  onRenameAction,
  showMoveToPlannedTrip = false,
  onDeleteAction,
  pinActionLabel = "Unpin",
  active = false,
}: {
  label: string
  icon?: string
  menuOpen: boolean
  onMenuToggle: () => void
  onClick?: () => void
  onPinAction?: () => void
  onMoveToPlannedTrip?: () => void
  onRenameAction?: () => void
  showMoveToPlannedTrip?: boolean
  onDeleteAction?: () => void
  pinActionLabel?: "Pin" | "Unpin"
  active?: boolean
}) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!menuOpen) return
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        onMenuToggle()
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [menuOpen, onMenuToggle])
  return (
    <div ref={menuRef} className="group relative">
      <button
        type="button"
        onClick={onClick}
        className={[
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 pr-10 text-left text-sm text-slate-950 transition",
          active
            ? "bg-slate-100"
            : "hover:bg-slate-100",
        ].join(" ")}
      >
        {icon && (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
          />
        )}
        <span className="min-w-0 truncate">
          {label}
        </span>
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onMenuToggle()
        }}
        aria-label={`More options for ${label}`}
        className="absolute right-2 top-1/2 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center group-hover:flex"
      >
        <img
          src="/images/stock/lucy-chat/lucy-rail/more.svg"
          alt=""
          aria-hidden="true"
          className="h-4 w-4 object-contain"
        />
      </button>
      {menuOpen && (
        <div className="absolute right-2 top-[calc(100%-2px)] z-40 w-[180px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
          {[
            {
              label: "Share",
              icon: "/images/stock/lucy-chat/lucy-rail/share.svg",
            },
            {
              label: "Rename",
              icon: "/images/stock/lucy-chat/lucy-rail/rename.svg",
            },
            {
              label: pinActionLabel,
              icon:
                pinActionLabel === "Pin"
                  ? "/images/stock/lucy-chat/lucy-rail/pin.svg"
                  : "/images/stock/lucy-chat/lucy-rail/unpin.svg",
            },
            ...(showMoveToPlannedTrip
              ? [
                {
                  label: "Move to planned trips",
                  icon: "/images/stock/lucy-chat/lucy-rail/planned-trip.svg",
                },
              ]
              : []),
            {
              label: "Delete",
              icon: "/images/stock/lucy-chat/lucy-rail/delete.svg",
              destructive: true,
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (
                  item.label === "Pin" ||
                  item.label === "Unpin"
                ) {
                  onPinAction?.()
                  return
                }

                if (item.label === "Move to planned trips") {
                  onMoveToPlannedTrip?.()
                  return
                }

                if (item.label === "Rename") {
                  onRenameAction?.()
                  return
                }

                if (item.label === "Delete") {
                  onDeleteAction?.()
                }
              }}
              className={[
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100",
                item.destructive
                  ? "text-red-600"
                  : "text-slate-950",
              ].join(" ")}
            >
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 shrink-0 object-contain"
              />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
    >
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LeftRailAsset({
  src,
  alt,
  className = "h-5 w-5",
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-contain`}
    />
  )
}

function LucyRailMark() {
  return (
    <img
      src="/images/stock/lucy-chat/lucy-rail/star.svg"
      alt="Lucy"
      className="h-6 w-6 object-contain"
    />
  )
}

type LucyAccountUser = {
  id?: string
  name?: string
  email?: string
  image?: string
  avatar_url?: string
  avatarUrl?: string
  picture?: string
}

type LucyAuthModalIntent =
  | "workspace"
  | "dashboard"

export default function LucyWorkspace() {
  const router = useRouter()
  const [accountUser, setAccountUser] = useState<LucyAccountUser | null>(null)
  const [accountPlanId, setAccountPlanId] = useState<string | null>(null)
  const normalizedAccountPlanId =
    accountPlanId?.toLowerCase() || ""

  const lucyTier: "free" | "pro" | "business" =
    normalizedAccountPlanId.includes("business") ||
      normalizedAccountPlanId.includes("enterprise")
      ? "business"
      : normalizedAccountPlanId.includes("pro")
        ? "pro"
        : "free"
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalIntent, setAuthModalIntent] =
    useState<LucyAuthModalIntent>("workspace")
  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const [openRailMenu, setOpenRailMenu] = useState<string | null>(null)
  const [lucyRailCollapsed, setLucyRailCollapsed] =
    useState(false)
  const [lucyConversations, setLucyConversations] =
    useState<LucyConversationSummary[]>([])

  const [requestedConversationId, setRequestedConversationId] =
    useState<string | null>(null)

  const [newConversationRequestKey, setNewConversationRequestKey] =
    useState(0)

  const [lucyEngineKey, setLucyEngineKey] =
    useState(0)

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null)

  const [conversationPendingDelete, setConversationPendingDelete] =
    useState<LucyConversationSummary | null>(null)

  const [conversationPendingRename, setConversationPendingRename] =
    useState<LucyConversationSummary | null>(null)

  const [conversationRenameValue, setConversationRenameValue] =
    useState("")

  const [homepageInitialPrompt, setHomepageInitialPrompt] =
    useState<string | null>(null)

  useEffect(() => {
    const sessionPrompt =
      sessionStorage
        .getItem(LUCY_HOMEPAGE_PROMPT_KEY)
        ?.trim() || ""

    const durablePrompt =
      localStorage
        .getItem(LUCY_HOMEPAGE_PROMPT_KEY)
        ?.trim() || ""

    const prompt =
      sessionPrompt || durablePrompt || null

    if (!prompt) return

    setHomepageInitialPrompt(prompt)

    sessionStorage.removeItem(
      LUCY_HOMEPAGE_PROMPT_KEY
    )
  }, [])

  useEffect(() => {
    let active = true

    async function loadAccountUser() {
      const token = getAuthToken()
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

      if (!token) {
        if (active) {
          setAccountUser(null)
          setAccountPlanId(null)
          setAuthModalIntent("workspace")
          setAuthModalOpen(true)
        }
        return
      }

      if (!apiBaseUrl) {
        if (active) {
          setAccountUser(null)
          setAccountPlanId(null)
        }
        return
      }

      try {
        const response = await fetch(`${apiBaseUrl}/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (active) {
            setAccountUser(null)
            setAccountPlanId(null)

            if (
              response.status === 401 ||
              response.status === 403
            ) {
              setAuthModalIntent("workspace")
              setAuthModalOpen(true)
            }
          }

          return
        }

        const data = await response.json()

        if (active) {
          setAccountUser(data.user ?? null)
          setAccountPlanId(data.subscription?.plan_id ?? null)
        }
      } catch {
        if (active) {
          setAccountUser(null)
          setAccountPlanId(null)
        }
      }
    }

    void loadAccountUser()

    const handleAuthChanged = () => {
      void loadAccountUser()
    }

    window.addEventListener(
      "skysirv-auth-changed",
      handleAuthChanged
    )

    return () => {
      active = false

      window.removeEventListener(
        "skysirv-auth-changed",
        handleAuthChanged
      )
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadLucyConversations() {
      const token = getAuthToken()
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || ""

      if (!token || !apiBaseUrl) {
        if (active) {
          setLucyConversations([])
        }
        return
      }

      try {
        const conversations =
          await getRecentLucyConversations({
            apiBaseUrl,
            token,
            limit: 50,
          })

        if (active) {
          setLucyConversations(conversations)
        }
      } catch (error) {
        console.error(
          "Unable to load Lucy rail conversations",
          error
        )

        if (active) {
          setLucyConversations([])
        }
      }
    }

    void loadLucyConversations()

    const handleAuthChanged = () => {
      void loadLucyConversations()
    }

    window.addEventListener(
      "skysirv-auth-changed",
      handleAuthChanged
    )

    return () => {
      active = false

      window.removeEventListener(
        "skysirv-auth-changed",
        handleAuthChanged
      )
    }
  }, [])

  async function handlePinLucyConversation(
    conversationId: string
  ) {
    const token = getAuthToken()
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!token || !apiBaseUrl) return

    try {
      const updatedConversation =
        await updateLucyConversation({
          apiBaseUrl,
          token,
          conversationId,
          pinned: true,
        })

      setLucyConversations((current) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation
        )
      )

      setOpenRailMenu(null)
    } catch (error) {
      console.error(
        "Unable to pin Lucy conversation",
        error
      )
    }
  }

  async function handleUnpinLucyConversation(
    conversationId: string
  ) {
    const token = getAuthToken()
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!token || !apiBaseUrl) return

    try {
      const updatedConversation =
        await updateLucyConversation({
          apiBaseUrl,
          token,
          conversationId,
          pinned: false,
        })

      setLucyConversations((current) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation
        )
      )

      setOpenRailMenu(null)
    } catch (error) {
      console.error(
        "Unable to unpin Lucy conversation",
        error
      )
    }
  }

  async function handleMoveLucyConversationToPlannedTrip(
    conversationId: string
  ) {
    const token = getAuthToken()
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!token || !apiBaseUrl) return

    try {
      const updatedConversation =
        await updateLucyConversation({
          apiBaseUrl,
          token,
          conversationId,
          plannedTrip: true,
        })

      setLucyConversations((current) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation
        )
      )

      setOpenRailMenu(null)
    } catch (error) {
      console.error(
        "Unable to move Lucy conversation to planned trips",
        error
      )
    }
  }

  function handleRequestRenameLucyConversation(
    conversationId: string
  ) {
    const conversation =
      lucyConversations.find(
        (item) => item.id === conversationId
      ) ?? null

    if (!conversation) return

    setOpenRailMenu(null)
    setConversationPendingRename(conversation)
    setConversationRenameValue(conversation.title)
  }

  async function handleConfirmRenameLucyConversation() {
    if (!conversationPendingRename) return

    const nextTitle = conversationRenameValue.trim()

    if (!nextTitle) return

    const token = getAuthToken()
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!token || !apiBaseUrl) return

    try {
      const updatedConversation =
        await updateLucyConversation({
          apiBaseUrl,
          token,
          conversationId:
            conversationPendingRename.id,
          title: nextTitle,
        })

      setLucyConversations((current) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation
        )
      )

      setConversationPendingRename(null)
      setConversationRenameValue("")
    } catch (error) {
      console.error(
        "Unable to rename Lucy conversation",
        error
      )
    }
  }

  function handleRequestDeleteLucyConversation(
    conversationId: string
  ) {
    const conversation =
      lucyConversations.find(
        (item) => item.id === conversationId
      ) ?? null

    setOpenRailMenu(null)
    setConversationPendingDelete(conversation)
  }

  async function handleConfirmDeleteLucyConversation() {
    if (!conversationPendingDelete) return

    const conversationId =
      conversationPendingDelete.id

    const token = getAuthToken()
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!token || !apiBaseUrl) return

    try {
      await deleteLucyConversation({
        apiBaseUrl,
        token,
        conversationId,
      })

      setLucyConversations((current) =>
        current.filter(
          (conversation) =>
            conversation.id !== conversationId
        )
      )

      setConversationPendingDelete(null)

      if (activeConversationId === conversationId) {
        window.location.reload()
      }
    } catch (error) {
      console.error(
        "Unable to delete Lucy conversation",
        error
      )
    }
  }

  async function getSkysirvDashboardPath() {
    const token = getAuthToken()
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!token || !apiBaseUrl) {
      return null
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      const planId =
        data.subscription?.plan_id?.toLowerCase() || ""

      setAccountUser(data.user ?? null)
      setAccountPlanId(data.subscription?.plan_id ?? null)

      if (
        planId.includes("business") ||
        planId.includes("enterprise")
      ) {
        return "/dashboard/business"
      }

      if (planId.includes("pro")) {
        return "/dashboard/pro"
      }

      return "/dashboard/free"
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (!accountMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [accountMenuOpen])

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white text-slate-900">
      <style jsx>{`
        .lucy-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.32) transparent;
        }
        .lucy-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .lucy-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .lucy-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.28);
          border-radius: 999px;
        }
        .lucy-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.45);
        }
        .lucy-workspace-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
        }
        .lucy-workspace-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .lucy-workspace-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .lucy-workspace-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 999px;
        }
        .lucy-workspace-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.45);
        }
      `}</style>
      {/* ------------------------------------------------------------------ */}
      {/* Far-left application rail                                           */}
      {/* ------------------------------------------------------------------ */}
      <aside className="flex w-[60px] shrink-0 flex-col items-center border-r border-slate-200 bg-white py-3">
        <RailIcon
          active
          ariaLabel="Home"
          onClick={() => router.push("/")}
        >
          <LeftRailAsset
            src="/images/stock/lucy-chat/left-rail/home.svg"
            alt="Home"
            className="h-6 w-6"
          />
        </RailIcon>
        <div className="mt-5 flex flex-col items-center gap-2">
          <RailIcon ariaLabel="Trips">
            <LeftRailAsset
              src="/images/stock/lucy-chat/left-rail/trips.svg"
              alt="Trips"
            />
          </RailIcon>
          <RailIcon ariaLabel="Saved">
            <LeftRailAsset
              src="/images/stock/lucy-chat/left-rail/saved.svg"
              alt="Saved"
            />
          </RailIcon>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <RailIcon ariaLabel="Help">
            <LeftRailAsset
              src="/images/stock/lucy-chat/left-rail/help.svg"
              alt="Help"
            />
          </RailIcon>
          <div ref={accountMenuRef} className="relative">
            <RailIcon
              ariaLabel="Account"
              onClick={() =>
                setAccountMenuOpen((current) => !current)
              }
            >
              <LeftRailAsset
                src="/images/stock/lucy-chat/left-rail/account.svg"
                alt="Account"
              />
            </RailIcon>

            {accountMenuOpen && (
              <div className="absolute bottom-0 left-[calc(100%+10px)] z-50 w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
                <div className="border-b border-slate-100 py-1">
                  <button
                    type="button"
                    onClick={async () => {
                      const token = getAuthToken()

                      setAccountMenuOpen(false)

                      if (!token) {
                        setAuthModalIntent("dashboard")
                        setAuthModalOpen(true)
                        return
                      }

                      const dashboardPath =
                        await getSkysirvDashboardPath()

                      if (!dashboardPath) {
                        setAuthModalIntent("dashboard")
                        setAuthModalOpen(true)
                        return
                      }

                      router.push(dashboardPath)
                    }}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-950 transition hover:bg-slate-100"
                  >
                    Skysirv dashboard
                  </button>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false)
                      router.push("/account")
                    }}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-950 transition hover:bg-slate-100"
                  >
                    Account settings
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-950 transition hover:bg-slate-100"
                  >
                    Chat settings
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  {getAuthToken() ? (
                    <button
                      type="button"
                      onClick={() => {
                        clearAuthSession()

                        setAccountUser(null)
                        setAccountPlanId(null)
                        setLucyConversations([])
                        setRequestedConversationId(null)
                        setActiveConversationId(null)
                        setAccountMenuOpen(false)

                        setLucyEngineKey((current) => current + 1)

                        setAuthModalIntent("workspace")
                        setAuthModalOpen(true)

                        window.dispatchEvent(
                          new Event("skysirv-auth-changed")
                        )
                      }}
                      className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false)
                        setAuthModalIntent("workspace")
                        setAuthModalOpen(true)
                      }}
                      className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm text-slate-950 transition hover:bg-slate-100"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
      {lucyRailCollapsed && (
        <button
          type="button"
          onClick={() => setLucyRailCollapsed(false)}
          aria-label="Expand Lucy sidebar"
          title="Expand Lucy sidebar"
          className="relative z-20 mt-3 flex h-10 w-6 shrink-0 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
        >
          <span className="rotate-180">
            <CollapseIcon />
          </span>
        </button>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* Lucy navigation rail                                                */}
      {/* ------------------------------------------------------------------ */}
      {!lucyRailCollapsed && (
        <aside className="flex w-[292px] shrink-0 flex-col border-r border-slate-200 bg-white">
          {/* Lucy rail header */}
          <div
            className={[
              "flex h-[68px] shrink-0 items-center border-b border-slate-200",
              lucyRailCollapsed
                ? "justify-center px-2"
                : "px-4",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center",
                lucyRailCollapsed
                  ? "justify-center"
                  : "min-w-0 flex-1 gap-3",
              ].join(" ")}
            >
              <LucyRailMark />

              {!lucyRailCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-[26px] font-semibold tracking-[-0.02em] text-slate-950">
                    Lucy
                  </p>
                </div>
              )}
            </div>

            {!lucyRailCollapsed && (
              <button
                type="button"
                aria-label="Search Lucy conversations"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-950 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <SearchIcon />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setLucyRailCollapsed((current) => !current)
              }
              aria-label={
                lucyRailCollapsed
                  ? "Expand Lucy sidebar"
                  : "Collapse Lucy sidebar"
              }
              className={
                lucyRailCollapsed
                  ? "ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-950 transition hover:bg-slate-100 hover:text-slate-700"
                  : "ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-950 transition hover:bg-slate-100 hover:text-slate-700"
              }
            >
              <CollapseIcon />
            </button>
          </div>
          {/* Scrollable navigation content */}
          <div
            className={[
              "lucy-scrollbar min-h-0 flex-1 overflow-y-auto pb-5",
              lucyRailCollapsed
                ? "px-2"
                : "px-3",
            ].join(" ")}
          >
            {/* New conversation */}
            <button
              type="button"
              onClick={() => {
                setOpenRailMenu(null)
                setRequestedConversationId(null)
                setNewConversationRequestKey((current) => current + 1)
              }}
              aria-label="New conversation"
              title="New conversation"
              className={[
                "mt-3 flex items-center rounded-lg text-sm font-medium text-slate-950 transition hover:bg-slate-100",
                lucyRailCollapsed
                  ? "h-10 w-full justify-center px-0"
                  : "w-full gap-3 px-3 py-2.5 text-left",
              ].join(" ")}
            >
              <img
                src="/images/stock/lucy-chat/lucy-rail/new-conversation.svg"
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0 object-contain"
              />

              {!lucyRailCollapsed && (
                <span>New conversation</span>
              )}
            </button>

            {!lucyRailCollapsed && (
              <>
                {/* Pinned conversations */}
                <SectionHeading>
                  Pinned conversations
                </SectionHeading>

                <div className="space-y-0.5">
                  {lucyConversations
                    .filter((conversation) => conversation.pinned)
                    .map((conversation) => (
                      <LucyRailItem
                        key={conversation.id}
                        label={conversation.title}
                        active={
                          activeConversationId === conversation.id
                        }
                        icon="/images/stock/lucy-chat/lucy-rail/pin.svg"
                        menuOpen={
                          openRailMenu === `pinned-${conversation.id}`
                        }
                        onMenuToggle={() =>
                          setOpenRailMenu((current) =>
                            current === `pinned-${conversation.id}`
                              ? null
                              : `pinned-${conversation.id}`
                          )
                        }
                        onClick={() => {
                          setOpenRailMenu(null)
                          setRequestedConversationId(
                            conversation.id
                          )
                        }}
                        onPinAction={() =>
                          void handleUnpinLucyConversation(
                            conversation.id
                          )
                        }
                        onRenameAction={() =>
                          handleRequestRenameLucyConversation(
                            conversation.id
                          )
                        }
                        onDeleteAction={() =>
                          handleRequestDeleteLucyConversation(
                            conversation.id
                          )
                        }
                      />
                    ))}
                </div>

                {/* Planned trips */}
                <SectionHeading>
                  Planned trips
                </SectionHeading>

                <div className="space-y-0.5">
                  {lucyConversations
                    .filter(
                      (conversation) =>
                        conversation.plannedTrip
                    )
                    .map((conversation) => (
                      <LucyRailItem
                        key={conversation.id}
                        label={conversation.title}
                        active={
                          activeConversationId === conversation.id
                        }
                        icon="/images/stock/lucy-chat/lucy-rail/planned-trip.svg"
                        menuOpen={
                          openRailMenu === `planned-${conversation.id}`
                        }
                        onMenuToggle={() =>
                          setOpenRailMenu((current) =>
                            current === `planned-${conversation.id}`
                              ? null
                              : `planned-${conversation.id}`
                          )
                        }
                        onClick={() => {
                          setOpenRailMenu(null)
                          setRequestedConversationId(
                            conversation.id
                          )
                        }}
                        onPinAction={() =>
                          conversation.pinned
                            ? void handleUnpinLucyConversation(
                              conversation.id
                            )
                            : void handlePinLucyConversation(
                              conversation.id
                            )
                        }
                        pinActionLabel={
                          conversation.pinned
                            ? "Unpin"
                            : "Pin"
                        }
                        onRenameAction={() =>
                          handleRequestRenameLucyConversation(
                            conversation.id
                          )
                        }
                        onDeleteAction={() =>
                          handleRequestDeleteLucyConversation(
                            conversation.id
                          )
                        }
                      />
                    ))}
                </div>

                {/* Recent conversations */}
                <SectionHeading>
                  Recent conversations
                </SectionHeading>

                <div className="space-y-0.5">
                  {lucyConversations
                    .filter(
                      (conversation) =>
                        !conversation.pinned &&
                        !conversation.plannedTrip
                    )
                    .map((conversation) => (
                      <LucyRailItem
                        key={conversation.id}
                        label={conversation.title}
                        active={
                          activeConversationId === conversation.id
                        }
                        menuOpen={
                          openRailMenu === `recent-${conversation.id}`
                        }
                        onMenuToggle={() =>
                          setOpenRailMenu((current) =>
                            current === `recent-${conversation.id}`
                              ? null
                              : `recent-${conversation.id}`
                          )
                        }
                        onClick={() => {
                          setOpenRailMenu(null)
                          setRequestedConversationId(
                            conversation.id
                          )
                        }}
                        onPinAction={() =>
                          void handlePinLucyConversation(
                            conversation.id
                          )
                        }
                        onMoveToPlannedTrip={() =>
                          void handleMoveLucyConversationToPlannedTrip(
                            conversation.id
                          )
                        }
                        showMoveToPlannedTrip
                        onRenameAction={() =>
                          handleRequestRenameLucyConversation(
                            conversation.id
                          )
                        }
                        onDeleteAction={() =>
                          handleRequestDeleteLucyConversation(
                            conversation.id
                          )
                        }
                        pinActionLabel="Pin"
                      />
                    ))}
                </div>
              </>
            )}

          </div>
        </aside>
      )}
      {/* ------------------------------------------------------------------ */}
      {/* Main Lucy conversation workspace                                    */}
      {/* ------------------------------------------------------------------ */}
      <main className="min-w-0 flex-1 bg-white">
        <DashboardFlightAttendant
          key={lucyEngineKey}
          tier={lucyTier}
          placement="workspace"
          defaultOpen
          dashboardRoutes={[]}
          requestedConversationId={requestedConversationId}
          newConversationRequestKey={newConversationRequestKey}
          initialPrompt={homepageInitialPrompt}
          onActiveConversationChange={setActiveConversationId}
          onConversationCreated={(conversation) => {
            setLucyConversations((current) => [
              conversation,
              ...current.filter(
                (item) => item.id !== conversation.id
              ),
            ])

            setActiveConversationId(conversation.id)
          }}
          onConversationUpdated={(conversation) => {
            setLucyConversations((current) =>
              current.map((item) =>
                item.id === conversation.id
                  ? conversation
                  : item
              )
            )

            const homepagePrompt =
              homepageInitialPrompt?.trim()

            if (
              homepagePrompt &&
              conversation.title ===
              homepagePrompt.slice(0, 80)
            ) {
              sessionStorage.removeItem(
                LUCY_HOMEPAGE_PROMPT_KEY
              )

              localStorage.removeItem(
                LUCY_HOMEPAGE_PROMPT_KEY
              )

              setHomepageInitialPrompt(null)
            }
          }}
        />
      </main>

      {conversationPendingRename && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-950">
              Rename conversation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose a new name for this Lucy conversation.
            </p>

            <input
              type="text"
              value={conversationRenameValue}
              onChange={(event) =>
                setConversationRenameValue(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleConfirmRenameLucyConversation()
                }
              }}
              autoFocus
              className="mt-5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-500"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setConversationPendingRename(null)
                  setConversationRenameValue("")
                }}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleConfirmRenameLucyConversation()
                }
                disabled={!conversationRenameValue.trim()}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {conversationPendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-950">
              Delete conversation?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will remove
              {" "}
              <span className="font-medium text-slate-900">
                {conversationPendingDelete.title}
              </span>
              {" "}
              from your Lucy conversations.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setConversationPendingDelete(null)
                }
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleConfirmDeleteLucyConversation()
                }
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        maxWidthClassName="max-w-sm"
        disableBackdropClose={false}
        heroImageSrc="/images/stock/onboarding-hero.jpg"
        heroImageAlt="Ready for adventure"
      >
        <AuthPanel
          onSigninComplete={async () => {
            setAuthModalOpen(false)

            if (authModalIntent === "dashboard") {
              const dashboardPath =
                await getSkysirvDashboardPath()

              if (dashboardPath) {
                router.push(dashboardPath)
              }

              return
            }

            setLucyEngineKey((current) => current + 1)

            window.dispatchEvent(
              new Event("skysirv-auth-changed")
            )
          }}
          onSignupComplete={() => {
            setAuthModalOpen(false)
          }}
        />
      </AuthModal>

    </div>
  )
}
