<template>
  <div class="container py-4">
    <!-- Search Section -->
    <section class="search-section mb-4">
      <h2 class="mb-3">
        <i class="bi bi-search"></i> Buscar Juegos
      </h2>
      <div class="input-group input-group-lg">
        <input v-model="searchQuery" type="text" class="form-control" 
               placeholder="Buscar por nombre, género, plataforma..." 
               aria-label="Buscar juegos"
               @keyup.enter="performSearch">
        <button @click="performSearch" class="btn btn-primary" type="button">
          <i class="fas fa-search"></i> Buscar
        </button>
      </div>
    </section>

    <!-- Recent Games Section -->
    <section class="games-section mb-5" aria-labelledby="recent-games-heading">
      <h2 id="recent-games-heading" class="mb-4 pb-2 border-bottom border-primary border-3">
        <i class="bi bi-clock-history" aria-hidden="true"></i> Juegos Recientes
      </h2>

      <!-- Loading State -->
      <div v-if="loadingRecent" class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-5">
        <div v-for="i in gamesPerPage" :key="`skeleton-${i}`" class="col">
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>

      <!-- Games Grid -->
      <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-5" 
           id="recentGames" role="list" aria-label="Lista de juegos recientes">
        <div v-for="game in paginatedGames" :key="game.id" class="col">
          <GameCard :game="game" />
        </div>
      </div>

      <!-- Pagination Controls -->
      <nav v-if="!loadingRecent && totalPages > 1" aria-label="Paginación de juegos recientes" class="mt-4">
        <ul class="pagination justify-content-center" id="recentGamesPagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button @click="previousPage" class="page-link" :disabled="currentPage === 1">
              Anterior
            </button>
          </li>

          <li v-for="page in visiblePages" :key="page" class="page-item" 
              :class="{ active: currentPage === page }">
            <button @click="goToPage(page)" class="page-link">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button @click="nextPage" class="page-link" :disabled="currentPage === totalPages">
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </section>

    <!-- Top Rated Games Section -->
    <section class="games-section mb-5" aria-labelledby="top-rated-heading">
      <h2 id="top-rated-heading" class="mb-4 pb-2 border-bottom border-primary border-3">
        <i class="bi bi-star-fill" aria-hidden="true"></i> Mejor Puntuados
      </h2>

      <!-- Loading State -->
      <div v-if="loadingTopRated" class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-5">
        <div v-for="i in 6" :key="`skeleton-top-${i}`" class="col">
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
          </div>
        </div>
      </div>

      <!-- Games Grid -->
      <div v-else class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-5" 
           id="topRatedGames" role="list" aria-label="Lista de juegos mejor puntuados">
        <div v-for="game in topRatedGames" :key="game.id" class="col">
          <GameCard :game="game" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GameCard from '../components/GameCard.vue'
import { useGamesAPI } from '../composables/useApi'

const gamesAPI = useGamesAPI()

const searchQuery = ref('')
const currentPage = ref(1)
const gamesPerPage = ref(6)
const allGames = ref([])
const loadingRecent = ref(false)
const loadingTopRated = ref(false)

const totalPages = computed(() => Math.ceil(allGames.value.length / gamesPerPage.value))

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * gamesPerPage.value
  return allGames.value.slice(start, start + gamesPerPage.value)
})

const topRatedGames = computed(() => {
  return [...allGames.value]
    .sort((a, b) => b.puntuacionUsuarios - a.puntuacionUsuarios)
    .slice(0, 6)
})

const visiblePages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const loadGames = async () => {
  loadingRecent.value = true
  loadingTopRated.value = true
  
  // Función para reintentar la petición
  const fetchWithRetry = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Intento ${i + 1} de ${retries} - Cargando juegos desde API...`)
        const games = await gamesAPI.getAll()
        
        if (games && games.length > 0) {
          console.log(`✅ Juegos cargados exitosamente: ${games.length} juegos`)
          return games
        }
        
        // Si no hay juegos pero tampoco error, esperar y reintentar
        if (i < retries - 1) {
          console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      } catch (error) {
        console.error(`❌ Error en intento ${i + 1}:`, error.message)
        
        // Si no es el último intento, esperar antes de reintentar
        if (i < retries - 1) {
          console.log(`⏳ Esperando ${delay}ms antes de reintentar...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          throw error // Lanzar el error solo en el último intento
        }
      }
    }
    return null
  }
  
  try {
    const games = await fetchWithRetry(3, 3000) // 3 intentos, 3 segundos entre cada uno
    
    // Usar datos de prueba solo si después de todos los intentos no hay datos
    if (!games || games.length === 0) {
      console.warn('⚠️ Usando datos de prueba - API no disponible después de múltiples intentos')
      allGames.value = [
        {
          id: 1,
          titulo: 'The Witcher 3',
          descripcion: 'Juego de rol de acción en mundo abierto',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Witcher+3',
          plataformas: ['PC', 'PlayStation', 'Xbox'],
          generos: ['RPG', 'Acción'],
          fechaLanzamiento: '2015-05-19',
          puntuacionUsuarios: 92
        },
        {
          id: 2,
          titulo: 'Elden Ring',
          descripcion: 'Juego de rol de acción desafiante',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Elden+Ring',
          plataformas: ['PC', 'PlayStation', 'Xbox'],
          generos: ['RPG', 'Acción'],
          fechaLanzamiento: '2022-02-25',
          puntuacionUsuarios: 96
        },
        {
          id: 3,
          titulo: 'Cyberpunk 2077',
          descripcion: 'RPG de acción en un futuro distópico',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Cyberpunk',
          plataformas: ['PC', 'PlayStation', 'Xbox'],
          generos: ['RPG', 'Acción'],
          fechaLanzamiento: '2020-12-10',
          puntuacionUsuarios: 78
        },
        {
          id: 4,
          titulo: 'Starfield',
          descripcion: 'Juego de exploración espacial',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Starfield',
          plataformas: ['PC', 'Xbox'],
          generos: ['RPG', 'Ciencia Ficción'],
          fechaLanzamiento: '2023-09-06',
          puntuacionUsuarios: 87
        },
        {
          id: 5,
          titulo: 'Baldurs Gate 3',
          descripcion: 'RPG táctico clásico reimaginado',
          portadaUrl: 'https://via.placeholder.com/300x400?text=BG3',
          plataformas: ['PC', 'PlayStation'],
          generos: ['RPG', 'Estrategia'],
          fechaLanzamiento: '2023-08-03',
          puntuacionUsuarios: 95
        },
        {
          id: 6,
          titulo: 'Hogwarts Legacy',
          descripcion: 'Aventura en el mundo de Harry Potter',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Hogwarts',
          plataformas: ['PC', 'PlayStation', 'Xbox'],
          generos: ['RPG', 'Aventura'],
          fechaLanzamiento: '2023-02-10',
          puntuacionUsuarios: 84
        },
        {
          id: 7,
          titulo: 'Alan Wake 2',
          descripcion: 'Thriller psicológico de acción',
          portadaUrl: 'https://via.placeholder.com/300x400?text=Alan+Wake+2',
          plataformas: ['PC', 'PlayStation', 'Xbox'],
          generos: ['Acción', 'Thriller'],
          fechaLanzamiento: '2023-10-27',
          puntuacionUsuarios: 88
        },
        {
          id: 8,
          titulo: 'Final Fantasy XVI',
          descripcion: 'JRPG épico con acción en tiempo real',
          portadaUrl: 'https://via.placeholder.com/300x400?text=FF16',
          plataformas: ['PlayStation'],
          generos: ['JRPG', 'Acción'],
          fechaLanzamiento: '2023-06-22',
          puntuacionUsuarios: 90
        }
      ]
    } else {
      allGames.value = games
    }
    
    currentPage.value = 1
  } catch (error) {
    console.error('❌ Error crítico cargando juegos:', error)
    // Usar datos de prueba en caso de error después de reintentos
    allGames.value = [
      {
        id: 1,
        titulo: 'Juego de Prueba',
        descripcion: 'Datos de prueba para desarrollo',
        portadaUrl: 'https://via.placeholder.com/300x400?text=Test+Game',
        plataformas: ['PC'],
        generos: ['Acción'],
        fechaLanzamiento: '2024-01-01',
        puntuacionUsuarios: 75
      }
    ]
  } finally {
    loadingRecent.value = false
    loadingTopRated.value = false
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    allGames.value = allGames.value.filter(game =>
      game.titulo.toLowerCase().includes(query) ||
      game.generos.some(g => g.toLowerCase().includes(query)) ||
      game.plataformas.some(p => p.toLowerCase().includes(query))
    )
  } else {
    loadGames()
  }
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

onMounted(() => {
  loadGames()
})
</script>

<style scoped>
.search-section {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(102, 126, 234, 0.1) 100%);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.search-section h2 {
  margin-bottom: 20px;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-section h2 i {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.search-section .input-group {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.search-section .form-control {
  background-color: var(--bg-input);
  border-color: var(--border-color);
  color: var(--text-primary);
  padding: 12px 18px;
  font-size: 1.1rem;
}

.search-section .form-control::placeholder {
  color: var(--text-secondary);
}

.search-section .form-control:focus {
  background-color: var(--bg-input);
  border-color: var(--color-primary);
  color: var(--text-primary);
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.search-section .btn {
  padding: 12px 28px;
  font-weight: 600;
  font-size: 1.05rem;
}

.games-section {
  margin-bottom: 50px;
  animation: fadeIn 0.5s ease-in;
}

.games-section h2 {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.games-section h2 i {
  color: var(--color-primary);
  font-size: 1.5rem;
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

.skeleton-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.skeleton-img {
  height: 250px;
  background: linear-gradient(90deg, var(--bg-input), rgba(102, 126, 234, 0.2), var(--bg-input));
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-title {
  height: 20px;
  margin: 15px;
  background: linear-gradient(90deg, var(--bg-input), rgba(102, 126, 234, 0.2), var(--bg-input));
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 15px;
  margin: 0 15px 15px;
  background: linear-gradient(90deg, var(--bg-input), rgba(102, 126, 234, 0.2), var(--bg-input));
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.pagination .page-link {
  color: var(--color-primary);
  border-color: var(--border-color);
  background-color: var(--bg-card);
}

.pagination .page-link:hover:not(.page-item.disabled .page-link) {
  color: #fff;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.pagination .page-item.active .page-link {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.pagination .page-item.disabled .page-link {
  background-color: var(--bg-input);
  border-color: var(--border-color);
  color: var(--text-secondary);
  cursor: not-allowed;
}
</style>
