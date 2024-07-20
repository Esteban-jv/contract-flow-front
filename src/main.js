import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

import App from './App.vue'
import master from './router/master'
import tenant from './router/tenant'

import domain from './utils/domain'
import en from './lang/en.json'
import es from './lang/es.json'

const $i18n = createI18n({
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        es
    }
})

const app = createApp(App)
// console.log("D O M A I N data ",domain.isAdmin(), domain.getSubdomain(), domain.getDomain())
const router = domain.isAdmin() ? master : tenant

app.provide('i18n',$i18n)
app.use($i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
