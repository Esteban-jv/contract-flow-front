import api from "@/lib/axios";

export default {
    login(data) {
        return api.post('/login/', data)
    },
    auth() {
        return api.get('/auth/user/')
    },
    logout() {
        return api.post('/logout/')
    }
}