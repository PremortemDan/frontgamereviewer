import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backgamereviewer.onrender.com/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
})

console.log('🔧 API Configuration:', {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT
})

export const useApi = () => {
  const handleError = (error, context) => {
    console.error(`Error en ${context}:`, error.message)
    throw error
  }

  const get = async (endpoint, context = 'GET request') => {
    try {
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      handleError(error, context)
    }
  }

  const post = async (endpoint, data, context = 'POST request') => {
    try {
      const response = await apiClient.post(endpoint, data)
      return response.data
    } catch (error) {
      handleError(error, context)
    }
  }

  const put = async (endpoint, data, context = 'PUT request') => {
    try {
      const response = await apiClient.put(endpoint, data)
      return response.data
    } catch (error) {
      handleError(error, context)
    }
  }

  const delete_ = async (endpoint, context = 'DELETE request') => {
    try {
      const response = await apiClient.delete(endpoint)
      return response.data
    } catch (error) {
      handleError(error, context)
    }
  }

  return { get, post, put, delete: delete_ }
}

// Specific API methods
export const useGamesAPI = () => {
  const { get, post, put, delete: deleteMethod } = useApi()

  return {
    getAll: () => get('/juegos', 'Obtener todos los juegos'),
    getById: (id) => get(`/juegos/${id}`, `Obtener juego ${id}`),
    create: (data) => post('/juegos', data, 'Crear juego'),
    update: (id, data) => put(`/juegos/${id}`, data, `Actualizar juego ${id}`),
    delete: (id) => deleteMethod(`/juegos/${id}`, `Eliminar juego ${id}`)
  }
}

export const useReviewsAPI = () => {
  const { get, post, put, delete: deleteMethod } = useApi()

  return {
    getAll: () => get('/reviews', 'Obtener todas las reseñas'),
    getByGame: (gameId) => get(`/reviews?videojuegoId=${gameId}`, `Obtener reseñas del juego ${gameId}`),
    getById: (id) => get(`/reviews/${id}`, `Obtener reseña ${id}`),
    create: (data) => post('/reviews', data, 'Crear reseña'),
    update: (id, data) => put(`/reviews/${id}`, data, `Actualizar reseña ${id}`),
    delete: (id) => deleteMethod(`/reviews/${id}`, `Eliminar reseña ${id}`)
  }
}

export const useAuthAPI = () => {
  const { post } = useApi()

  const login = async (username, password) => {
    const response = await post('/usuarios/login', { username, password }, 'Login')
    if (response && response.token) {
      localStorage.setItem('userToken', response.token)
      localStorage.setItem('currentUser', JSON.stringify(response.user))
    }
    return response
  }

  const register = async (data) => {
    const response = await post('/usuarios', data, 'Registro')
    return response
  }

  const logout = async () => {
    await post('/usuarios/logout', {}, 'Logout')
    localStorage.removeItem('userToken')
    localStorage.removeItem('currentUser')
    return { success: true }
  }

  return {
    login,
    register,
    logout
  }
}

export const useUsersAPI = () => {
  const { get, post, put, delete: deleteMethod } = useApi()

  return {
    getAll: () => get('/usuarios', 'Obtener todos los usuarios'),
    getById: (id) => get(`/usuarios/${id}`, `Obtener usuario ${id}`),
    create: (data) => post('/usuarios', data, 'Crear usuario'),
    update: (id, data) => put(`/usuarios/${id}`, data, `Actualizar usuario ${id}`),
    delete: (id) => deleteMethod(`/usuarios/${id}`, `Eliminar usuario ${id}`)
  }
}
