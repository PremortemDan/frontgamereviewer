# 🚀 Quick Start - Ejemplos Prácticos

## 1️⃣ Agregar una Nueva Vista

```vue
<!-- src/views/MyNewView.vue -->
<template>
  <div class="container">
    <h1>Mi Nueva Vista</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('¡Hola Vue 3!')
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

Luego agregar en `src/router/index.js`:
```javascript
import MyNewView from '../views/MyNewView.vue'

const routes = [
  // ...
  {
    path: '/new',
    name: 'MyNewView',
    component: MyNewView
  }
]
```

---

## 2️⃣ Usar la API en un Componente

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useGamesAPI } from '@/composables/useApi'

const gamesAPI = useGamesAPI()
const games = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    games.value = await gamesAPI.getAll()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="spinner">Cargando...</div>
  <ul v-else>
    <li v-for="game in games" :key="game.id">
      {{ game.titulo }}
    </li>
  </ul>
</template>
```

---

## 3️⃣ Crear un Componente Reutilizable

```vue
<!-- src/components/MyCard.vue -->
<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button @click="$emit('click')">{{ buttonText }}</button>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  buttonText: { type: String, default: 'Click' }
})

defineEmits(['click'])
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
```

Usar en otro componente:
```vue
<MyCard 
  title="Mi Tarjeta"
  description="Descripción"
  @click="handleClick"
/>
```

---

## 4️⃣ Usar Composable Personalizado

```javascript
// src/composables/useCounter.js
import { ref } from 'vue'

export const useCounter = (initialValue = 0) => {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return { count, increment, decrement, reset }
}
```

Usar en componente:
```vue
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement } = useCounter()
</script>

<template>
  <div>
    <p>Contador: {{ count }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

---

## 5️⃣ Navegar entre Rutas

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navegar
const goHome = () => router.push('/')
const goToGame = (id) => router.push({ name: 'GameDetail', params: { id } })

// Obtener parámetro actual
const currentId = route.params.id
</script>

<template>
  <RouterLink to="/">Inicio</RouterLink>
  <button @click="goHome">Ir a Inicio</button>
</template>
```

---

## 6️⃣ Datos Reactivos y Computed

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Juan')
const lastName = ref('Pérez')

// Computed: se actualiza automáticamente
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// Watcher: escuchar cambios
import { watch } from 'vue'
watch(firstName, (newVal) => {
  console.log(`Nombre cambió a: ${newVal}`)
})
</script>

<template>
  <p>{{ fullName }}</p>
  <input v-model="firstName" />
</template>
```

---

## 7️⃣ Condicionales y Loops

```vue
<template>
  <!-- if/else con v-if -->
  <div v-if="isLoading">Cargando...</div>
  <div v-else-if="hasError">Error: {{ error }}</div>
  <div v-else>Contenido</div>

  <!-- Mostrar/ocultar con v-show -->
  <div v-show="isVisible">Visible si isVisible es true</div>

  <!-- Loops con v-for -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }}: {{ item.name }}
    </li>
  </ul>
</template>
```

---

## 8️⃣ Formularios

```vue
<template>
  <form @submit.prevent="submitForm">
    <!-- Text input -->
    <input v-model="form.name" type="text" placeholder="Nombre" />

    <!-- Textarea -->
    <textarea v-model="form.message"></textarea>

    <!-- Checkbox -->
    <input v-model="form.agree" type="checkbox" /> Acepto términos

    <!-- Radio -->
    <input v-model="form.gender" type="radio" value="M" /> Hombre
    <input v-model="form.gender" type="radio" value="F" /> Mujer

    <!-- Select -->
    <select v-model="form.country">
      <option value="">Selecciona país</option>
      <option value="es">España</option>
      <option value="mx">México</option>
    </select>

    <button type="submit">Enviar</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  message: '',
  agree: false,
  gender: '',
  country: ''
})

const submitForm = () => {
  console.log('Form data:', form.value)
}
</script>
```

---

## 9️⃣ Event Handling

```vue
<template>
  <!-- Click -->
  <button @click="handleClick">Click me</button>

  <!-- Click con argumento -->
  <button @click="handleClick('hello')">Con argumento</button>

  <!-- Modificadores -->
  <button @click.stop="handleClick">Stop propagation</button>
  <button @click.prevent="handleClick">Prevent default</button>
  <button @click.once="handleClick">Solo una vez</button>

  <!-- Teclas -->
  <input @keyup.enter="submit" placeholder="Presiona Enter" />
  <input @keyup.escape="cancel" />

  <!-- Mouse -->
  <div @mouseover="onHover" @mouseleave="onLeave">
    Hover aquí
  </div>
</template>

<script setup>
const handleClick = (arg = null) => {
  console.log('Click!', arg)
}

const submit = () => console.log('Submitted')
const cancel = () => console.log('Cancelled')
const onHover = () => console.log('Hovering')
const onLeave = () => console.log('Left')
</script>
```

---

## 🔟 Slots (Contenido Flexible)

Componente:
```vue
<!-- src/components/Card.vue -->
<template>
  <div class="card">
    <slot name="header">Encabezado por defecto</slot>
    <slot>Contenido por defecto</slot>
    <slot name="footer">Pie por defecto</slot>
  </div>
</template>
```

Uso:
```vue
<Card>
  <template #header>Mi Encabezado</template>
  <p>Mi contenido</p>
  <template #footer>Mi Pie</template>
</Card>
```

---

## Tips & Tricks

### ✨ Renderizado Condicional de Listas

```vue
<!-- Mostrar mensaje si lista está vacía -->
<template v-if="items.length > 0">
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
<template v-else>
  <p>No hay items</p>
</template>
```

### 🔄 Filtrar y Mapear

```javascript
// En script
const filteredItems = computed(() => {
  return items.value
    .filter(item => item.active)
    .map(item => ({ ...item, upper: item.name.toUpperCase() }))
})
```

### 💾 Persistir en localStorage

```javascript
import { ref, watch } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'light')

watch(theme, (newValue) => {
  localStorage.setItem('theme', newValue)
})
```

### 🎯 Ref vs Reactive

```javascript
// Ref - para valores primitivos
const count = ref(0)
count.value++ // acceso con .value

// Reactive - para objetos
const user = reactive({ name: 'Juan', age: 30 })
user.name = 'Pedro' // acceso directo
```

---

## 🆘 Debugging

```javascript
// Console logs
console.log('Value:', myVar)
console.table(arrayOfObjects)
console.time('myTimer') // ... console.timeEnd('myTimer')

// Vue DevTools en navegador
// Instala la extensión de Chrome/Firefox

// Breakpoints en editor
// Presiona F12 y busca en Sources tab
```

---

## 📚 Recursos

- [Vue 3 API Reference](https://vuejs.org/api/)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [Vite Docs](https://vitejs.dev/guide/)
- [Bootstrap 5](https://getbootstrap.com/docs/)

---

¡Ahora estás listo para crear con Vue 3! 🚀
