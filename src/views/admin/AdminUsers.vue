<template>
  <div class="admin-container">
    <AdminSidebar />
    
    <div class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <h1><i class="fas fa-users"></i> Gestión de Usuarios</h1>
        <button @click="showForm = !showForm" class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i> {{ showForm ? 'Cancelar' : 'Nuevo Usuario' }}
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="alert alert-info">
        <i class="fas fa-spinner fa-spin"></i> Cargando usuarios...
      </div>

      <!-- Form -->
      <div v-if="showForm" class="form-card mb-4">
        <h4>{{ editingId ? 'Editar Usuario' : 'Nuevo Usuario' }}</h4>
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre de Usuario</label>
              <input v-model="form.username" type="text" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Nombre Completo</label>
              <input v-model="form.fullName" type="text" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Rol</label>
              <select v-model="form.role" class="form-select">
                <option value="user">Usuario</option>
                <option value="moderator">Moderador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Estado</label>
              <select v-model="form.status" class="form-select">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="banned">Bloqueado</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Fecha de Registro</label>
              <input v-model="form.registrationDate" type="date" class="form-control" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success btn-sm">
              <i class="fas fa-save"></i> {{ editingId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button type="button" @click="resetForm" class="btn btn-secondary btn-sm">
              <i class="fas fa-times"></i> Limpiar
            </button>
          </div>
        </form>
      </div>

      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-md-6">
          <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar usuarios...">
        </div>
        <div class="col-md-6">
          <select v-model="filterRole" class="form-select">
            <option value="">Todos los roles</option>
            <option value="user">Usuario</option>
            <option value="moderator">Moderador</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-responsive">
        <table class="table admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td><span class="badge bg-secondary">{{ user.id }}</span></td>
              <td>
                <strong>{{ user.username }}</strong><br>
                <small class="text-muted">{{ user.fullName || user.nombre || 'N/A' }}</small>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="getRoleBadgeClass(user.role || user.rol)">
                  {{ user.role || user.rol || 'user' }}
                </span>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(user.status || user.estado)">
                  {{ user.status || user.estado || 'active' }}
                </span>
              </td>
              <td>{{ user.registrationDate || user.fechaRegistro || 'N/A' }}</td>
              <td>
                <button @click="editUser(user)" class="btn btn-sm btn-info me-2" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="text-center text-muted py-4">
                No hay usuarios que coincidan con los filtros
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'
import { useUsersAPI } from '../../composables/useApi'

const usersAPI = useUsersAPI()
const showForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const filterRole = ref('')
const loading = ref(false)
const error = ref(null)

const form = ref({
  username: '',
  email: '',
  fullName: '',
  role: 'user',
  status: 'active',
  registrationDate: ''
})

const users = ref([])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      (user.username || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const userRole = user.role || user.rol || 'user'
    const matchesRole = !filterRole.value || userRole === filterRole.value
    
    return matchesSearch && matchesRole
  })
})

const getRoleBadgeClass = (role) => {
  const roleNormalized = (role || '').toLowerCase()
  switch(roleNormalized) {
    case 'admin': return 'bg-danger'
    case 'moderator': return 'bg-warning'
    default: return 'bg-info'
  }
}

const getStatusBadgeClass = (status) => {
  const statusNormalized = (status || '').toLowerCase()
  switch(statusNormalized) {
    case 'active': return 'bg-success'
    case 'inactive': return 'bg-secondary'
    case 'banned': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    let data = await usersAPI.getAll()
    
    users.value = data || []
  } catch (err) {
    error.value = 'Error al cargar usuarios: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  try {
    if (editingId.value) {
      await usersAPI.update(editingId.value, form.value)
    } else {
      await usersAPI.create(form.value)
    }
    await loadUsers()
    resetForm()
    showForm.value = false
  } catch (err) {
    error.value = 'Error al guardar usuario: ' + err.message
    console.error(err)
  }
}

const editUser = (user) => {
  editingId.value = user.id
  form.value = { ...user }
  showForm.value = true
  window.scrollTo(0, 0)
}

const deleteUser = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    try {
      await usersAPI.delete(id)
      await loadUsers()
    } catch (err) {
      error.value = 'Error al eliminar usuario: ' + err.message
      console.error(err)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    status: 'active',
    registrationDate: ''
  }
}

onMounted(() => {
  loadUsers()
})
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
  font-size: 1.8rem;
}

.form-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.form-card h4 {
  margin: 0 0 15px 0;
  color: var(--text-primary);
}

.form-label {
  color: var(--text-primary);
  font-weight: 500;
}

.form-control, .form-select {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.form-control:focus, .form-select:focus {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.table-responsive {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 15px;
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}

.admin-table {
  margin: 0;
  color: var(--text-primary);
}

.admin-table thead {
  background-color: var(--bg-hover);
  border-bottom: 2px solid var(--border-color);
}

.admin-table th {
  color: var(--text-primary);
  font-weight: 600;
  padding: 12px;
}

.admin-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-light);
}

.admin-table tbody tr:hover {
  background-color: var(--bg-hover);
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
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
}
</style>
