import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import { i18n } from '@/plugins/i18n';

export const usePreferences = defineStore('preferences', () => {
    // Mounted
    onMounted(() => {
        initColorTheme()
        setLocaleInStorage()
    })

    // Data
    const theme = ref('')

    const initColorTheme = () => {
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkTheme()
        } else {
            setLightTheme()
        }
    }
    const setLightTheme = () => {
        theme.value = 'light'
        document.documentElement.classList.remove('dark');
    }
    const setDarkTheme = () => {
        theme.value = 'dark'
        document.documentElement.classList.add(theme.value);
    }

    // Methods
    function toggleMode() {
        // console.warn(theme.value)
        if(theme.value === 'dark') {
            setLightTheme()
        }
        else {
            setDarkTheme()
        }
        localStorage.setItem('color-theme', theme.value);
    }
    function setLocaleInStorage() {
        // console.warn(i18n.global.locale.value)s
        localStorage.setItem('lang', i18n.global.locale.value || 'en');
    }

    // Computed
    const switchTheme = computed({
        get() {
            return theme.value === 'dark'
        },
        set(n) {
            if(n)   { theme.value = 'light '}
            else    { theme.value = 'dark'  }
            toggleMode()
        }
    })
    

    return {
        theme,
        i18n,
        toggleMode,
        setLocaleInStorage,
        switchTheme
    }
})