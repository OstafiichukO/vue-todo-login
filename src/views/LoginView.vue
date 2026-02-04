<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useValidation } from '@/composables'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const phone = ref('')

const { usernameError, phoneError, isFormValid, filterUsername, filterPhone } = useValidation(username, phone)

function handleUsernameInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = filterUsername(target.value)
  username.value = value
  target.value = value
}

function handlePhoneInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = filterPhone(target.value)
  phone.value = value
  target.value = value
}

async function handleLogin() {
  if (!isFormValid.value) return

  const success = await authStore.login(username.value, phone.value)
  if (success) {
    router.push('/todos')
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-card-header">
          <h1 class="login-title">Login</h1>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-description">description</div>
          <div class="form-groups">
            <div class="form-group">
              <label for="username" class="visually-hidden">Username</label>
              <input id="username" type="text" :value="username" @input="handleUsernameInput" placeholder="Username"
                class="form-input" :class="{ error: usernameError }" autocomplete="username" />
              <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
            </div>

            <div class="form-group">
              <label for="phone" class="visually-hidden">Phone number</label>
              <input id="phone" type="text" :value="phone" @input="handlePhoneInput" placeholder="Phone Number"
                class="form-input" :class="{ error: phoneError }" autocomplete="tel" />
              <span v-if="phoneError" class="error-message">{{ phoneError }}</span>
            </div>
          </div>

          <button type="submit" class="login-button" :disabled="!isFormValid || authStore.isLoading">
            <span v-if="authStore.isLoading">Loading...</span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>

      <div v-if="authStore.error" class="login-error">
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>
