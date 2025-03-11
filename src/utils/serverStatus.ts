import { setServerStatus } from "./localStorage"

const API_URL = "http://localhost:3001"

// Check if the server is online
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(3000),
    })

    if (response.ok) {
      const data = await response.json()
      const isOnline = data && data.status === "up"
      setServerStatus(isOnline)
      return isOnline
    }

    setServerStatus(false)
    return false
  } catch {
    setServerStatus(false)
    return false
  }
}

// Wrapper for API calls with local storage fallback
export const withFallback = async <T>(
  apiCall: () => Promise<T>,
  fallbackCall: () => T,
  saveToLocalStorage?: (data: T) => void
): Promise<T> => {
  try {
    // Try the API call first
    const data = await apiCall()

    // If successful, optionally save to localStorage for future offline use
    if (saveToLocalStorage) {
      saveToLocalStorage(data)
    }

    // Update server status
    setServerStatus(true)

    return data
  } catch {
    // If API call fails, use local storage fallback
    setServerStatus(false)
    return fallbackCall()
  }
}

// Wrapper for API mutations with local storage fallback
export const withMutationFallback = async <T>(
  apiCall: () => Promise<T>,
  fallbackCall: () => T,
  onSuccess?: (data: T) => void
): Promise<T> => {
  try {
    // Try the API call first
    const data = await apiCall()

    // If successful, update server status
    setServerStatus(true)

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(data)
    }

    return data
  } catch {
    // If API call fails, use local storage fallback
    setServerStatus(false)
    const result = fallbackCall()

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess(result)
    }

    return result
  }
}
