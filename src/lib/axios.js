import axios from "axios";
import domain from "@/utils/domain";

const subdomain = domain.getSubdomain()

const getBaseURL = () => {
    if(domain.isAdmin())
        return `${import.meta.env.VITE_API_ENVIROMENT}${import.meta.env.VITE_API_DOMAIN}`
    else
        return `${import.meta.env.VITE_API_ENVIROMENT}${subdomain}.${import.meta.env.VITE_API_DOMAIN}`
}

const api = axios.create({
    baseURL: getBaseURL()
})

api.interceptors.request.use( (config) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Token ${token}`
    }
    return config
})

export default api