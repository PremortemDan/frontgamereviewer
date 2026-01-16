<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <!-- Back Link -->
        <div class="mb-3">
          <RouterLink to="/" class="btn btn-link text-decoration-none">
            <i class="fas fa-arrow-left"></i> Volver al inicio
          </RouterLink>
        </div>

        <!-- Login Card -->
        <div class="card shadow-lg">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">
              <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            </h2>

            <!-- Alert Messages -->
            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ errorMessage }}
              <button type="button" class="btn-close" @click="errorMessage = ''"></button>
            </div>

            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = ''"></button>
            </div>

            <form @submit.prevent="submitLogin">
              <!-- Username Input -->
              <div class="form-floating mb-3">
                <input v-model="form.username" type="text" class="form-control" 
                       id="loginUsername" placeholder="Usuario" required
                       :disabled="loading">
                <label for="loginUsername">Usuario</label>
              </div>

              <!-- Password Input -->
              <div class="form-floating mb-3">
                <input v-model="form.password" type="password" class="form-control" 
                       id="loginPassword" placeholder="Contraseña" required
                       :disabled="loading">
                <label for="loginPassword">Contraseña</label>
              </div>

              <!-- Remember Me Checkbox -->
              <div class="form-check mb-3">
                <input v-model="form.rememberMe" class="form-check-input" type="checkbox" 
                       id="rememberMe" :disabled="loading">
                <label class="form-check-label" for="rememberMe">
                  Recuérdame
                </label>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
                <span v-if="loading">
                  <span class="spinner-border spinner-border-sm me-2"></span> Iniciando sesión...
                </span>
                <span v-else>
                  <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                </span>
              </button>
            </form>

            <!-- Divider -->
            <div class="text-center mb-3">
              <span class="text-muted">¿No tienes cuenta?</span>
            </div>

            <!-- Register Link -->
            <RouterLink to="/register" class="btn btn-outline-primary w-100">
              <i class="bi bi-person-plus"></i> Crear Cuenta
            </RouterLink>
          </div>
        </div>

        <!-- Footer Text -->
        <p class="text-center text-muted mt-4 small">
          <i class="bi bi-shield-lock"></i> Tus datos están seguros
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthAPI } from '../composables/useApi'

const router = useRouter()
const authAPI = useAuthAPI()

const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitLogin = async () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authAPI.login(form.value.username, form.value.password)
    
    if (response && (response.token || response.success)) {
      if (response.token) {
        localStorage.setItem('token', response.token)
      }
      
      if (form.value.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('lastUsername', form.value.username)
      }
      
      successMessage.value = '¡Sesión iniciada correctamente!'
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión. Intenta de nuevo.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
}

.card-body {
  background: var(--bg-card);
  color: var(--text-primary);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.form-floating > label {
  color: var(--text-secondary);
}

.form-control {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.form-control:focus {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.form-check-label {
  color: var(--text-primary);
}

.btn-link {
  color: var(--color-primary);
}
</style>
