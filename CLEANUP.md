# Limpieza de Datos Locales

Para eliminar todos los datos falsos y locales del navegador, ejecuta esto en la consola:

```javascript
// Eliminar todos los datos mock de localStorage
localStorage.removeItem('app_users')
localStorage.removeItem('app_reviews')
localStorage.removeItem('app_games')

// Mantener solo datos de autenticación
// localStorage.getItem('userToken')
// localStorage.getItem('currentUser')
```

## Cambios Realizados

### useApi.js
- ✅ Eliminados todos los fallbacks a localStorage
- ✅ Eliminadas funciones `saveUsers()` y `saveReviews()`
- ✅ Eliminadas variables `localUsers` y `localReviews`
- ✅ Eliminada bandera `ENABLE_MOCK_DATA`
- ✅ Todos los métodos ahora lanzan errores en lugar de retornar null

### useGamesAPI()
- ✅ Métodos directos sin fallback local

### useReviewsAPI()
- ✅ Métodos directos sin fallback local
- ✅ Eliminados fallbacks a localStorage.getItem('app_reviews')

### useAuthAPI()
- ✅ Solo hace login/register contra API
- ✅ Mantiene tokens en localStorage (para sesión del usuario)

### useUsersAPI()
- ✅ Métodos directos sin fallback local
- ✅ Eliminados fallbacks a localStorage.getItem('app_users')

### AdminUsers.vue
- ✅ Eliminada lógica de creación de datos mock iniciales
- ✅ Ahora depende 100% de la API

## Requisitos

Ahora **OBLIGATORIAMENTE** necesitas que tu backend esté ejecutándose en `http://localhost:9090/api`

Si no está corriendo, la aplicación mostrará errores y NO podrá funcionar.

## URLs de API Esperadas

- `GET /juegos` - Listar todos los juegos
- `GET /juegos/{id}` - Obtener juego por ID
- `POST /juegos` - Crear juego
- `PUT /juegos/{id}` - Actualizar juego
- `DELETE /juegos/{id}` - Eliminar juego

- `GET /reviews` - Listar todas las reviews
- `POST /reviews` - Crear review
- `PUT /reviews/{id}` - Actualizar review
- `DELETE /reviews/{id}` - Eliminar review

- `POST /usuarios` - Registrar nuevo usuario
- `POST /usuarios/login` - Login
- `POST /usuarios/logout` - Logout
- `GET /usuarios` - Listar usuarios
- `GET /usuarios/{id}` - Obtener usuario
- `PUT /usuarios/{id}` - Actualizar usuario
- `DELETE /usuarios/{id}` - Eliminar usuario
