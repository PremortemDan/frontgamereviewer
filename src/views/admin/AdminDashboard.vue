<template>
  <div class="admin-container">
    <AdminSidebar />
    
    <div class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <h1><i class="fas fa-tachometer-alt"></i> Panel Administrativo</h1>
        <button @click="logout" class="btn btn-danger btn-sm">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon games">
              <i class="fas fa-gamepad"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.games }}</h3>
              <p>Juegos</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon users">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.users }}</h3>
              <p>Usuarios</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon reviews">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.reviews }}</h3>
              <p>Reseñas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon reports">
              <i class="fas fa-flag"></i>
            </div>
            <div class="stat-content">
              <h3>{{ stats.reports }}</h3>
              <p>Reportes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="action-card">
            <h4><i class="fas fa-plus-circle"></i> Acciones Rápidas</h4>
            <div class="action-buttons">
              <RouterLink to="/admin/juegos" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-plus"></i> Nuevo Juego
              </RouterLink>
              <RouterLink to="/admin/usuarios" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-plus"></i> Nuevo Usuario
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="action-card">
            <h4><i class="fas fa-cog"></i> Gestión</h4>
            <div class="action-buttons">
              <RouterLink to="/admin/juegos" class="btn btn-outline-info btn-sm">
                <i class="fas fa-list"></i> Juegos
              </RouterLink>
              <RouterLink to="/admin/resenas" class="btn btn-outline-warning btn-sm">
                <i class="fas fa-comments"></i> Reseñas
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="activity-card">
            <h4><i class="fas fa-history"></i> Actividad Reciente</h4>
            <ul class="activity-list">
              <li><span class="badge bg-success">Nuevo</span> Juego agregado: Starfield</li>
              <li><span class="badge bg-warning">Modificado</span> Usuario: juan_perez actualizado</li>
              <li><span class="badge bg-info">Reseña</span> Nueva reseña para Elden Ring</li>
              <li><span class="badge bg-danger">Deletado</span> Reseña inapropiada removida</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../../components/AdminSidebar.vue'

const router = useRouter()

const stats = ref({
  games: 42,
  users: 187,
  reviews: 524,
  reports: 3
})

const logout = () => {
  localStorage.removeItem('adminToken')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-body);
}

.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.admin-header h1 {
  color: var(--color-primary);
  font-weight: 700;
  margin: 0;
  font-size: 2rem;
}

/* Stat Cards */
.stat-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.games {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.reviews {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.reports {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.stat-content h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
}

.stat-content p {
  margin: 5px 0 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Action Cards */
.action-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.action-card h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-buttons .btn {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

/* Activity Card */
.activity-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.activity-card h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
  font-weight: 600;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  padding: 10px 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-list li:last-child {
  border-bottom: none;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

.btn-danger {
  background: #dc3545;
  border: none;
}

.btn-danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .admin-content {
    padding: 15px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
