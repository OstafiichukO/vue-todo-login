// API
export const API_URL = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com'

export const API_ENDPOINTS = {
  USERS: '/users',
  TODOS: '/todos',
} as const

// Timeouts
export const ERROR_TIMEOUT_MS = 5000

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  FAVORITES_PREFIX: 'favorites_user_',
} as const

// Validation
export const VALIDATION = {
  USERNAME_PATTERN: /^[a-zA-Z]+$/,
  PHONE_PATTERN: /^[\d\s\-+().x]+$/,
} as const

// Messages
export const MESSAGES = {
  LOGIN_ERROR: 'Login error: Username or phone number is incorrect',
  SERVER_ERROR: 'Login error: Failed to connect to server',
  FETCH_TODOS_ERROR: 'Failed to fetch todos',
  CREATE_TODO_ERROR: 'Failed to create todo',
  VALIDATION: {
    USERNAME_LETTERS_ONLY: 'Username must contain only letters',
    PHONE_INVALID: 'Phone must contain only numbers and symbols (-, +, (), x)',
  },
} as const
