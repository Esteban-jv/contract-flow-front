import axios from "axios";
import domain from "@/utils/domain";

const subdomain = domain.getSubdomain()

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_ENVIROMENT}${subdomain}.${import.meta.env.VITE_API_DOMAIN}`
})

export default api