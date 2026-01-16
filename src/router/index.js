import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import GameDetail from '../views/GameDetail.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminGames from '../views/admin/AdminGames.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminReviews from '../views/admin/AdminReviews.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Inicio - Reseñas de Videojuegos' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar Sesión - Reseñas de Videojuegos' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Registrarse - Reseñas de Videojuegos' }
  },
  {
    path: '/game/:id',
    name: 'GameDetail',
    component: GameDetail,
    meta: { title: 'Detalle del Juego - Reseñas de Videojuegos' }
  },
  // Admin Routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
    meta: { title: 'Admin Login - Reseñas de Videojuegos' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: 'Panel Administrativo - Reseñas de Videojuegos', requiresAuth: true }
  },
  {
    path: '/admin/juegos',
    name: 'AdminGames',
    component: AdminGames,
    meta: { title: 'Gestión de Juegos - Admin', requiresAuth: true }
  },
  {
    path: '/admin/usuarios',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { title: 'Gestión de Usuarios - Admin', requiresAuth: true }
  },
  {
    path: '/admin/resenas',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { title: 'Gestión de Reseñas - Admin', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Reseñas de Videojuegos'
  
  // Check admin auth
  if (to.meta.requiresAuth) {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      next('/admin/login')
      return
    }
  }
  
  next()
})

export default router
