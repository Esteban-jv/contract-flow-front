<script setup>
    import { ref, h, onMounted, reactive, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { NDataTable, NIcon, NButton, NFlex,
        NPagination, useLoadingBar, NModal, NText,
        NCard, NInput, NSpace, 
        NSkeleton} from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Edit, Info, Search } from '@vicons/fa';
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
        },
        filters: {
            type: Boolean,
            required: false,
            default: false
        }
    })

    const activityFields = ref([
        {
            field: "history_user.first_name",
            translated: "user",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        /*{
            field: "history_type",
            translated: "tables.action",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },*/
        {
            field: "history_date",
            translated: "tables.date",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        }
    ])

    /* new things here */
    const showModal = ref(false)
    const handleShowModal = async (row) => {
        showModal.value = true
        // api get from history
        const { data } = await api.get(`historical-${props.endpoint}/${row.id}/`,{
            params: {
                limit: 100
            }
        })
        historyRecords.value = data.results
    }
    const closeModal = () => {
        showModal.value = false
        setTimeout(() => historyRecords.value = [], 200)
    }
    const localFields = computed(() => activityFields.value.concat(props.fields))

    const permission = computed(() => props.permissionModel ?? props.model)
    const objectFields = computed(() => props.fields.filter(f => !!f.table.text))

    // States and Composables
    const router = useRouter()
    const { $t, $toast, $can } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    // Data
    const isLoading = ref(false)
    const search = ref('')

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
    const handleKeyUp = (e) => {
        if (e.key === 'Enter') getResource()
    }

    // For table
    const columns = ref([])
    const items = ref([])
    const historyRecords = ref([])
    // For pagination
    const pageSizes = ref([5, 10, 20, 50])
    const pagination = reactive({
        pageSize:5,
        page:1
    })

    const displayHistory = async row => {
        handleShowModal(row)
    }
    const itemData = (current, fields) => {
        fields.forEach(f => {
            const { field, table } = f
            if(current[field]) {
                // we need to get the value from the object by table.text which contains the field name like 'sales_room.name'
                const fieldz = table.text.split('.')
                current[field] = fieldz.reduce((acc, val) => acc[val], current)
            }
        })
        return current
    }
    // Get All
    const getResource = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`/${props.endpoint}/`, {
                params: {
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize,
                    all: true,
                    search: search.value
                }
            })
            items.value = objectFields.value.length ? data.results.map( r => itemData(r, objectFields.value) ) : data.results
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
    const resetResource = async (clear_filters=false) => {
        pagination.page = 1
        if(clear_filters) search.value = ''
        await getResource()
    }

    const mapColumns = withOptions => {
        var cols = withOptions ? props.fields : localFields.value
        cols = cols.map((f) => {
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
                current.render = ((row) => row[name] ? 
                    renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                    renderIcon(TimesCircle, { color: '#D50049'}))
            }
            return current
        })

        // Add actions column to a table
        if($can('change',permission.value) && withOptions) {
            cols.push({
                align: 'center',
                title: $t('history'),
                render(row) {
                    return h(
                        NButton,
                        {
                            disabled: !$can('change',permission.value),
                            size: "small",
                            secondary: true,
                            type:"info",
                            onClick: () => displayHistory(row),
                            renderIcon: () => renderIcon(Info, { color: '--n-color'} )
                        },
                    );
                },
                key: "history",
            })
        }

        return cols
    }

    const computedColumns = computed( () => {
        return mapColumns(true)
    })
    const computedHistoryColumns = computed( () => {
        return mapColumns(false)
    })

    const computedHistoryRecords = computed(() => {
        return historyRecords.value.map( r => itemData(r, objectFields.value) )
        // return historyRecords.value
    })

    onMounted(async () => {
        getResource()
    })

    const renderCell = (value, rowData, column) => {
        // console.log(value, rowData, column)
        var cellClass= 'same'
        
        if (rowData.history_type === '+') {
            cellClass = "new-record";
        }
        else if (rowData.history_type === '-') {
            cellClass = "deleted-record";
        }
        else if(rowData.history_type === '~' && rowData['deleted_at'] != null) {
            cellClass = "deleted-record";
        }
        else {
            const prev = historyRecords.value[historyRecords.value.indexOf(rowData) + 1]
            // console.log("not +-",prev, value, rowData)
            if (prev) {
                // check current field against previous record
                const field = column.key
                if (prev[field] === rowData[field]) {
                    cellClass = "same"
                } else {
                    if (!prev[field] && value)
                        cellClass = "plus";
                    else if (prev[field] && !value)
                        cellClass = "less";
                    else
                        cellClass = "change";
                }
            }
        }

        if (!value) {
            return h(NText, { deep: 1, class:cellClass+' italic' }, { default: () => `(${$t('none')})` })
        }
        // return value;
        return h(NText, { deep: 1, class:cellClass }, { default: () => value })
    }
</script>
<template>
    <NCard class="my-2" v-if="props.filters">
        <NSpace justify="space-between">
            <NInput
                v-model:value="search"
                :placeholder="$t('search')"
                size="large"
                class="w-full"
                :passively-activated="true"
                :loading="isLoading"
                @keyup="handleKeyUp"
            />
            <div class="flex gap-2">
                <NButton @click="getResource()" strong secondary type="info">
                    {{ $t('search') }}
                </NButton>
                <NButton @click="resetResource(true)" strong secondary>
                    {{ $t('all') }}
                </NButton>
            </div>
        </NSpace>
    </NCard>
    <NModal
            class="overflow-auto min-w-[98%]"
            v-model:show="showModal"
            :mask-closable="false"
            size="extra-large"
        >
            <NCard
                style="width: 600px; max-width: 90%;"
                :title="$t('history')"
                :bordered="false"
                role="dialog"
                aria-modal="true"
                content-class="p1"
                header-class="p1"
            >
            <template #header-extra>
                <NButton size="tiny" secondary type="tertiary" @click="closeModal()">
                    <NIcon>
                        <Times />
                    </NIcon>
                </NButton>
            </template>
            <!-- squeleton -->
             <div v-if="isLoading || !historyRecords.length" class="w-full flex flex-col gap-2">
                <NSkeleton height="40px" width="100%"  />
                <NSkeleton :repeat="3" :sharp="false" size="medium" />
            </div>
            <NDataTable
                v-else
                :bordered="false"
                :single-line="false"
                single-column
                :columns="computedHistoryColumns"
                :data="computedHistoryRecords"
                :renderCell=renderCell
                ></NDataTable>
            </NCard>
    </NModal>
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
<style scoped>
    :deep(.same) {
        font-style: italic!important;
    }
    :deep(.new-record) {
        color: rgba(0, 128, 0, 1) !important;
        opacity: 1;
        /* font-weight: bold; */
    }
    :deep(.deleted-record) {
        color: rgba(70, 70, 70, 0.75) !important;
    }
    :deep(.less) {
        color: rgba(255, 0, 0, 0.5) !important;
        opacity: 0.5;
    }
    :deep(.change) {
        color: rgba(255, 255, 0, 1) !important;
    }
    :deep(.plus) {
        color: rgba(0, 255, 0, 1) !important;
        font-weight: bold;
    }
</style>0