export const AUTH_TOKEN_KEY = "skysirv_token"
export const AUTH_ADMIN_KEY = "skysirv_admin"
export const AUTH_LAST_ACTIVITY_KEY = "skysirv_last_activity"

export function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token: string) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAuthAdmin() {
  return sessionStorage.getItem(AUTH_ADMIN_KEY)
}

export function setAuthAdmin(isAdmin: boolean) {
  if (isAdmin) {
    sessionStorage.setItem(AUTH_ADMIN_KEY, "true")
  } else {
    sessionStorage.removeItem(AUTH_ADMIN_KEY)
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_ADMIN_KEY)
  sessionStorage.removeItem(AUTH_LAST_ACTIVITY_KEY)

  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_ADMIN_KEY)
  localStorage.removeItem(AUTH_LAST_ACTIVITY_KEY)
}