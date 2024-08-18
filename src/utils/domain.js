const getDomain = () => {
    return window.location.host              // out = localhost:5173
    // return window.location.hostname       // out = localhost
}
const host = () => getDomain().split('.')
  
export default {
    getDomain,
    isAdmin: () => host().length === import.meta.env.VITE_API_DOMAIN.split('.').length,
    getSubdomain: () => host()[0]
}
  