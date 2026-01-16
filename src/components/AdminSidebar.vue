<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h2><i class="fas fa-shield-alt"></i> ADMIN</h2>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/admin" class="nav-link" :class="{ active: isActive('/admin') }">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </RouterLink>
      
      <RouterLink to="/admin/juegos" class="nav-link" :class="{ active: isActive('/admin/juegos') }">
        <i class="fas fa-gamepad"></i>
        <span>Juegos</span>
      </RouterLink>
      
      <RouterLink to="/admin/usuarios" class="nav-link" :class="{ active: isActive('/admin/usuarios') }">
        <i class="fas fa-users"></i>
        <span>Usuarios</span>
      </RouterLink>
      
      <RouterLink to="/admin/resenas" class="nav-link" :class="{ active: isActive('/admin/resenas') }">
        <i class="fas fa-star"></i>
        <span>Reseñas</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <RouterLink to="/" class="nav-link">
        <i class="fas fa-home"></i>
        <span>Ir al sitio</span>
      </RouterLink>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (path) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  box-shadow: var(--shadow-md);
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: white;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-link span {
  flex: 1;
}

.sidebar-footer {
  padding: 20px 0;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer .nav-link {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 60px;
    position: fixed;
    left: 0;
    z-index: 1000;
  }

  .sidebar-header h2 {
    font-size: 1rem;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 12px;
  }

  .sidebar-footer {
    display: none;
  }
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
