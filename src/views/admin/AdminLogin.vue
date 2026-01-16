<template>
  <div class="admin-login-container">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <!-- Admin Login Card -->
          <div class="card shadow-lg admin-card">
            <div class="card-body p-4">
              <div class="text-center mb-4">
                <h1 class="admin-title">
                  <i class="fas fa-shield-alt"></i> ADMIN
                </h1>
                <p class="text-muted">Panel Administrativo</p>
              </div>

              <!-- Alert Messages -->
              <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
              </div>

              <form @submit.prevent="submitLogin">
                <!-- Username Input -->
                <div class="form-floating mb-3">
                  <input v-model="form.username" type="text" class="form-control" 
                         id="adminUsername" placeholder="Usuario Admin" required
                         :disabled="loading">
                  <label for="adminUsername">Usuario</label>
                </div>

                <!-- Password Input -->
                <div class="form-floating mb-3">
                  <input v-model="form.password" type="password" class="form-control" 
                         id="adminPassword" placeholder="Contraseña" required
                         :disabled="loading">
                  <label for="adminPassword">Contraseña</label>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-danger w-100 mb-3" :disabled="loading">
                  <span v-if="loading">
                    <span class="spinner-border spinner-border-sm me-2"></span> Verificando...
                  </span>
                  <span v-else>
                    <i class="fas fa-sign-in-alt"></i> Acceder Admin
                  </span>
                </button>
              </form>

              <!-- Return Link -->
              <div class="text-center">
                <RouterLink to="/" class="btn btn-link btn-sm">
                  <i class="fas fa-arrow-left"></i> Volver al inicio
                </RouterLink>
              </div>

              <!-- Security Notice -->
              <p class="text-center text-muted mt-4 small">
                <i class="fas fa-lock"></i> Área restringida - Solo administradores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const submitLogin = async () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Simple admin auth (demo)
    if (form.value.username === 'admin' && form.value.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-token-' + Date.now())
      router.push('/admin')
    } else {
      errorMessage.value = 'Credenciales de admin inválidas'
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-container {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.admin-card {
  border: none;
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
}

.admin-card .card-body {
  background: var(--bg-card);
  color: var(--text-primary);
}

.admin-title {
  color: #dc3545;
  font-weight: 700;
  font-size: 2.5rem;
  margin: 0;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
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
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.btn-link {
  color: var(--color-primary);
}
</style>
