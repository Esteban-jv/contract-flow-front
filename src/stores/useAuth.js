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

            permissions.value = []
            const response = await AuthApi.login(payload)
            const { data: { token, user } } = response
            const { groups, user_permissions } = user

            console.warn(groups, user_permissions, user, permissions.value)
            /*if(!groups.length && !user_permissions.length) {
                $toastError({
                    response: { data: { detail: $t('errors.user_without_permissions') } }
                })
                loadingBar.error()
                return false
            }*/

            localStorage.setItem('AUTH_TOKEN',token)
            localStorage.setItem('USER',JSON.stringify({
                first_name: user.first_name,
                last_name: user.last_name
            }))

            groups.forEach(g => {
                g.permissions.forEach( p => permissions.value.push(p))
            })
            user_permissions.forEach(up => permissions.value.push(up))
            localStorage.setItem('P',JSON.stringify(permissions.value))

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