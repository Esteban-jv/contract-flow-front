import { ref, onMounted, inject } from "vue";
import { defineStore } from "pinia";

export const usePreferences = defineStore('preferences', () => {
    // Mounted
    onMounted(() => {
        initColorTheme()
        setLocaleInStorage()
    })

    // Data
    const themeIcon = ref('')
    const i18n = inject('i18n')

    const initColorTheme = () => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkTheme()
        } else {
            setLightTheme()
        }
    }
    const setLightTheme = () => {
        themeIcon.value = 'light'
        document.documentElement.classList.remove('dark');
    }
    const setDarkTheme = () => {
        themeIcon.value = 'dark'
        document.documentElement.classList.add(themeIcon.value);
    }

    // Methods
    function toggleMode() {
        console.warn(themeIcon.value)
        if(themeIcon.value === 'dark') {
            setLightTheme()
        }
        else {
            setDarkTheme()
        }
        localStorage.setItem('color-theme', themeIcon.value);
    }
    function setLocaleInStorage() {
        localStorage.setItem('lang', i18n.global.locale || 'en');
    }

    // Computed

    return {
        themeIcon,
        i18n,
        toggleMode,
        setLocaleInStorage
    }
})