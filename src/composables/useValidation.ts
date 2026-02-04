import { computed, type Ref } from 'vue'
import { VALIDATION, MESSAGES } from '@/constants'

export function useValidation(username: Ref<string>, phone: Ref<string>) {
  const usernameError = computed(() => {
    if (!username.value) return ''
    if (!VALIDATION.USERNAME_PATTERN.test(username.value)) {
      return MESSAGES.VALIDATION.USERNAME_LETTERS_ONLY
    }
    return ''
  })

  const phoneError = computed(() => {
    if (!phone.value) return ''
    if (!VALIDATION.PHONE_PATTERN.test(phone.value)) {
      return MESSAGES.VALIDATION.PHONE_INVALID
    }
    return ''
  })

  const isFormValid = computed(() => {
    return (
      username.value.trim() !== '' &&
      phone.value.trim() !== '' &&
      !usernameError.value &&
      !phoneError.value
    )
  })

  // Filter input to only allow letters
  function filterUsername(value: string): string {
    return value.replace(/[^a-zA-Z]/g, '')
  }

  // Filter input to only allow numbers and symbols
  function filterPhone(value: string): string {
    return value.replace(/[^0-9\s\-+().x]/g, '')
  }

  return {
    usernameError,
    phoneError,
    isFormValid,
    filterUsername,
    filterPhone,
  }
}
