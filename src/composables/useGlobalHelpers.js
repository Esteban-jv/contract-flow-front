import { inject } from "vue";
import { useI18n } from "vue-i18n";

export function useGlobalHelpers() {
    const { t } = useI18n()
    const toast = inject('toast')

    const can = (permission) => {
        console.log("check for", permission)
    }

    return {
        $can: can,
        $t: t,
        $toast: toast
    }
}