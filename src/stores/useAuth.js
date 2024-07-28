import { ref, onMounted, computed } from "vue";
import { defineStore } from "pinia";
import { useLoadingBar } from "naive-ui";
import AuthApi from '@/api/AuthApi';
import { useGlobalHelpers } from '@/composables/useGlobalHelpers';

export const useAuth = defineStore('useAuth', () => {
    // Dependecies
    const { $t, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    // Data
    // const nextView = ref('')

    // Methods
    function getToken() {
        localStorage.getItem('AUTH_TOKEN')
    }
    async function login(payload) {
        try {
            loadingBar.start()

            const response = await AuthApi.login(payload)
            const { data: { token, user } } = response

            localStorage.setItem('AUTH_TOKEN',token)
            localStorage.setItem('USER',JSON.stringify({
                first_name: user.first_name,
                last_name: user.last_name,
                roles: user.groups
            }))

            loadingBar.finish()
            return true
        } catch (err) {
            $toastError(err)
            loadingBar.error()
            return err
        }
        
    }

    // Computed

    return {
        // nextView,
        getToken,
        login
    }
})