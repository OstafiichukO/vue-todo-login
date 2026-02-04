import { API_URL, API_ENDPOINTS } from '@/constants'
import type { User, Todo } from '@/types'

export function useApi() {
  async function fetchUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.USERS}`)
    return response.json()
  }

  async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.TODOS}`)
    return response.json()
  }

  async function createTodo(userId: number, title: string): Promise<Todo> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.TODOS}`, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        title,
        completed: false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    return response.json()
  }

  return {
    fetchUsers,
    fetchTodos,
    createTodo,
  }
}
