<script setup>
    import { ref, h, onMounted, reactive, computed } from 'vue';
    import { format as formatDate } from 'date-fns'
    import { NDataTable, NIcon, NButton, NFlex, NModal, NCard, NForm, NGrid, NSelect,
        NFormItemGi, NInput, NInputNumber, NCheckbox, NSkeleton, NSpace, NPagination,
        useLoadingBar, NDatePicker, NTransfer } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Edit } from '@vicons/fa';
    import "leaflet/dist/leaflet.css";
    import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';
    import useLocationMap from '@/composables/useLocationMap';
    import api from "@/lib/axios";
    import DeleteButton from "@/components/DeleteButton.vue"

    const props = defineProps({
        model: {
            type: String,
            required: true
        },
        permissionModel: {
            type: String,
            required: false
        },
        translated: {
            Type: String,
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

    const format= ref("yyyy/MM/dd - HH:mm")
    const handleDateUpdate = (value, field) => {
        console.log(value, field, form.value)
        if (value) {
            const formattedDate = formatDate(new Date(value), format.value)
            console.warn(formattedDate)
            form.value[field] = formattedDate
        }
    }
    // States and Composables
    const { $t, $toast, $toastError, $can } = useGlobalHelpers()
    const { zoom, pin } = useLocationMap()
    const resource = useResource()
    const loadingBar = useLoadingBar()
    const MAX_OPTION_ITEMS = 50

    const translated = computed(() => props.translated ?? props.model)
    const permission = computed(() => props.permissionModel ?? props.model)

    // Data
    const showModal = ref(false)
    const isLoading = ref(false)

    // Aux Methods
    const updatePage = page => {
        pagination.page = page
        getResource()
    }
    const updatePageSize = size => {
        pagination.pageSize = size
        resetResource(props.endpoint)
    }

    // For table
    // const columns = ref([])
    const columns = computed(() => {
        const cols = resource.mapColumns(props.fields)
        console.log(permission.value)
        // Now add Editable columns
        const can_edit = $can('change',permission.value)
        const can_delete = $can('delete',permission.value)
        if(can_edit && can_delete) {
            cols.push({
                key: 'actions',
                align: 'center',
                title: $t('tables.actions'),
                className: "flex justify-around",
                width: '25%',
                render(row) {
                    return [
                        h(
                            NButton,
                            {
                                size: "small",
                                secondary: true,
                                type:"info",
                                onClick: () => edit(row),
                                renderIcon: () => resource.renderIcon(Edit, { color: '--n-color'} )
                            },
                        ),
                        h(
                            DeleteButton,
                            {
                                delete_msg: $t('actions.confirm_msg',{ verb: $t('tables.delete').toLowerCase(), obj: $t(translated.value) }),
                                deleted_msg: $t('messages.deleted_successfully',{ obj: $t(translated.value) }),
                                delete_endpoint: `${props.endpoint}/${row.id}/` ,
                                onObjectDeleted: () => resetResource()
                            }
                        )
                    ]
                }
            })
        } else {
            if(can_edit) {
                cols.value.push({
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
                                renderIcon: () => resource.renderIcon(Edit, { color: '--n-color'} )
                            },
                        );
                    },
                    key: "edit",
                })
            }
            if(can_delete) {
                cols.value.push({
                    align: 'center',
                    title: $t('tables.delete'),
                    render(row) {
                        return h(
                            DeleteButton,
                            {
                                disabled: !$can('delete',permission.value),
                                delete_msg: $t('actions.confirm_msg',{ verb: $t('tables.delete').toLowerCase(), obj: $t(props.model) }),
                                delete_endpoint: `${props.endpoint}/${row.id}/` ,
                                onObjectDeleted: () => getResource()
                            }
                        );
                    },
                    key: "delete",
                })
            }
        }
        return cols
    })
    const items = ref([])
    // For map
    const localPin = ($event, field) => {
        form.value[field] = pin($event)
    }
    // For pagination
    const pageSizes = resource.pageSizes
    const pagination = resource.pagination
    const formRef = ref(null);
    const form = ref({
        id: null
    })
    const formRules = ref({})

    // For Display
    const toggleModal = m => {
        showModal.value = m
        if(m && !form.value.id) {
            props.fields.forEach((f, i) => {
                // Get field
                const name = f.field
                // Set ref of form
                form.value[name] = f.rules.default
                console.log(form.value[name])
            })
        }
        if(!m) {
            form.value = {
                id: null
            }
        }
    }

    // CRUD Methods
    // Get catalogs
    const getFromApi = async endpoint => {
        try {
            const { data } = await api.get(`${endpoint}/`, {
                params: {
                    limit: MAX_OPTION_ITEMS,
                    offset: 0
                }
            })
            return data.results.map( d => { return { label: d.name, value: d.id} })
        } catch (err){
            $toastError(err)
            throw err
        }
    }
    // Show Edit modal
    const edit = async row => {
        try {
            showModal.value = true
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${props.endpoint}/${row.id}/`)
            form.value = data
            loadingBar.finish()
        } catch (err) {
            loadingBar.error()
            $toastError(err)
        } finally {
            isLoading.value = false
        }
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
    // Create and Update
    const createOrUpdateResource = async () => {
        // console.warn(form.value)
        // return
        try {
            isLoading.value = true
            loadingBar.start()
            if (form.value.id) {
                const { data } = await api.put(`${props.endpoint}/${form.value.id}/`,form.value)
            } else {
                const { data } = await api.post(`${props.endpoint}/`,form.value)
            }
            await getResource()
            toggleModal(false)
            loadingBar.finish()
        } catch (err) {
            loadingBar.error()
            $toastError(err)
        } finally {
            isLoading.value = false
        }
    }
    // Submit method
    const saveChanges = () => {
        formRef.value?.validate(
            errors => {
                if(!errors) {
                    createOrUpdateResource()
                } else {
                    // console.log(errors)
                    $toast.open({
                        message: $t('forms.check_all_fields_msg'),
                        type: 'error'
                    })
                }
            }
         )
    }

    onMounted(async () => {
        getResource()
        const rules = await resource.makeRules(props.fields)
        formRules.value = rules
        // console.log(rules)
        console.log(formRules.value['hostesses'])
    })

    const generalOptions = ref(["groode", "veli good", "emazing", "lidiculous"].map(
        (v) => ({
          label: v,
          value: v
        })
      ))
</script>
<template>
    <NFlex justify="end" class="py-3">
        <NButton @click="toggleModal(true)">
            {{ $t('tables.add_new', { item: $t(translated)}) }}
        </NButton>
    </NFlex>
    <div class="w-full">
        <NDataTable
            :bordered="false"
            :single-line="false"
            single-column
            :columns="columns"
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
        <NModal
            v-model:show="showModal"
            :mask-closable="false"
        >
            <NCard
                style="width: 600px; max-width: 90%;"
                :title="(form.id ? $t('tables.edit') : $t('tables.add')) + ' ' + $t(translated)"
                :bordered="false"
                role="dialog"
                aria-modal="true"
                content-class="p1"
                header-class="p1"
            >
                <template #header-extra>
                    <NButton size="tiny" secondary type="tertiary" @click="toggleModal(false)">
                        <NIcon>
                            <Times />
                        </NIcon>
                    </NButton>
                </template>
                <NSpace vertical v-if="isLoading">
                    <NSkeleton height="40px" :repeat="3" style="margin-top: 24px;" :sharp="false" />
                </NSpace>
                <NForm v-else ref="formRef" :model="form" :rules="formRules" size="medium" label-placement="top">
                    <NGrid :span="24" :x-gap="11" item-responsive responsive="screen">
                        <NFormItemGi v-for="field in fields" :span="resource.calculatedSpan(field.span)" :label="$t(field.translated)" :path="field.field">
                            <NCheckbox
                                v-if="field.rules.type === Boolean"
                                v-model:checked="form[field.field]"
                            >
                                {{ $t(field.translated) }}
                            </NCheckbox>
                            <NInput
                                v-if="field.rules.type === String"
                                v-model:value="form[field.field]"
                                :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                            />
                            <NInputNumber
                                class="w-full"
                                v-if="field.rules.type === 'Currency'"
                                :parse="resource.parseCurrency"
                                :format="resource.formatCurrency"
                                v-model:value="form[field.field]"
                                :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                            />
                            <NInput
                                v-if="field.rules.type === Number"
                                :allow-input="resource.onlyAllowNumber"
                                v-model:value="form[field.field]"
                                :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                            />
                            <NSelect
                                v-if="field.rules.type === 'Select'"
                                v-model:value="form[field.field]"
                                :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                                :options="field.rules.options"
                            />
                            <NDatePicker
                                v-if="field.rules.type === Date"
                                v-model:value="form[field.field]"
                                :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                                class="w-full"
                                type="datetime"
                            />
                            <NTransfer
                                v-if="field.rules.type === 'Transfer'"
                                v-model:value="form[field.field]"
                                :options="field.rules.options"
                                :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                                class="w-full"
                            />
                            <div v-if="field.rules.type === 'Location' && form[field.field]" class="h-[250px] w-full">
                                <LMap ref="map" v-model:zoom="zoom" :center="form[field.field]" :use-global-leaflet="false">
                                    <LMarker
                                        :lat-lng="form[field.field]"
                                        draggable
                                        @moveend="localPin($event, field.field)"
                                    />
                                    <LTileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    ></LTileLayer>
                                </LMap>
                            </div>
                        </NFormItemGi>
                    </NGrid>
                </NForm>
                <template #action>
                    <NFlex justify="end">
                        <NButton :disabled="isLoading" type="primary" @click="saveChanges(form)">{{ $t('actions.save') }}</NButton>
                        <NButton :disabled="isLoading" secondary @click="toggleModal(false)">{{ $t('actions.cancel') }}</NButton>
                    </NFlex>
                </template>
            </NCard>
        </NModal>
    </div>
</template>