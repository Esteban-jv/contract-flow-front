import { ref, computed, reactive } from "vue";
import { useGlobalHelpers } from "./useGlobalHelpers";
import { useLoadingBar } from "naive-ui";
import api from "@/lib/axios";

export function useResource() {
    // Helpers
    const { $t, $toast } = useGlobalHelpers()
    const loadingBar = useLoadingBar()
    // Data
    const isLoading = ref(false)
    // For pagination
    const pageSizes = ref([5, 10, 20, 50])
    const MAX_OPTION_ITEMS = ref(50)
    const pagination = reactive({
        pageSize:5,
        page:1
    })
    const items = ref([])
    // Methos
    const getResource = async endpoint => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${endpoint}/`, {
                params: {
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize
                }
            })
            items.value = data.results
            pagination.itemCount = data.count
            pagination.pageCount = Math.ceil(data.count / pagination.pageSize)
            loadingBar.finish()
        } catch (err) {
            // console.error(err)
            loadingBar.error()
            $toast.open({
                message: $t('forms.something_went_wrong'),
                type: 'error'
            })
        } finally { isLoading.value = false }
    }
    const mapColumns = fields => {
        return fields.map((f) => {
            // Get field
            const name = f.field
            const translated = f.translated

            // Set Table Columns
            var current = {
                align: f.table.align,
                title: $t(translated),
                key: name
            }
            if(f.rules.type === Boolean) {
                current.render = ((row) => row.status ? 
                    renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                    renderIcon(TimesCircle, { color: '#D50049'}))
            }
            return current
        })
    }

    
    return {
        loadingBar,
        isLoading,
        items,
        MAX_OPTION_ITEMS,
        getResource,
        mapColumns
    }
}