import api from "@/lib/axios";

export default {
    getClients() {
        return api.get('/client/')
    }
}