import { ref } from 'vue'

const DEV_KEY = 'welding-dev-mode'

const isDevMode = ref<boolean>(
  new URLSearchParams(window.location.search).get('dev') === 'true' ||
  localStorage.getItem(DEV_KEY) === 'true',
)

if (isDevMode.value) {
  localStorage.setItem(DEV_KEY, 'true')
}

export function useDevMode() {
  return { isDevMode }
}
