import api from "@/lib/axios";

export default {
    logout() {
        return api.get('/logout/')
    },
    removeToken() {
        localStorage.removeItem('AUTH_TOKEN')
        localStorage.removeItem('USER')
        localStorage.removeItem('P')
    }
}