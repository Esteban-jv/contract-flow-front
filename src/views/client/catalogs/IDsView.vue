<script setup>
    import { ref, h, onMounted, reactive } from 'vue';
    import { NDataTable, NIcon, NButton, NFlex,
        NModal, NCard,
        NForm, NGrid, NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, NPagination, useLoadingBar } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Trash, Edit } from '@vicons/fa';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import api from "@/lib/axios";
    import DeleteButton from "@/components/DeleteButton.vue"

    const { $t, $toast } = useGlobalHelpers()
    const renderIcon = (icon, props={}) => h(NIcon, null, { default: () => h(icon, props) });
    const showModal = ref(false)
    const isLoading = ref(false)
    const loadingBar = useLoadingBar()
    const endpoing = ref('/id')

    const columns = ref([
        {
            title: $t('tables.name'),
            key: 'name'
        },
        {
            title: $t('tables.description'),
            key: 'description'
        },
        {
            align: 'center',
            title: $t('tables.status'),
            key: 'status',
            render: (row) => row.status ? 
                renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                renderIcon(TimesCircle, { color: '#D50049'})
        },
        {
            key: 'actions',
            children: [
                {
                    align: 'center',
                    title: $t('tables.edit'),
                    render(row) {
                        return h(
                            NButton,
                            {
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
                                delete_msg: $t('actions.confirm_msg',{ verb: $t('tables.delete').toLowerCase(), obj: $t('official_id') }),
                                delete_endpoint: `${endpoing.value}/${row.id}/` ,
                                onObjectDeleted: () => getResource()
                            }
                        );
                    },
                    key: "delete",
                }
            ]
        }
    ])
    const items = ref([])
    const updatePage = page => {
        pagination.page = page
        getResource()
    }
    const pagination = reactive({
        pageSize:5,
        page:1,
        showSizePicker: false,
        pageSizes: [5, 10, 20, 50],
        /*updatePage: (page) => {
            pagination.page = page
            getResource()
        },
        onUpdatePageSize: (pageSize) => {
            paginationReactive.pageSize = pageSize
            paginationReactive.page = 1
        }*/
    })

    const formRef = ref(null);
    const form = ref({
        id: null,
        name: "",
        description: "",
        status: true
    })
    const formRules = ref({
        name: [
            {
                required: true,
                message: $t('forms.field_is_required', { field: $t('tables.name') }),
                trigger: ["input", "blur"]
            }
        ]
    })

    const edit = async row => {
        try {
            showModal.value = true
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${endpoing.value}/${row.id}/`)
            form.value = data
            loadingBar.finish()
        } catch (err) {
            loadingBar.error()
            processError(err)
        } finally {
            isLoading.value = false
        }
    }
    const toggleModal = m => {
        showModal.value = m
        if(!m) {
            form.value = {
                id: null,
                name: "",
                description: "",
                status: true
            }
        }
    }

    const processError = err => {
        if(err.response)
            if(err.response.data) {
                const { data } = err.response
                const arrErr = Object.entries(data)
                arrErr.forEach( e => {
                    $toast.open({
                        message: `${$t('tables.'+e[0])}: ${e[1]}`,
                        type: 'error'
                    })
                })
                return
            }
        $toast.open({
            message: $t('forms.check_all_fields_msg'),
            type: 'error'
        })
    }
    const getResource = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${endpoing.value}/`, {
                params: {
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize
                }
            })
            items.value = data.results
            pagination.itemCount = data.count
            pagination.pageCount = parseInt(data.count / pagination.pageSize)
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
    const createOrUpdateResource = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            if (form.value.id) {
                const { data } = await api.put(`${endpoing.value}/${form.value.id}/`,form.value)
            } else {
                const { data } = await api.post(`${endpoing.value}/`,form.value)
            }
            await getResource()
            toggleModal(false)
            loadingBar.finish()
        } catch (err) {
            loadingBar.error()
            processError(err)
        } finally {
            isLoading.value = false
        }
    }
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
    })
    
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('official_id',2) }}</h1>
    <NFlex justify="end" class="py-3">
        <NButton @click="toggleModal(true)">
            {{ $t('tables.add_new', { item: $t('official_id')}) }}
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
            <NPagination v-model:page="pagination.page" :page-count="2" @update-page="updatePage(pagination.page)" />
        </NFlex>
        <NModal
            v-model:show="showModal"
            :mask-closable="false"
        >
            <NCard
                style="width: 600px; max-width: 90%;"
                :title="(form.id ? $t('tables.edit') : $t('tables.add')) + ' ' + $t('official_id')"
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
                        <NFormItemGi :span="24" :label="$t('tables.name')" path="name">
                            <NInput v-model:value="form.name" :placeholder="$t('forms.enter_field', { field: $t('tables.name')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="24" :label="$t('tables.description')" path="description">
                            <NInput v-model:value="form.description" :placeholder="$t('forms.enter_field', { field: $t('tables.description')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="12" :label="$t('tables.currently_available')" path="status">
                            <NCheckbox v-model:checked="form.status">
                                {{ $t('tables.status') }}
                            </NCheckbox>
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
<style>
    
</style>