<script setup>
    import { ref, h, onMounted, reactive, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { NDataTable, NIcon, NButton, NFlex,
        NPagination, useLoadingBar } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Edit, Info } from '@vicons/fa';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import api from "@/lib/axios";

    const props = defineProps({
        model: {
            type: String,
            required: true
        },
        permissionModel: {
            type: String,
            required: false
        },
        endpoint: {
            type: String,
            required: true
        },
        fields: {
            type: Array,
            required: true
        }
    })

    const permission = computed(() => props.permissionModel ?? props.model)

    // States and Composables
    const router = useRouter()
    const { $t, $toast, $can } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    // Data
    const isLoading = ref(false)

    // Aux Methods
    const renderIcon = (icon, props={}) => h(NIcon, null, { default: () => h(icon, props) });
    const updatePage = page => {
        pagination.page = page
        getResource()
    }
    const updatePageSize = size => {
        pagination.pageSize = size
        resetResource()
    }

    // For table
    const columns = ref([])
    const items = ref([])
    // For pagination
    const pageSizes = ref([5, 10, 20, 50])
    const pagination = reactive({
        pageSize:5,
        page:1
    })

    const edit = async row => {
        console.log("Go to edit",row)
    }
    const GoToDetails = async () => {
        console.log("Go to create")
        router.push({ name: `add-${props.model}`})
    }
    // Get All
    const getResource = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${props.endpoint}/`, {
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
    const resetResource = async () => {
        pagination.page = 1
        await getResource()
    }

    const computedColumns = computed( () => {
        const cols = props.fields.map((f) => {
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

        // Add actions column to a table
        if($can('change',permission.value)) {
            cols.push({
                align: 'center',
                title: $t('tables.edit'),
                render(row) {
                    return h(
                        NButton,
                        {
                            disabled: !$can('change',permission.value),
                            size: "small",
                            secondary: true,
                            type:"info",
                            onClick: () => edit(row),
                            renderIcon: () => renderIcon(Info, { color: '--n-color'} )
                        },
                    );
                },
                key: "edit",
            })
        }

        return cols
    })

    onMounted(async () => {
        getResource()
    })
</script>
<template>
    <NFlex justify="end" class="py-3">
        <NButton @click="GoToDetails(true)">
            {{ $t('tables.add_new', { item: $t(props.model)}) }}
        </NButton>
    </NFlex>
    <div class="w-full">
        <NDataTable
            :bordered="false"
            :single-line="false"
            single-column
            :columns="computedColumns"
            :data="items"
        />
        <NFlex justify="end" class="mt-3">
            <NPagination
                v-model:page="pagination.page"
                :page-count="pagination.pageCount"
                :page-size="pagination.pageSize"
                :show-size-picker="true"
                :page-sizes="pageSizes"
                @update-page="updatePage(pagination.page)"
                @update-page-size="updatePageSize($event)"
            />
        </NFlex>
    </div>
</template>