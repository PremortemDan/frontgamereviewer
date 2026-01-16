<template>
  <div class="admin-container">
    <AdminSidebar />
    
    <div class="admin-content">
      <!-- Header -->
      <div class="admin-header">
        <h1><i class="fas fa-star"></i> Gestión de Reseñas</h1>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ error }}
        <button type="button" class="btn-close" @click="error = null"></button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="alert alert-info">
        <i class="fas fa-spinner fa-spin"></i> Cargando reseñas...
      </div>

      <!-- Filter -->
      <div class="filter-bar mb-4">
        <div class="row">
          <div class="col-md-4">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar reseñas...">
          </div>
          <div class="col-md-4">
            <select v-model="filterStatus" class="form-select">
              <option value="">Todos los estados</option>
              <option value="PUBLICADA">Publicada</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="filterRating" class="form-select">
              <option value="">Todas las calificaciones</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
              <option value="3">⭐⭐⭐ Bueno</option>
              <option value="2">⭐⭐ Malo</option>
              <option value="1">⭐ Muy Malo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Reviews Cards -->
      <div class="reviews-grid">
        <div v-for="review in filteredReviews" :key="review.id" class="review-card">
          <div class="review-header">
            <div class="review-user">
              <h5>{{ review.titulo }}</h5>
              <small class="text-muted">Video: #{{ review.videojuegoId }}</small>
            </div>
            <span class="badge" :class="getStatusBadgeClass(review.estado)">
              {{ review.estado }}
            </span>
          </div>

          <div class="review-rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.puntuacion }">
              ★
            </span>
          </div>

          <p class="review-text">{{ review.comentario }}</p>

          <div class="review-meta">
            <small class="text-muted">
              <i class="fas fa-calendar"></i> {{ review.fecha }}
            </small>
          </div>

          <div class="review-actions">
            <button v-if="review.estado !== 'PUBLICADA'" @click="approveReview(review.id)" 
                    class="btn btn-sm btn-success" title="Aprobar">
              <i class="fas fa-check"></i> Aprobar
            </button>
            <button v-if="review.estado !== 'RECHAZADA'" @click="rejectReview(review.id)" 
                    class="btn btn-sm btn-warning" title="Rechazar">
              <i class="fas fa-times"></i> Rechazar
            </button>
            <button @click="deleteReview(review.id)" class="btn btn-sm btn-danger" title="Eliminar">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>

        <div v-if="filteredReviews.length === 0" class="col-12">
          <div class="alert alert-info text-center">
            <i class="fas fa-info-circle"></i> No hay reseñas que coincidan con los filtros
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '../../components/AdminSidebar.vue'
import { useReviewsAPI } from '../../composables/useApi'

const reviewsAPI = useReviewsAPI()
const searchQuery = ref('')
const filterStatus = ref('')
const filterRating = ref('')
const loading = ref(false)
const error = ref(null)

const reviews = ref([])

const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    const matchesSearch = !searchQuery.value || 
      (review.titulo || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (review.comentario || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || review.estado === filterStatus.value
    const matchesRating = !filterRating.value || review.puntuacion.toString() === filterRating.value
    
    return matchesSearch && matchesStatus && matchesRating
  })
})

const getStatusBadgeClass = (status) => {
  switch(status) {
    case 'PUBLICADA': return 'bg-success'
    case 'PENDIENTE': return 'bg-warning'
    case 'RECHAZADA': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const loadReviews = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await reviewsAPI.getAll()
    reviews.value = data || []
  } catch (err) {
    error.value = 'Error al cargar reseñas: ' + err.message
    console.error(err)
  } finally {
    loading.value = false
  }
}

const approveReview = async (id) => {
  try {
    const review = reviews.value.find(r => r.id === id)
    if (review) {
      await reviewsAPI.update(id, { ...review, estado: 'PUBLICADA' })
      await loadReviews()
    }
  } catch (err) {
    error.value = 'Error al aprobar reseña: ' + err.message
    console.error(err)
  }
}

const rejectReview = async (id) => {
  try {
    const review = reviews.value.find(r => r.id === id)
    if (review) {
      await reviewsAPI.update(id, { ...review, estado: 'RECHAZADA' })
      await loadReviews()
    }
  } catch (err) {
    error.value = 'Error al rechazar reseña: ' + err.message
    console.error(err)
  }
}

const deleteReview = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
    try {
      await reviewsAPI.delete(id)
      await loadReviews()
    } catch (err) {
      error.value = 'Error al eliminar reseña: ' + err.message
      console.error(err)
    }
  }
}

onMounted(() => {
  loadReviews()
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

.filter-bar {
  background: var(--bg-card);
  padding: 15px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.filter-bar .form-control,
.filter-bar .form-select {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.review-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.review-user h5 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.review-user small {
  display: block;
  margin-top: 5px;
}

.review-rating {
  margin-bottom: 15px;
}

.star {
  color: #ddd;
  font-size: 1.3rem;
  transition: color 0.2s;
}

.star.filled {
  color: #ffc107;
}

.review-text {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
  flex-grow: 1;
  font-size: 0.95rem;
}

.review-meta {
  margin-bottom: 15px;
  padding-top: 10px;
  border-top: 1px solid var(--border-light);
}

.review-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-actions .btn {
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  flex: 1;
  min-width: 80px;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

.alert {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-color);
}

@media (max-width: 768px) {
  .admin-content {
    padding: 15px;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .review-actions {
    flex-direction: column;
  }

  .review-actions .btn {
    width: 100%;
  }
}
</style>
