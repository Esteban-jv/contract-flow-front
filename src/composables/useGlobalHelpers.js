import { inject } from "vue";
import { useI18n } from "vue-i18n";

export function useGlobalHelpers() {
    const { t } = useI18n()
    const toast = inject('toast')

    const can = (permission) => {
        console.log("check for", permission)
    }

    const toastError = err => {
        if(err.response)
        {
            if(err.response.data) {
                const { data } = err.response
                if(data.length) {
                    const arrErr = Object.entries(data)
                    arrErr.forEach( e => {
                        toast.open({
                            message: `${ t('tables.'+e[0])}: ${e[1]}`,
                            type: 'error'
                        })
                    })
                } else if (data.detail) {
                    toast.open({
                        message: data.detail,
                        type: 'error'
                    })
                } else if (typeof(data === String)) {
                    toast.open({
                        message: data,
                        type: 'error'
                    })
                }
            }
        } else {
            toast.open({
                message: t('forms.something_went_wrong'),
                type: 'error'
            })
        }
    }
            
            
        

    return {
        $can: can,
        $t: t,
        $toast: toast,
        $toastError: toastError
    }
}