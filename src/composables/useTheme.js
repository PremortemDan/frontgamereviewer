import { ref, computed } from 'vue'

export const useTheme = () => {
  const theme = ref('auto')

  const initTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    if (newTheme === 'auto') {
      initTheme()
    } else {
      document.documentElement.setAttribute('data-bs-theme', newTheme)
    }
    localStorage.setItem('theme', newTheme)
  }

  const getTheme = () => {
    return localStorage.getItem('theme') || 'auto'
  }

  return {
    theme: computed(() => theme.value),
    initTheme,
    setTheme,
    getTheme
  }
}
