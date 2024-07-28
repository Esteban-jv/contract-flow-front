import { ref, onMounted, computed, onScopeDispose } from "vue";
import { defineStore } from "pinia";
import { useLoadingBar } from "naive-ui";
import AuthApi from '@/api/AuthApi';
import { useGlobalHelpers } from '@/composables/useGlobalHelpers';

export const useAuth = defineStore('useAuth', () => {
    // Dependecies
    const { $t, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    // Data
    const permissions = ref([])
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
                last_name: user.last_name
            }))
            console.log("asd", user.groups)
            localStorage.setItem('P',JSON.stringify(
                user.groups.map(g => g.permissions.map( p => p))[0]
            ))
            console.log("asd")
            loadingBar.finish()
            return true
        } catch (err) {
            $toastError(err)
            loadingBar.error()
            return err
        }
        
    }
    function getUser() {
        return JSON.parse(localStorage.getItem('USER'))
    }
    function getPermissions() {
        const user = getUser()
        permissions.value = []
        if(user) {
            const { roles } = user
            roles.forEach(r => {
                permissions.value.push(r.permissions)
            })
        }
        return permissions.value
    }

    // Computed

    // onMounted
    /*onScopeDispose(() => {
        getPermissions()
    })*/

    return {
        // nextView,
        permissions,
        getToken,
        login,
        getPermissions
    }
})