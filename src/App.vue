<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodosStore } from '@/stores/todos'

const router = useRouter()
const authStore = useAuthStore()
const todosStore = useTodosStore()

// Watch for logout
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      todosStore.clearFavorites()
      router.push('/')
    }
  },
)
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="app-header__content">
        <!-- Header content -->
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="app-footer__content">
        <!-- Footer content -->
      </div>
    </footer>
  </div>
</template>
