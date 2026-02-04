import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { useApi } from '@/composables'
import { ERROR_TIMEOUT_MS, STORAGE_KEYS, MESSAGES } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()

  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  let errorTimer: ReturnType<typeof setTimeout> | null = null

  const isAuthenticated = computed(() => user.value !== null)

  function setError(message: string) {
    if (errorTimer) {
      clearTimeout(errorTimer)
    }
    error.value = message
    errorTimer = setTimeout(() => {
      error.value = null
      errorTimer = null
    }, ERROR_TIMEOUT_MS)
  }

  function clearError() {
    if (errorTimer) {
      clearTimeout(errorTimer)
      errorTimer = null
    }
    error.value = null
  }

  async function login(username: string, phone: string): Promise<boolean> {
    isLoading.value = true
    clearError()

    try {
      const users = await api.fetchUsers()

      const foundUser = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.phone === phone,
      )

      if (foundUser) {
        user.value = foundUser
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser))
        return true
      } else {
        setError(MESSAGES.LOGIN_ERROR)
        return false
      }
    } catch {
      setError(MESSAGES.SERVER_ERROR)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    sessionStorage.removeItem(STORAGE_KEYS.USER)
  }

  function restoreSession() {
    const savedUser = sessionStorage.getItem(STORAGE_KEYS.USER)
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        sessionStorage.removeItem(STORAGE_KEYS.USER)
      }
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    restoreSession,
  }
})
