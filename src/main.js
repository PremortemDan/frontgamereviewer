import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import Global Styles
import './assets/styles/main.css'
import './assets/styles/ux-styles.css'
import './assets/styles/colorblind-mode.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
