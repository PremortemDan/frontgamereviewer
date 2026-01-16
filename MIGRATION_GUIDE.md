# Guía de Migración: Vue 3 Migration Guide

## 📋 Resumen de Cambios

La aplicación ha sido completamente migrada de HTML/JavaScript vanilla a **Vue 3** con **Vite**.

### Antes (Estructura antigua)
```
html/
  ├── index.html
  ├── login.html
  ├── register.html
  ├── juego.html
  └── gameCard.html
js/
  ├── scripts.js
  ├── api-service.js
  ├── footer-loader.js
  ├── particles-config.js
  ├── ux-enhancements.js
  └── colorblind-mode.js
css/
  ├── styles.css
  ├── ux-styles.css
  └── colorblind-mode.css
```

### Después (Estructura Vue 3)
```
src/
├── components/
│   ├── Layout.vue (Header + Navbar + Footer)
│   └── GameCard.vue (Tarjeta de juego)
├── views/
│   ├── Home.vue (index.html → Home)
│   ├── Login.vue (login.html → Login)
│   ├── Register.vue (register.html → Register)
│   └── GameDetail.vue (juego.html → GameDetail)
├── composables/
│   ├── useApi.js (api-service.js)
│   ├── useTheme.js (tema automático)
│   ├── useColorblindMode.js (colorblind-mode.js)
│   ├── useParticles.js (particles-config.js)
│   └── useStars.js (utilidades)
├── router/
│   └── index.js (Vue Router configuration)
├── assets/styles/
│   ├── main.css
│   ├── ux-styles.css
│   └── colorblind-mode.css
└── App.vue (Componente raíz)
```

## 🔄 Migración de Conceptos

### 1. **Servicio API**

**Antes (vanilla JS)**
```javascript
// api-service.js
async function fetchGames() {
    return await JuegosAPI.getAll() || [];
}
```

**Después (Composable)**
```javascript
// composables/useApi.js
export const useGamesAPI = () => {
  const { get } = useApi()
  return {
    getAll: () => get('/juegos', 'Obtener todos los juegos')
  }
}

// En componente
import { useGamesAPI } from '@/composables/useApi'
const gamesAPI = useGamesAPI()
const games = await gamesAPI.getAll()
```

### 2. **Gestión de Temas**

**Antes**
```javascript
// En scripts.js
document.documentElement.setAttribute('data-bs-theme', 'dark')
```

**Después (Composable)**
```javascript
// composables/useTheme.js
export const useTheme = () => {
  const setTheme = (newTheme) => {
    document.documentElement.setAttribute('data-bs-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }
  return { setTheme }
}

// En componente Layout.vue
const { setTheme } = useTheme()
const toggleTheme = () => setTheme('dark')
```

### 3. **Renderizado Dinámico**

**Antes (innerHTML)**
```javascript
// scripts.js
card.innerHTML = `
  <div class="card">
    <img src="${game.portadaUrl}" />
    <h3>${game.titulo}</h3>
  </div>
`
```

**Después (Template Vue)**
```vue
<!-- GameCard.vue -->
<template>
  <div class="card">
    <img :src="game.portadaUrl" />
    <h3>{{ game.titulo }}</h3>
  </div>
</template>
```

### 4. **Reactividad**

**Antes**
```javascript
let currentPage = 1
function nextPage() {
  currentPage++
  renderGames() // Necesario renderizar manualmente
}
```

**Después (Reactividad automática)**
```vue
<script setup>
import { ref, computed } from 'vue'

const currentPage = ref(1)
const nextPage = () => currentPage.value++

// Computado se actualiza automáticamente
const paginatedGames = computed(() => {
  return allGames.value.slice(
    (currentPage.value - 1) * 6,
    currentPage.value * 6
  )
})
</script>
```

### 5. **Rutas**

**Antes (navegación manual)**
```javascript
// En scripts.js
function viewGame(id) {
  window.location.href = `juego.html?id=${id}`
}
```

**Después (Vue Router)**
```javascript
// router/index.js
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/game/:id', name: 'GameDetail', component: GameDetail }
]

// En componente
const router = useRouter()
const viewGame = (id) => router.push({ name: 'GameDetail', params: { id } })
```

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias
```bash
cd /home/dandev/Documentos/PINOS/front
npm install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```
La app estará disponible en `http://localhost:5173`

### 3. Construir para Producción
```bash
npm run build
```
Los archivos compilados estarán en `dist/`

## 📚 Estructura de Composables

### `useApi.js` - Servicios HTTP
```javascript
const { get, post, put, delete: delete_ } = useApi()
await get('/juegos')
await post('/resenas', reviewData)
```

### `useTheme.js` - Gestión de Temas
```javascript
const { theme, setTheme, initTheme } = useTheme()
setTheme('dark')
```

### `useColorblindMode.js` - Modo Daltónico
```javascript
const { isColorblindMode, toggleColorblindMode } = useColorblindMode()
toggleColorblindMode()
```

### `useStars.js` - Utilidades de Estrellas
```javascript
const { getStarArray, renderStars } = useStars()
const stars = getStarArray(80) // [{ filled: true }, ...]
```

## 🎨 Estilos Globales

Los estilos se cargan en `src/main.js`:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/main.css'
import './assets/styles/ux-styles.css'
import './assets/styles/colorblind-mode.css'
```

### Variables CSS Disponibles
- `--color-primary`: #667eea
- `--color-secondary`: #764ba2
- `--text-primary`: #333333
- `--bg-body`: #f5f5f5
- Y más... ver `src/assets/styles/main.css`

## 🔌 Conexión a API

La configuración del API se encuentra en:
- URL base: `http://localhost:9090/api`
- Archivo: `src/composables/useApi.js`

Para cambiar la URL:
```javascript
const API_CONFIG = {
  BASE_URL: 'tu-url-aqui',
  HEADERS: { 'Content-Type': 'application/json' }
}
```

## 📱 Características Implementadas

✅ **Página Principal (Home)**
- Búsqueda de juegos
- Paginación
- Listado de juegos recientes
- Juegos mejor puntuados

✅ **Detalle de Juego (GameDetail)**
- Información completa del juego
- Sistema de reseñas
- Formulario para crear reseña
- Estrellas interactivas

✅ **Autenticación**
- Página de Login
- Página de Registro
- Validaciones de formularios

✅ **Accesibilidad**
- Modo daltónico
- Tema oscuro automático
- Navegación por teclado
- ARIA labels

## 🔧 Troubleshooting

### La API no conecta
- Verifica que el servidor esté corriendo en `http://localhost:9090`
- Revisa la consola del navegador para errores CORS

### El tema no cambia
- Verifica que `localStorage` esté habilitado
- Recarga la página después de cambiar el tema

### Modo daltónico no funciona
- La clase `colorblind-mode` debe agregarse a `body`
- Verifica el CSS en `colorblind-mode.css`

## 📖 Recursos

- [Vue 3 Docs](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)

## ✨ Próximos Pasos (Opcional)

- Agregar tests con Vitest
- Implementar PWA
- Agregar TypeScript
- Optimizar imágenes
- Agregar lazy loading
