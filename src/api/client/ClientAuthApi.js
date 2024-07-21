import api from "@/lib/axios";

export default {
    logout() {
        return api.get('/logout/')
    }
}