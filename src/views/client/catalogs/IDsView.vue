<script setup>
    import { ref, h, computed, onMounted } from 'vue';
    import { NDataTable, NIcon, NButton, NFlex,
        NModal, NCard,
        NForm, NGrid, NFormItemGi, NInput, NCheckbox } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times, Trash, Edit } from '@vicons/fa';
    import PartnerAPI from '@/api/client/PartnerAPI';
    import { useGlobalHelpers } from '@/stores/useGlobalHelpers';

    const showModal = ref(false)
    const { $t, $toast } = useGlobalHelpers()
    const renderIcon = (icon, props={}) => h(NIcon, null, { default: () => h(icon, props) });

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
                    key: "attack",
                },
                {
                    align: 'center',
                    title: $t('tables.delete'),
                    render(row) {
                        return h(
                            NButton,
                            {
                                size: "small",
                                type:"error",
                                secondary: true,
                                onClick: () => edit(row),
                                renderIcon: () => renderIcon(Trash, { color: '--n-color'} )
                            },
                        );
                    },
                    key: "attack",
                }
            ]
        }
    ])
    const items = ref([])
    const pagination = ref(null)
    const hasPagination = computed(() => false)

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

    onMounted(async () => {
        try {
            const { data } = await PartnerAPI.getOficialIds()
            items.value = data
        } catch (err) {
            console.error(err)
        }
    })

    const edit = row => {
        showModal.value = true
        form.value = row
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

    const saveChanges = () => {
        formRef.value?.validate(
            errors => {
                if(!errors) {
                    // console.log("heart shaped box")
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

    //todo improve
      const rules = ref({
        name: [
            {
            required: true,
            message: "Password is required"
            }
        ],
        description: {
          required: false,
          trigger: ["blur", "input"]
        }
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
            :pagination="hasPagination ? pagination : []"
        />
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
                <NForm ref="formRef" :model="form" :rules="formRules" size="medium" label-placement="top">
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
                        <NButton type="primary" @click="saveChanges(form)">{{ $t('actions.save') }}</NButton>
                        <NButton secondary @click="toggleModal(false)">{{ $t('actions.cancel') }}</NButton>
                    </NFlex>
                </template>
            </NCard>
        </NModal>
    </div>
</template>
<style>
    
</style>