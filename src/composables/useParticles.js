import { onMounted, onUnmounted } from 'vue'
import { tsParticles } from 'tsparticles-engine'
import { loadSlim } from 'tsparticles-slim'

export const useParticles = () => {
  const initParticles = async () => {
    const container = document.getElementById('tsparticles')
    if (!container) return

    try {
      await loadSlim(tsParticles)
      
      await tsParticles.load('tsparticles', {
        background: {
          color: {
            value: 'transparent'
          }
        },
        fullScreen: {
          enable: false
        },
        particles: {
          color: {
            value: '#ffffff'
          },
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800
            }
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: 'circle'
          },
          size: {
            value: { min: 1, max: 3 }
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            bounce: false,
            outModes: {
              default: 'bounce'
            }
          }
        }
      })
    } catch (error) {
      console.error('Error initializing particles:', error)
    }
  }

  return { initParticles }
}
