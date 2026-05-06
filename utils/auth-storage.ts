export const AUTH_TOKEN_KEY = "skysirv_token"
export const AUTH_ADMIN_KEY = "skysirv_admin"
export const AUTH_LAST_ACTIVITY_KEY = "skysirv_last_activity"

export const AUTH_SESSION_TIMEOUT_MS = 30 * 60 * 1000

export function getAuthToken() {
  if (typeof window === "undefined") return null

  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  touchAuthActivity()
}

export function removeAuthToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAuthAdmin() {
  if (typeof window === "undefined") return null

  return sessionStorage.getItem(AUTH_ADMIN_KEY)
}

export function setAuthAdmin(isAdmin: boolean) {
  if (isAdmin) {
    sessionStorage.setItem(AUTH_ADMIN_KEY, "true")
  } else {
    sessionStorage.removeItem(AUTH_ADMIN_KEY)
  }
}

export function touchAuthActivity() {
  sessionStorage.setItem(AUTH_LAST_ACTIVITY_KEY, String(Date.now()))
}

export function isAuthSessionExpired() {
  if (typeof window === "undefined") return false

  const lastActivity = Number(sessionStorage.getItem(AUTH_LAST_ACTIVITY_KEY))

  if (!lastActivity) return false

  return Date.now() - lastActivity > AUTH_SESSION_TIMEOUT_MS
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_ADMIN_KEY)
  sessionStorage.removeItem(AUTH_LAST_ACTIVITY_KEY)

  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_ADMIN_KEY)
  localStorage.removeItem(AUTH_LAST_ACTIVITY_KEY)
}

export function expireAuthSession() {
  clearAuthSession()

  if (typeof window !== "undefined") {
    window.location.href = "/"
  }
}