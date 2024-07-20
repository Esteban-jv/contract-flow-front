import api from "@/lib/axios";

export default {
    login(data) {
        return api.post('/login/', data)
    }/*
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