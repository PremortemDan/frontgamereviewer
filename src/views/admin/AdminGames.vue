<template>
  <div class="admin-container">
    <AdminSidebar />
    
    <div class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <h1><i class="fas fa-gamepad"></i> Gestión de Juegos</h1>
        <button @click="showForm = !showForm" class="btn btn-primary btn-sm">
          <i class="fas fa-plus"></i> {{ showForm ? 'Cancelar' : 'Nuevo Juego' }}
        </button>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="alert alert-info">
        <i class="fas fa-spinner fa-spin"></i> Cargando juegos...
      </div>

      <!-- Form -->
      <div v-if="showForm" class="form-card mb-4">
        <h4>{{ editingId ? 'Editar Juego' : 'Nuevo Juego' }}</h4>
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Título</label>
              <input v-model="form.titulo" type="text" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Descripción</label>
              <input v-model="form.descripcion" type="text" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">URL Portada</label>
              <input v-model="form.portadaUrl" type="url" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Puntuación (0-100)</label>
              <input v-model.number="form.puntuacionUsuarios" type="number" class="form-control" min="0" max="100" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Plataformas (separadas por coma)</label>
              <input v-model="form.plataformas" type="text" class="form-control" placeholder="PC, PlayStation, Xbox">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Géneros (separados por coma)</label>
              <input v-model="form.generos" type="text" class="form-control" placeholder="Acción, Aventura">
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Fecha de Lanzamiento</label>
              <input v-model="form.fechaLanzamiento" type="date" class="form-control" required>
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
      <div class="search-bar mb-4">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar juegos...">
      </div>

      <!-- Games Table -->
      <div class="table-responsive">
        <table class="table admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Plataformas</th>
              <th>Puntuación</th>
              <th>Fecha Lanzamiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in filteredGames" :key="game.id">
              <td><span class="badge bg-secondary">{{ game.id }}</span></td>
              <td>
                <strong>{{ game.titulo }}</strong><br>
                <small class="text-muted">{{ game.descripcion }}</small>
              </td>
              <td>{{ game.plataformas.join(', ') }}</td>
              <td>
                <span class="badge" :class="game.puntuacionUsuarios >= 70 ? 'bg-success' : 'bg-warning'">
                  {{ game.puntuacionUsuarios }}/100
                </span>
              </td>
              <td>{{ game.fechaLanzamiento }}</td>
              <td>
                <button @click="editGame(game)" class="btn btn-sm btn-info me-2" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="deleteGame(game.id)" class="btn btn-sm btn-danger" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredGames.length === 0">
              <td colspan="6" class="text-center text-muted py-4">
                No hay juegos que coincidan con la búsqueda
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
import { useGamesAPI } from '../../composables/useApi'

const gamesAPI = useGamesAPI()
const showForm = ref(false)
const editingId = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

const form = ref({
  titulo: '',
  descripcion: '',
  portadaUrl: '',
  puntuacionUsuarios: 75,
  plataformas: '',
  generos: '',
  fechaLanzamiento: ''
})

const games = ref([])

const filteredGames = computed(() => {
  if (!searchQuery.value) return games.value
  return games.value.filter(game => 
    game.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    game.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadGames = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await gamesAPI.getAll()
    games.value = data || []
  } catch (err) {
    error.value = 'Error al cargar juegos: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}

const submitForm = async () => {
  try {
    const gameData = {
      ...form.value,
      plataformas: form.value.plataformas.split(',').map(p => p.trim()),
      generos: form.value.generos.split(',').map(g => g.trim())
    }

    if (editingId.value) {
      await gamesAPI.update(editingId.value, gameData)
    } else {
      await gamesAPI.create(gameData)
    }
    
    await loadGames()
    resetForm()
    showForm.value = false
  } catch (err) {
    error.value = 'Error al guardar juego: ' + err.message
    console.error(err)
  }
}

const editGame = (game) => {
  editingId.value = game.id
  form.value = {
    titulo: game.titulo,
    descripcion: game.descripcion,
    portadaUrl: game.portadaUrl,
    puntuacionUsuarios: game.puntuacionUsuarios,
    plataformas: Array.isArray(game.plataformas) ? game.plataformas.join(', ') : game.plataformas,
    generos: Array.isArray(game.generos) ? game.generos.join(', ') : game.generos,
    fechaLanzamiento: game.fechaLanzamiento
  }
  showForm.value = true
  window.scrollTo(0, 0)
}

const deleteGame = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este juego?')) {
    try {
      await gamesAPI.delete(id)
      await loadGames()
    } catch (err) {
      error.value = 'Error al eliminar juego: ' + err.message
      console.error(err)
    }
  }
}

const resetForm = () => {
  editingId.value = null
  form.value = {
    titulo: '',
    descripcion: '',
    portadaUrl: '',
    puntuacionUsuarios: 75,
    plataformas: '',
    generos: '',
    fechaLanzamiento: ''
  }
}

onMounted(() => {
  loadGames()
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
  margin-bottom: 8px;
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

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.search-bar {
  background: var(--bg-card);
  padding: 10px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.search-bar .form-control {
  background-color: var(--bg-input);
  color: var(--text-primary);
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
  vertical-align: middle;
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

  .table-responsive {
    font-size: 0.9rem;
  }

  .admin-table th,
  .admin-table td {
    padding: 8px;
  }
}
</style>
