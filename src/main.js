import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import domain from './utils/domain'

import App from './App.vue'
import master from './router/master'
import tenant from './router/tenant'

const app = createApp(App)
// console.log("D O M A I N data ",domain.isAdmin(), domain.getSubdomain(), domain.getDomain())
const router = domain.isAdmin() ? master : tenant

app.use(createPinia())
app.use(router)

app.mount('#app')
