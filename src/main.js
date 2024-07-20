import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useToast } from 'vue-toast-notification'

import App from './App.vue'
import master from './router/master'
import tenant from './router/tenant'

import domain from './utils/domain'
import { i18n } from './plugins/i18n'

// import "vue-toast-notification/dist/theme-default.css"
import "vue-toast-notification/dist/theme-bootstrap.css"

const $toast = useToast({
    duration: 2000,
    position: 'top-right',
    hideProgressBar: true
})
const i18nPlugin = {
    install(app) {
        app.config.globalProperties.$t = i18n.global.t
    }
}

const app = createApp(App)
// console.log("D O M A I N data ",domain.isAdmin(), domain.getSubdomain(), domain.getDomain())
const router = domain.isAdmin() ? master : tenant

app.provide('toast',$toast)
// app.config.globalProperties.$t = i18n.global.t

app.use(i18n)
app.use(i18nPlugin)
app.use(createPinia())
app.use(router)

app.mount('#app')
