import { createI18n } from "vue-i18n";
import en from '@/lang/en.json'
import es from '@/lang/es.json'

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem('lang') || window.navigator.language.substring(0, 2) || 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        es
    }
})