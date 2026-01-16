<template>
  <div id="app-layout">
    <!-- Contenedor de partículas de fondo -->
    <div id="tsparticles" class="particles-container"></div>

    <!-- Header con Bootstrap Navbar -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
          <RouterLink to="/" class="navbar-brand">
            <i class="bi bi-star-fill"></i> GAMEREVIEWER
          </RouterLink>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                  data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <RouterLink to="/" class="nav-link" active-class="active">
                  <i class="bi bi-house"></i> Inicio
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/login" class="nav-link" active-class="active">
                  <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/register" class="nav-link" active-class="active">
                  <i class="bi bi-person-plus"></i> Registrarse
                </RouterLink>
              </li>
              <li class="nav-item">
                <button @click="toggleColorblindMode" class="btn btn-outline-secondary btn-sm ms-2"
                        :title="isColorblindMode ? 'Desactivar modo daltónico' : 'Activar modo daltónico'">
                  <i class="bi bi-eye"></i>
                </button>
              </li>
              <li class="nav-item">
                <button @click="toggleTheme" class="btn btn-outline-secondary btn-sm ms-2"
                        title="Cambiar tema">
                  <i class="bi" :class="theme === 'dark' ? 'bi-sun' : 'bi-moon'"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-0">© 2025 GAMEREVIEWER - Plataforma de Reseñas de Videojuegos. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useColorblindMode } from '../composables/useColorblindMode'

const { theme, initTheme, setTheme } = useTheme()
const { isColorblindMode, toggleColorblindMode: toggle, initColorblindMode } = useColorblindMode()

onMounted(() => {
  initTheme()
  initColorblindMode()
})

const toggleTheme = () => {
  const newTheme = theme.value === 'dark' ? 'light' : 'dark'
  setTheme(newTheme)
}

const toggleColorblindMode = () => {
  toggle()
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px 0;
}

.navbar-brand {
  font-weight: 800;
  font-size: 1.6rem;
  letter-spacing: 1px;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.navbar-brand i {
  font-size: 1.8rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin: 0 8px;
  padding: 8px 12px !important;
  border-radius: 6px;
}

.nav-link:hover,
.nav-link.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-link.active {
  border-bottom: 3px solid white;
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.5);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
}

.btn-outline-secondary {
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: white !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.main-content {
  min-height: calc(100vh - 280px);
  padding: 40px 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(102, 126, 234, 0.03) 100%);
}

.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

footer {
  margin-top: auto;
  border-top: 2px solid var(--border-color);
  background: var(--bg-card);
  padding: 30px 0 !important;
}

footer p {
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

footer p strong {
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.3rem;
  }

  .nav-link {
    margin: 8px 0;
    padding: 10px 12px !important;
  }

  .main-content {
    padding: 20px 0;
  }
}
</style>
