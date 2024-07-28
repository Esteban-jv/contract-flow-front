<script setup>
    import { ref, h, onMounted, reactive, computed } from 'vue';
    import { NDataTable, NIcon, NButton, NFlex, NModal, NCard, NForm, NGrid,
        NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, NPagination, useLoadingBar } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Edit } from '@vicons/fa';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
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
    const { $t, $toast, $toastError, $can } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    // Data
    const showModal = ref(false)
    const isLoading = ref(false)

    // Aux Methods
    const renderIcon = (icon, props={}) => h(NIcon, null, { default: () => h(icon, props) });
    const updatePage = page => {
        pagination.page = page
        getResource()
    }

    // For table
    const columns = ref([])
    const items = ref([])
    // For pagination
    const pagination = reactive({
        pageSize:5,
        page:1
    })
    const formRef = ref(null);
    const form = ref({
        id: null
    })
    const formRules = ref({})

    // For Display
    const toggleModal = m => {
        showModal.value = m
        if(!m) {
            form.value = {
                id: null
            }
            props.fields.forEach((f, i) => {
                // Get field
                const name = f.field
                // Set ref of form
                form.value[name] = f.rules.default
            })
        }
    }

    // CRUD Methods
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
    // Create and Update
    const createOrUpdateResource = async () => {
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
        props.fields.forEach((f, i) => {
            // Get field
            const name = f.field
            const translated = f.translated
            // Set ref of form
            form.value[name] = f.rules.default

            // Set validation rules
            formRules.value[name] = [
                {
                    required: f.rules.required
                }
            ]
            if(f.rules.required) {
                formRules.value[name][0].message = $t('forms.field_is_required', { field: $t(translated) }),
                formRules.value[name][0].trigger = ["input", "blur"]
            }

            // Set Table Columns
            columns.value[i] = {
                align: f.table.align,
                title: $t(translated),
                key: name
            }
            if(f.rules.type === Boolean) {
                columns.value[i].render = ((row) => row.status ? 
                    renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                    renderIcon(TimesCircle, { color: '#D50049'}))
            }
        })

        // Add actions column to a table
        columns.value.push({
            key: 'actions',
            children: [
                {
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
                                renderIcon: () => renderIcon(Edit, { color: '--n-color'} )
                            },
                        );
                    },
                    key: "edit",
                },
                {
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
                }
            ]
        })
    })
</script>
<template>
    <NFlex justify="end" class="py-3">
        <NButton @click="toggleModal(true)">
            {{ $t('tables.add_new', { item: $t(props.model)}) }}
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
            <NPagination v-model:page="pagination.page" :page-count="pagination.pageCount" @update-page="updatePage(pagination.page)" />
        </NFlex>
        <NModal
            v-model:show="showModal"
            :mask-closable="false"
        >
            <NCard
                style="width: 600px; max-width: 90%;"
                :title="(form.id ? $t('tables.edit') : $t('tables.add')) + ' ' + $t(props.model)"
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
                    <NGrid :span="24" :x-gap="24">
                        <NFormItemGi v-for="field in props.fields" :span="24" :label="$t(field.translated)" :path="field.field">
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
                        </NFormItemGi>

                        <!-- <NFormItemGi :span="24" :label="$t('tables.name')" path="name">
                            <NInput v-model:value="form.name" :placeholder="$t('forms.enter_field', { field: $t('tables.name')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="24" :label="$t('tables.description')" path="description">
                            <NInput v-model:value="form.description" :placeholder="$t('forms.enter_field', { field: $t('tables.description')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="12" :label="$t('tables.currently_available')" path="status">
                            <NCheckbox v-model:checked="form.status">
                                {{ $t('tables.status') }}
                            </NCheckbox>
                        </NFormItemGi> -->
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