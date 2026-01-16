<template>
  <div class="game-card" role="listitem" :id="`game-card-${game.id}`" 
       :aria-labelledby="`game-title-${game.id}`"
       :aria-describedby="`game-desc-${game.id}`"
       @click="handleCardClick" @keydown.enter="handleCardClick" @keydown.space="handleCardClick"
       tabindex="0">
    
    <div class="card h-100 shadow-sm">
      <!-- Image -->
      <img :src="game.portadaUrl" :alt="`Portada del juego ${game.titulo}`" 
           class="card-img-top game-img" role="img">

      <div class="card-body d-flex flex-column">
        <!-- Title -->
        <h3 class="card-title game-title" :id="`game-title-${game.id}`">
          {{ game.titulo }}
        </h3>

        <!-- Description -->
        <p class="card-text game-desc text-muted" :id="`game-desc-${game.id}`">
          {{ game.descripcion }}
        </p>

        <!-- Metadata -->
        <div class="game-meta mt-2 mb-3">
          <!-- Platforms -->
          <div class="mb-2">
            <small class="text-secondary">
              <i class="bi bi-controller"></i> 
              <span class="game-platforms" :aria-label="`Plataformas: ${game.plataformas.join(', ')}`">
                {{ game.plataformas.join(', ') }}
              </span>
            </small>
          </div>

          <!-- Genres -->
          <div class="mb-2">
            <small class="text-secondary">
              <i class="bi bi-tag"></i> 
              <span class="game-genres" :aria-label="`Géneros: ${game.generos.join(', ')}`">
                {{ game.generos.join(', ') }}
              </span>
            </small>
          </div>

          <!-- Release Date -->
          <div class="mb-2">
            <small class="text-secondary">
              <i class="bi bi-calendar"></i> 
              <span class="game-date" :aria-label="`Fecha de lanzamiento: ${game.fechaLanzamiento}`">
                {{ game.fechaLanzamiento }}
              </span>
            </small>
          </div>
        </div>

        <!-- Score -->
        <div class="game-score-section mt-auto mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="stars">
              <i v-for="star in stars" :key="star.index" 
                 :class="star.filled ? 'fas fa-star' : 'far fa-star'">
              </i>
            </div>
            <span class="game-card-score" :aria-label="`Puntuación: ${game.puntuacionUsuarios} de 100`">
              {{ game.puntuacionUsuarios }}/100
            </span>
          </div>
        </div>

        <!-- Button -->
        <button @click.stop="handleReviewClick" class="btn btn-review btn-primary w-100"
                :aria-label="`Escribir reseña para ${game.titulo}`">
          <i class="bi bi-pencil-square"></i> Escribir Reseña
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStars } from '../composables/useStars'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const { getStarArray } = useStars()

const stars = computed(() => getStarArray(props.game.puntuacionUsuarios))

const handleCardClick = () => {
  router.push({ name: 'GameDetail', params: { id: props.game.id } })
}

const handleReviewClick = () => {
  router.push({ name: 'GameDetail', params: { id: props.game.id } })
}
</script>

<style scoped>
.game-card {
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.game-card:hover {
  transform: translateY(-8px);
}

.game-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.card {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.game-card:hover .card {
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.25);
  border-color: var(--color-primary);
}

.game-img {
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, var(--bg-input) 0%, rgba(102, 126, 234, 0.1) 100%);
}

.game-card:hover .game-img {
  transform: scale(1.08);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 15px;
}

.game-meta {
  font-size: 0.85rem;
  margin: 12px 0;
}

.game-meta small {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.game-meta i {
  color: var(--color-primary);
  font-size: 0.95rem;
  width: 16px;
  text-align: center;
}

.stars {
  display: flex;
  gap: 4px;
  color: #ffc107;
  font-size: 1rem;
  line-height: 1;
  height: 1.2rem;
  align-items: center;
}

.stars i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.2rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.stars i:hover {
  transform: scale(1.15);
}

.game-card-score {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1rem;
  margin-left: 10px;
}

.btn-review {
  border-radius: 8px;
  font-weight: 700;
  transition: all 0.3s ease;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border: none;
  color: white;
  font-size: 0.95rem;
  margin-top: 15px;
}

.btn-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-review:active {
  transform: translateY(0);
}
</style>
