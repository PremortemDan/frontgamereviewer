import { ref } from 'vue'

export const useColorblindMode = () => {
  const isColorblindMode = ref(localStorage.getItem('colorblindMode') === 'true')

  const toggleColorblindMode = () => {
    isColorblindMode.value = !isColorblindMode.value
    localStorage.setItem('colorblindMode', isColorblindMode.value)
    
    if (isColorblindMode.value) {
      document.body.classList.add('colorblind-mode')
    } else {
      document.body.classList.remove('colorblind-mode')
    }
  }

  const initColorblindMode = () => {
    if (isColorblindMode.value) {
      document.body.classList.add('colorblind-mode')
    }
  }

  return {
    isColorblindMode,
    toggleColorblindMode,
    initColorblindMode
  }
}
