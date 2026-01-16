<template>
  <div class="container py-4">
    <!-- Back Link -->
    <div class="back-link mb-3">
      <RouterLink to="/" class="btn btn-link text-decoration-none">
        <i class="fas fa-arrow-left"></i> Volver al inicio
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Cargando detalles del juego...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <h4 class="alert-heading"><i class="bi bi-exclamation-circle"></i> Error</h4>
      <p>{{ error }}</p>
      <hr>
      <RouterLink to="/" class="btn btn-outline-danger">
        Volver al inicio
      </RouterLink>
    </div>

    <!-- Game Details -->
    <section v-else-if="game" class="game-details">
      <div class="game-header mb-5">
        <div class="row">
          <div class="col-md-4 mb-3">
            <img :src="game.portadaUrl" :alt="game.titulo" class="img-fluid rounded shadow">
          </div>
          <div class="col-md-8">
            <h1>{{ game.titulo }}</h1>
            
            <div class="game-meta mb-4">
              <p v-if="game.plataformas" class="mb-2">
                <i class="bi bi-controller"></i>
                <strong>Plataformas:</strong> {{ game.plataformas.join(', ') }}
              </p>
              <p v-if="game.generos" class="mb-2">
                <i class="bi bi-tag"></i>
                <strong>Géneros:</strong> {{ game.generos.join(', ') }}
              </p>
              <p v-if="game.fechaLanzamiento" class="mb-2">
                <i class="bi bi-calendar"></i>
                <strong>Lanzamiento:</strong> {{ game.fechaLanzamiento }}
              </p>
            </div>

            <!-- Rating -->
            <div class="game-rating mb-4">
              <div class="d-flex align-items-center gap-3">
                <div class="rating-score">
                  <span class="score-number">{{ game.puntuacionUsuarios }}</span>
                  <span class="score-max">/100</span>
                </div>
                <div class="stars">
                  <i v-for="star in stars" :key="star.index" 
                     :class="star.filled ? 'fas fa-star' : 'far fa-star'">
                  </i>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="description">
              <p>{{ game.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Review Section -->
      <section class="add-review mb-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">
              <i class="bi bi-pencil-square"></i> Escribe tu reseña
            </h3>

            <div v-if="reviewSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="bi bi-check-circle"></i> ¡Reseña enviada correctamente!
              <button type="button" class="btn-close" @click="reviewSuccess = false"></button>
            </div>

            <form @submit.prevent="submitReview">
              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label">Nombre de usuario:</label>
                <input v-model="reviewForm.username" type="text" class="form-control" 
                       id="username" placeholder="Ingresa tu nombre" required
                       :disabled="submittingReview">
              </div>

              <!-- Rating Stars -->
              <div class="mb-3">
                <label class="form-label">Calificación:</label>
                <div class="star-rating">
                  <button v-for="i in 5" :key="i" type="button"
                          @click="reviewForm.rating = i"
                          :class="['star-btn', { active: reviewForm.rating >= i }]"
                          :disabled="submittingReview">
                    <i class="fas fa-star"></i>
                  </button>
                  <span class="ms-2">{{ reviewForm.rating }}/5</span>
                </div>
              </div>

              <!-- Review Text -->
              <div class="mb-3">
                <label for="reviewText" class="form-label">Reseña:</label>
                <textarea v-model="reviewForm.text" class="form-control" 
                          id="reviewText" rows="5" 
                          placeholder="Escribe tu reseña sobre este juego..." required
                          :disabled="submittingReview">
                </textarea>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary btn-submit" :disabled="submittingReview">
                <span v-if="submittingReview">
                  <span class="spinner-border spinner-border-sm me-2"></span> Enviando...
                </span>
                <span v-else>
                  <i class="bi bi-send"></i> Enviar Reseña
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Reviews Section -->
      <section class="other-reviews">
        <h3 class="mb-4">
          <i class="bi bi-chat-left-quote"></i> Reseñas de otros usuarios
        </h3>

        <div v-if="loadingReviews" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando reseñas...</span>
          </div>
        </div>

        <div v-else-if="reviews.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle"></i> No hay reseñas aún. ¡Sé el primero en dejar una!
        </div>

        <div v-else class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-card card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">{{ review.titulo || 'Reseña sin título' }}</h5>
                <div class="review-rating">
                  <small class="text-muted">{{ review.puntuacion }}/5</small>
                </div>
              </div>
              <div class="review-stars mb-2">
                <i v-for="i in Math.min(Math.round(review.puntuacion || 0), 5)" :key="`filled-${i}`" 
                   class="fas fa-star"></i>
                <i v-for="i in Math.max(0, 5 - Math.round(review.puntuacion || 0))" :key="`empty-${i}`" 
                   class="far fa-star"></i>
              </div>
              <p class="card-text">{{ review.comentario }}</p>
              <small class="text-muted">
                <i class="bi bi-calendar"></i> {{ formatDate(review.fecha) }}
              </small>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGamesAPI, useReviewsAPI } from '../composables/useApi'
import { useStars } from '../composables/useStars'

const route = useRoute()
const router = useRouter()
const gamesAPI = useGamesAPI()
const reviewsAPI = useReviewsAPI()
const { getStarArray } = useStars()

const gameId = computed(() => route.params.id)
const game = ref(null)
const reviews = ref([])
const loading = ref(false)
const loadingReviews = ref(false)
const error = ref(null)
const reviewSuccess = ref(false)
const submittingReview = ref(false)

const stars = computed(() => {
  if (!game.value) return []
  return getStarArray(game.value.puntuacionUsuarios)
})

const reviewForm = ref({
  username: '',
  rating: 0,
  text: ''
})

const loadGame = async () => {
  loading.value = true
  error.value = null
  try {
    game.value = await gamesAPI.getById(gameId.value)
    if (!game.value) {
      // Datos de prueba si la API no responde
      game.value = {
        id: gameId.value,
        titulo: 'Juego de Ejemplo',
        descripcion: 'Este es un juego de ejemplo para pruebas',
        portadaUrl: 'https://via.placeholder.com/400x600?text=Game+Cover',
        plataformas: ['PC', 'PlayStation', 'Xbox'],
        generos: ['Acción', 'Aventura'],
        fechaLanzamiento: '2024-01-15',
        puntuacionUsuarios: 85
      }
      console.warn('Usando datos de prueba - API no disponible')
    }
  } catch (err) {
    // Usar datos de prueba en caso de error
    game.value = {
      id: gameId.value,
      titulo: 'Juego de Ejemplo',
      descripcion: 'Este es un juego de ejemplo para pruebas',
      portadaUrl: 'https://via.placeholder.com/400x600?text=Game+Cover',
      plataformas: ['PC', 'PlayStation', 'Xbox'],
      generos: ['Acción', 'Aventura'],
      fechaLanzamiento: '2024-01-15',
      puntuacionUsuarios: 85
    }
    console.warn('Error al cargar desde API, usando datos de prueba:', err)
  } finally {
    loading.value = false
  }
}

const loadReviews = async () => {
  loadingReviews.value = true
  try {
    const data = await reviewsAPI.getByGame(gameId.value)
    reviews.value = data || []
  } catch (err) {
    console.error('Error loading reviews:', err)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

const submitReview = async () => {
  if (!reviewForm.value.username || reviewForm.value.rating === 0 || !reviewForm.value.text) {
    alert('Por favor completa todos los campos')
    return
  }

  submittingReview.value = true
  try {
    const response = await reviewsAPI.create({
      videojuegoId: parseInt(gameId.value),
      usuarioId: 1, // TODO: obtener del usuario logueado
      titulo: reviewForm.value.text.substring(0, 50),
      comentario: reviewForm.value.text,
      puntuacion: reviewForm.value.rating,
      fecha: new Date().toISOString(),
      likes: 0,
      estado: 'PUBLICADA'
    })

    if (response && (response.success || response.review)) {
      reviewSuccess.value = true
      reviewForm.value = { username: '', rating: 0, text: '' }
      
      // Reload reviews
      await loadReviews()

      setTimeout(() => {
        reviewSuccess.value = false
      }, 3000)
    } else {
      alert('Error al enviar la reseña. Intenta de nuevo.')
    }
  } catch (err) {
    alert('Error al enviar la reseña. Intenta de nuevo.')
    console.error('Error submitting review:', err)
  } finally {
    submittingReview.value = false
  }
}

const getStarCount = (score) => {
  // Validar que score sea un número válido
  if (!score || isNaN(score)) return 0
  const numScore = Number(score)
  
  // Si score es 1-5, es directamente el número de estrellas
  if (numScore <= 5) {
    return Math.max(0, Math.min(5, Math.round(numScore)))
  }
  // Si score es 0-100, convertir a 0-5
  return Math.max(0, Math.min(5, Math.round((numScore / 100) * 5)))
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadGame()
  loadReviews()
})
</script>

<style scoped>
.back-link {
  margin-bottom: 30px !important;
}

.back-link .btn {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.05rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.back-link .btn:hover {
  color: var(--color-secondary);
  transform: translateX(-5px);
}

.game-details {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.game-header {
  margin-bottom: 60px !important;
}

.game-header img {
  border-radius: 12px;
  border: 2px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.game-header img:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.game-header h1 {
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 25px;
  font-size: 2.5rem;
  line-height: 1.2;
}

.game-meta {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.05) 100%);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  margin-bottom: 25px;
}

.game-meta p {
  margin: 12px 0;
  color: var(--text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.game-meta i {
  color: var(--color-primary);
  font-size: 1.2rem;
  width: 20px;
}

.game-rating {
  display: flex;
  align-items: center;
  gap: 30px;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.05) 100%);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 25px;
}

.rating-score {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.score-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-primary);
}

.score-max {
  font-size: 1.3rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.stars {
  display: flex;
  gap: 8px;
  font-size: 1.6rem;
  color: #ffc107;
  line-height: 1;
  height: 1.8rem;
  align-items: center;
}

.stars i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.8rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.stars i:hover {
  transform: scale(1.15);
}

.description {
  font-size: 1.15rem;
  line-height: 1.9;
  color: var(--text-primary);
  margin-bottom: 30px;
}

.add-review {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.add-review .card-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-review .card-title i {
  color: var(--color-primary);
  font-size: 1.4rem;
}

.add-review .card-body {
  padding: 0;
  background: transparent;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 25px 0;
}

.star-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 2.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-btn:hover {
  color: #ffc107;
  transform: scale(1.25);
}

.star-btn.active {
  color: #ffc107;
  transform: scale(1.2);
}

.star-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Form Styling */
.form-label {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

.form-control {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--border-color);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.3rem rgba(102, 126, 234, 0.25);
}

.form-control::placeholder {
  color: var(--text-secondary);
}

.form-control:disabled {
  background-color: var(--bg-card);
  opacity: 0.6;
}

/* Reviews Section */
.reviews-section {
  margin-top: 50px;
}

.reviews-section h3 {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--color-primary);
}

.review-card {
  border: none;
  border-left: 5px solid var(--color-primary);
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.03) 100%);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 25px;
  margin-bottom: 20px;
}

.review-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-left-color: var(--color-secondary);
}

.review-card .card-header {
  background: transparent;
  border-bottom: 1px solid var(--border-color);
  padding: 0 0 15px 0;
  margin-bottom: 15px;
}

.review-username {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.review-date {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.review-stars {
  color: #ffc107;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.review-content {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.8;
  margin-top: 15px;
}

/* Button Styling */
.btn-submit {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border: none;
  color: white;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.05rem;
  width: 100%;
  margin-top: 20px;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-submit:active {
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Alert Styling */
.alert {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.05) 100%);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.alert-success {
  border-left: 5px solid #28a745;
}

.alert-danger {
  border-left: 5px solid #dc3545;
}

.alert .alert-heading {
  color: var(--text-primary);
  font-weight: 700;
  margin-bottom: 10px;
}

.spinner-border {
  color: var(--color-primary) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .game-header h1 {
    font-size: 1.8rem;
  }

  .game-rating {
    flex-direction: column;
    align-items: flex-start;
  }

  .score-number {
    font-size: 2.5rem;
  }

  .add-review {
    padding: 20px;
  }

  .add-review .card-title {
    font-size: 1.3rem;
  }
}
</style>
