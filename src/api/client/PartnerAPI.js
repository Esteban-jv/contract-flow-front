import api from "@/lib/axios";

export default {
    getLanguages() {
        return api.get('/language/')
    },
    getNationalities() {
        return api.get('/nationality/')
    },
    getOficialIds() {
        return api.get('/id/')
    },
    /*login(data) {
        return api.post('/auth/login', data)
    },
    verifyAccount(token) {
        return api.get(`/auth/verify/${token}`)
    },
    auth() {
        return api.get('/auth/user')
    },
    admin() {
        return api.get('/auth/admin')
    },
    forgotPassword(data) {
        return api.post('/auth/forgot-password', data)
    },
    veirfyPasswordResetToken(token) {
        return api.get(`/auth/forgot-password/${token}`)
    },
    updatePassword(token, data) {
        return api.post(`/auth/forgot-password/${token}`, data)
    }*/
}