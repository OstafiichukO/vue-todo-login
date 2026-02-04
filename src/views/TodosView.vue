<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodosStore } from '@/stores/todos'
import type { StatusFilter } from '@/types'

const authStore = useAuthStore()
const todosStore = useTodosStore()

// Create todo form
const newTodoUserId = ref('')
const newTodoTitle = ref('')
const isCreating = ref(false)

onMounted(() => {
  if (authStore.user) {
    todosStore.loadFavorites(authStore.user.id)
  }
  todosStore.fetchTodos()
})

function handleStatusFilter(event: Event) {
  const target = event.target as HTMLSelectElement
  todosStore.setStatusFilter(target.value as StatusFilter)
}

function handleUserIdFilter(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  todosStore.setUserIdFilter(value === 'all' ? null : Number(value))
}

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  todosStore.setSearchQuery(target.value)
}

async function handleCreateTodo() {
  if (!newTodoUserId.value || !newTodoTitle.value.trim()) return

  isCreating.value = true
  const success = await todosStore.createTodo(Number(newTodoUserId.value), newTodoTitle.value.trim())

  if (success) {
    newTodoUserId.value = ''
    newTodoTitle.value = ''
  }
  isCreating.value = false
}
</script>

<template>
  <div class="todos-page">
    <!-- Header with user info -->
    <header class="header">
      <div class="header-content">
        <div class="user-info" v-if="authStore.user">
          <div class="user-avatar">{{ authStore.user.name.charAt(0) }}</div>
          <div class="user-details">
            <h2 class="user-name">{{ authStore.user.name }}</h2>
            <p class="user-meta">
              <span><strong>Username:</strong> @{{ authStore.user.username }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Email:</strong> {{ authStore.user.email }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Phone:</strong> {{ authStore.user.phone }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Website:</strong> {{ authStore.user.website }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Address:</strong> {{ authStore.user.address.street }}, {{ authStore.user.address.suite }},
                {{ authStore.user.address.city }}, {{ authStore.user.address.zipcode }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Geo:</strong> {{ authStore.user.address.geo.lat }}, {{ authStore.user.address.geo.lng
              }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Company:</strong> {{ authStore.user.company.name }}</span>
            </p>
            <p class="user-meta">
              <span><strong>Catch Phrase:</strong> {{ authStore.user.company.catchPhrase }}</span>
            </p>
            <p class="user-meta">
              <span><strong>BS:</strong> {{ authStore.user.company.bs }}</span>
            </p>
          </div>
        </div>
        <button @click="authStore.logout()" class="logout-button">
          Logout
        </button>
      </div>
    </header>

    <main class="main-content">
      <!-- Create Todo Section -->
      <section class="create-section">
        <h3 class="section-title">Create Todo</h3>
        <form @submit.prevent="handleCreateTodo" class="create-form">
          <input v-model="newTodoUserId" type="number" placeholder="User ID" class="create-input user-id-input"
            min="1" />
          <input v-model="newTodoTitle" type="text" placeholder="Todo title" class="create-input title-input" />
          <button type="submit" class="add-button" :disabled="!newTodoUserId || !newTodoTitle.trim() || isCreating">
            {{ isCreating ? 'Adding...' : 'Add' }}
          </button>
        </form>
      </section>

      <!-- Filters Section -->
      <section class="filters-section">
        <div class="filters-row">
          <div class="filter-group">
            <label>Status:</label>
            <select :value="todosStore.statusFilter" @change="handleStatusFilter" class="filter-select">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="uncompleted">Uncompleted</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>

          <div class="filter-group">
            <label>User ID:</label>
            <select :value="todosStore.userIdFilter ?? 'all'" @change="handleUserIdFilter" class="filter-select">
              <option value="all">All Users</option>
              <option v-for="id in todosStore.userIds" :key="id" :value="id">
                {{ id }}
              </option>
            </select>
          </div>

          <div class="filter-group search-group">
            <label>Search:</label>
            <input type="text" :value="todosStore.searchQuery" @input="handleSearch" placeholder="Search by title..."
              class="search-input" />
          </div>
        </div>
      </section>

      <!-- Todos List -->
      <section class="todos-section">
        <div class="todos-header">
          <h3 class="section-title">
            Todos
            <span class="todos-count">({{ todosStore.filteredTodos.length }})</span>
          </h3>
        </div>

        <div v-if="todosStore.isLoading" class="loading">
          Loading todos...
        </div>

        <div v-else-if="todosStore.error" class="error">
          {{ todosStore.error }}
        </div>

        <div v-else-if="todosStore.filteredTodos.length === 0" class="empty">
          No todos found
        </div>

        <ul v-else class="todos-list">
          <li v-for="todo in todosStore.filteredTodos" :key="todo.id" class="todo-item"
            :class="{ completed: todo.completed }">
            <div class="todo-status">
              <span class="status-icon" :class="{ done: todo.completed }">
                {{ todo.completed ? '✓' : '○' }}
              </span>
            </div>
            <div class="todo-content">
              <p class="todo-title">{{ todo.title }}</p>
              <div class="todo-meta">
                <span class="todo-id">#{{ todo.id }}</span>
                <span class="todo-user">User {{ todo.userId }}</span>
              </div>
            </div>
            <button @click="todosStore.toggleFavorite(todo.id)" class="favorite-button"
              :class="{ active: todosStore.isFavorite(todo.id) }"
              :title="todosStore.isFavorite(todo.id) ? 'Remove from favorites' : 'Add to favorites'">
              {{ todosStore.isFavorite(todo.id) ? '★' : '☆' }}
            </button>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
