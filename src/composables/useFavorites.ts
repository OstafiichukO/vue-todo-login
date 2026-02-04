import { ref } from 'vue'
import { STORAGE_KEYS } from '@/constants'

export function useFavorites() {
  const favorites = ref<number[]>([])
  let currentUserId: number | null = null

  function getFavoritesKey(userId: number): string {
    return `${STORAGE_KEYS.FAVORITES_PREFIX}${userId}`
  }

  function loadFavorites(userId: number) {
    currentUserId = userId
    const key = getFavoritesKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        favorites.value = JSON.parse(saved)
      } catch {
        localStorage.removeItem(key)
        favorites.value = []
      }
    } else {
      favorites.value = []
    }
  }

  function saveFavorites() {
    if (currentUserId !== null) {
      const key = getFavoritesKey(currentUserId)
      localStorage.setItem(key, JSON.stringify(favorites.value))
    }
  }

  function clearFavorites() {
    favorites.value = []
    currentUserId = null
  }

  function toggleFavorite(todoId: number) {
    const index = favorites.value.indexOf(todoId)
    if (index === -1) {
      favorites.value.push(todoId)
    } else {
      favorites.value.splice(index, 1)
    }
    saveFavorites()
  }

  function isFavorite(todoId: number): boolean {
    return favorites.value.includes(todoId)
  }

  return {
    favorites,
    loadFavorites,
    saveFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
  }
}
