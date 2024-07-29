import { inject } from "vue";
import { useI18n } from "vue-i18n";

export function useGlobalHelpers() {
    const { t } = useI18n()
    const toast = inject('toast')

    const getPermissions = () => JSON.parse(localStorage.getItem('P')) || []
    const can = (action, model) => {
        const permissions = getPermissions()
        for (let index = 0; index < permissions.length; index++) {
            if(permissions[index].action === action && permissions[index].model === model)
                return true //could be id too
        }
        return false
    }
    const canAny = (action, models) => {
        for (let i = 0; i < models.length; i++) {
            if(can(action, models[i]))
                return true
        }
        return false
    }
    const canAll = (action, models) => {
        for (let i = 0; i < models.length; i++) {
            if(!can(action, models[i]))
                return false
        }
        return true
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
        $canAny: canAny,
        $canAll: canAll,
        $t: t,
        $toast: toast,
        $toastError: toastError
    }
}