import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, StatusFilter } from '@/types'
import { useApi, useFavorites } from '@/composables'
import { MESSAGES } from '@/constants'

export const useTodosStore = defineStore('todos', () => {
  const api = useApi()
  const favoritesComposable = useFavorites()

  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const statusFilter = ref<StatusFilter>('all')
  const userIdFilter = ref<number | null>(null)
  const searchQuery = ref('')

  // Re-export favorites
  const { favorites, loadFavorites, clearFavorites, toggleFavorite, isFavorite } = favoritesComposable

  // Get unique user IDs from todos
  const userIds = computed(() => {
    const ids = [...new Set(todos.value.map((t) => t.userId))]
    return ids.sort((a, b) => a - b)
  })

  // Filtered todos
  const filteredTodos = computed(() => {
    let result = [...todos.value]

    // Filter by status
    if (statusFilter.value === 'completed') {
      result = result.filter((t) => t.completed)
    } else if (statusFilter.value === 'uncompleted') {
      result = result.filter((t) => !t.completed)
    } else if (statusFilter.value === 'favorites') {
      result = result.filter((t) => favorites.value.includes(t.id))
    }

    // Filter by user ID
    if (userIdFilter.value !== null) {
      result = result.filter((t) => t.userId === userIdFilter.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter((t) => t.title.toLowerCase().includes(query))
    }

    return result
  })

  // Fetch todos from API
  async function fetchTodos() {
    isLoading.value = true
    error.value = null

    try {
      todos.value = await api.fetchTodos()
    } catch {
      error.value = MESSAGES.FETCH_TODOS_ERROR
    } finally {
      isLoading.value = false
    }
  }

  // Create new todo
  async function createTodo(userId: number, title: string): Promise<boolean> {
    try {
      const newTodo = await api.createTodo(userId, title)
      // API returns id: 201, but we need unique id for our list
      newTodo.id = Math.max(...todos.value.map((t) => t.id), 0) + 1
      todos.value.unshift(newTodo)
      return true
    } catch {
      error.value = MESSAGES.CREATE_TODO_ERROR
      return false
    }
  }

  // Set filters
  function setStatusFilter(filter: StatusFilter) {
    statusFilter.value = filter
  }

  function setUserIdFilter(userId: number | null) {
    userIdFilter.value = userId
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    todos,
    isLoading,
    error,
    statusFilter,
    userIdFilter,
    searchQuery,
    favorites,
    userIds,
    filteredTodos,
    loadFavorites,
    clearFavorites,
    toggleFavorite,
    isFavorite,
    fetchTodos,
    createTodo,
    setStatusFilter,
    setUserIdFilter,
    setSearchQuery,
  }
})
