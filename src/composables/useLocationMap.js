import { ref } from 'vue';
export default function useLocationMap() {

    const zoom = ref(15)
    const center = ref([20.50956, -87.2299585])

    function pin(e) {
        console.log(e.target.getLatLng())
        const marker = e.target.getLatLng()
        const c = [marker.lat, marker.lng]
        console.warn(c)
        return c
    }

    return {
        //vars
        zoom,
        center,
        //methods
        pin
        //computed
    }
}