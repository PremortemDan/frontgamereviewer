Videogames Reviews App (Vue 3)

Una aplicación moderna de reseñas de videojuegos construida con **Vue 3**, **Vite**, **Bootstrap 5** y conectada a una API REST.

## 🚀 Características

- ✅ **Frontend moderno** con Vue 3 Composition API
- ✅ **Diseño responsivo** con Bootstrap 5
- ✅ **Búsqueda y paginación** de juegos
- ✅ **Sistema de reseñas** de usuarios
- ✅ **Autenticación** (Login/Register)
- ✅ **Modo daltónico** para accesibilidad
- ✅ **Tema oscuro automático**
- ✅ **Animaciones suaves** con CSS y Vite
- ✅ **Rutas dinámicas** con Vue Router

## 📦 Instalación

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
cd /home/dandev/Documentos/PINOS/front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Construir para producción**
```bash
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Layout.vue       # Layout principal con navbar y footer
│   └── GameCard.vue     # Tarjeta de juego
├── composables/         # Lógica reutilizable (hooks de Vue)
│   ├── useApi.js        # Servicios de API
│   ├── useTheme.js      # Gestión de temas
│   ├── useColorblindMode.js # Modo daltónico
│   ├── useStars.js      # Utilidades para estrellas
│   └── useParticles.js  # Partículas de fondo
├── views/               # Vistas/páginas
│   ├── Home.vue         # Página principal
│   ├── Login.vue        # Página de login
│   ├── Register.vue     # Página de registro
│   └── GameDetail.vue   # Detalle del juego
├── router/
│   └── index.js         # Configuración de rutas
├── assets/styles/       # Estilos globales
│   ├── main.css         # Estilos principales
│   ├── ux-styles.css    # Mejoras de UX
│   └── colorblind-mode.css # Modo daltónico
└── main.js              # Punto de entrada
```

## 🔌 Configuración de API

La aplicación se conecta a un API REST en `http://localhost:9090/api`

### Endpoints principales:
- `GET /api/juegos` - Obtener todos los juegos
- `GET /api/juegos/{id}` - Obtener detalle de un juego
- `GET /api/resenas/juego/{id}` - Obtener reseñas de un juego
- `POST /api/resenas` - Crear una reseña
- `POST /auth/login` - Login
- `POST /auth/register` - Registro

## 🛠️ Tecnologías

- **Vue 3** - Framework progresivo
- **Vue Router 4** - Enrutamiento
- **Pinia** - State management
- **Vite** - Build tool
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **tsParticles** - Animación de partículas

## 📱 Características de Accesibilidad

- 🎨 **Modo daltónico** - Paleta de colores optimizada
- 🌓 **Tema automático** - Detecta preferencias del sistema
- ⌨️ **Navegación por teclado** - Totalmente accesible
- 📖 **ARIA labels** - Semántica correcta

## 🚀 Despliegue

Para desplegar en producción:

```bash
npm run build
# Los archivos compilados están en la carpeta 'dist/'
```

## 📝 Licencia

© 2023 PINOS - Todos los derechos reservados.
