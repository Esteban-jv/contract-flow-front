const getDomain = () => {
    return window.location.host              // out = localhost:5173
    // return window.location.hostname       // out = localhost
}
const host = () => getDomain().split('.')
  
export default {
    getDomain,
    isAdmin: () => host().length === 1,
    getSubdomain: () => host()[0]
}
  