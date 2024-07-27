<script setup>
    import { ref, h, computed, onMounted } from 'vue';
    import { NDataTable, NIcon, NButton, NFlex,
        NModal, NCard,
        NForm, NGrid, NFormItemGi, NInput, NCheckbox } from 'naive-ui';
    import { CheckCircle, TimesCircle, Times } from '@vicons/fa';
    import { useRouter } from 'vue-router';
    import PartnerAPI from '@/api/client/PartnerAPI';
    import { i18n } from '@/plugins/i18n';

    // const router = useRouter()
    const showModal = ref(false)

    const columns = ref([
        {
            title: i18n.global.t('tables.name'),
            key: 'name'
        },
        {
            title: i18n.global.t('tables.description'),
            key: 'description'
        },
        {
            title: i18n.global.t('tables.status'),
            key: 'status',
            render: (row) => h(NIcon, null, { default: () => h(
                row.status ? CheckCircle : TimesCircle, { color: row.status ? "#0e7a0d" : "#D50049" }
            ) })
        },
        {
            title: i18n.global.t('tables.actions'),
            key: 'actions',
            render(row) {
                return h(
                NButton,
                {
                    size: "small",
                    onClick: () => edit(row)
                },
                { default: () => i18n.global.t('tables.edit'), }
                );
            }
        }
    ])
    const items = ref([])
    const pagination = ref(null)

    const hasPagination = computed(() => false)

    const model = ref({
        id: null,
        name: "",
        description: "",
        status: true
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
        model.value = row
    }
    const toggleModal = m => {
        showModal.value = m
        if(!m) {
            model.value = {
                id: null,
                name: "",
                description: "",
                status: true
            }
        }
    }

    const saveChanges = () => console.log("Gonna save")

    //todo improve
      const rules = ref({
        name: {
          required: true,
          trigger: ["blur", "input"],
          message: "Please input inputValue"
        },
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
                :title="(model.id ? $t('tables.edit') : $t('tables.add')) + ' ' + $t('official_id')"
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
                <NForm :model="model" :rules="rules" size="medium" label-placement="top">
                    <NGrid :span="24" :x-gap="24">
                        <NFormItemGi :span="24" :label="$t('tables.name')" path="nameValue">
                            <NInput v-model:value="model.name" :placeholder="$t('forms.enter_field', { field: $t('tables.name')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="24" :label="$t('tables.description')" path="descriptionValue">
                            <NInput v-model:value="model.description" :placeholder="$t('forms.enter_field', { field: $t('tables.description')})" />
                        </NFormItemGi>
                        <NFormItemGi :span="12" :label="$t('tables.currently_available')" path="statusValue">
                                <NCheckbox v-model:checked="model.status">
                                    {{ $t('tables.status') }}
                                </NCheckbox>
                        </NFormItemGi>
                    </NGrid>
                </NForm>
                <template #action>
                    <NFlex justify="end">
                        <NButton type="primary" @click="saveChanges()">{{ $t('actions.save') }}</NButton>
                        <NButton secondary @click="toggleModal(false)">{{ $t('actions.cancel') }}</NButton>
                    </NFlex>
                </template>
            </NCard>
        </NModal>
    </div>
</template>
<style>
    
</style>