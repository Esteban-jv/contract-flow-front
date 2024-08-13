<script setup>
    import { ref, computed, onMounted, h } from 'vue';
    import { useRouter } from 'vue-router';
    import { NDataTable, NButton, NFlex, NCard, NGrid, NInput, NGi, NSelect, NFormItem } from 'naive-ui';
    import { useLoadingBar } from 'naive-ui';
    import { Trash } from '@vicons/fa';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';
    import api from '@/lib/axios';

    const { $t, $toastError } = useGlobalHelpers()
    const resources = useResource()
    const loadingBar = useLoadingBar()
    const router = useRouter()

    const isLoading = ref(false)
    const model = ref('client')
    const prevPage = computed(() => model.value) // ref('client')

    const LanguageOptions = ref([])
    const SalesRoomeOptions = ref([])
    const selectedSaleRoom = ref(null)
    const MaritalStatusOptions = [
        { label: $t("marital_status.single"), value: 2 },
        { label: $t("marital_status.married"), value: 3 },
        { label: $t("marital_status.divorced"), value: 4 },
        { label: $t("marital_status.widowed"), value: 5 },
        { label: $t("marital_status.other"), value: 1 },
    ]
    const fields = ref([
        {
            title: "tables.name",
            fields: [
                {
                    field: "name",
                    translated: "tables.name",
                    rules: {
                        type: String,
                        required: true,
                        default: null
                    },
                },
                {
                    field: "last_name",
                    translated: "tables.last_name",
                    span: 12,
                    rules: {
                        type: String,
                        required: true,
                        default: null
                    },
                }
            ],
            table: {
                align: 'left',
                width: '30%',
            }
        },
        {
            title: "tables.contact",
            fields: [
                {
                    field: "phone",
                    translated: "tables.main_phone",
                    span: 8,
                    rules: {
                        type: Number,
                        required: false,
                        default: null
                    },
                },
                {
                    field: "email",
                    translated: "tables.main_email",
                    span: 8,
                    rules: {
                        type: String,
                        required: false,
                        regex: /^\S+@\S+\.\S+$/,
                        default: ""
                    },
                }
            ],
            table: {
                align: 'left',
                width: '23%',
            }
        },
        {
            title: "tables.location",
            fields: [
                {
                    field: "state",
                    translated: "tables.state",
                    span: 12,
                    rules: {
                        type: String,
                        required: false,
                        default: null
                    },
                },
                {
                    field: "country",
                    translated: "tables.country",
                    span: 12,
                    rules: {
                        type: String,
                        required: false,
                        default: null
                    },
                }
            ],
            table: {
                align: 'left',
                width: '18%',
            }
        },
        {
            title: "tables.personal",
            fields: [
                {
                    field: "marital_status",
                    translated: "tables.marital_status",
                    span: 8,
                    rules: {
                        type: 'Select',
                        required: false,
                        default: null,
                        options: MaritalStatusOptions,
                        optionsEndpoint : null
                    },
                },
                {
                    field: "language",
                    translated: "language",
                    span: 8,
                    rules: {
                        type: 'Select',
                        required: true,
                        default: null,
                        options: LanguageOptions,
                        // optionsEndpoint : "language"
                    },
                }
            ],
            table: {
                align: 'left',
                width: '20%',
            }
        }
    ])


    const defaultData = ref({
        key: 1,
        country: '',
        state: '',
        language: null
    })

    const items = ref([])

    // Methods
    const addNewRow = (counter = 1) => {
        for(var i = 1; i<=counter; i++) {
            items.value.push({
                id: null,
                key: defaultData.value.key,
                name: '',
                last_name: '',
                marital_status: null,
                email: '',
                phone: null,
                country: defaultData.value.country,
                state: defaultData.value.state,
                language: defaultData.value.language,
                salesRoom: selectedSaleRoom.value
            })
            defaultData.value.key ++;
        }
    }
    const deleteRow = row => {
        items.value = items.value.filter( i => i.key !== row.key )
    }
    const triggerSend = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.post('client/', items.value)
            loadingBar.finish()
            router.push({ name: prevPage.value })
        } catch (error) {
            console.error(error)
            $toastError(error)
            loadingBar.error()
        } finally {
            isLoading.value = false
        }
    }

    // Computed
    const lanOptions = computed( () => LanguageOptions.value )
    const computedColumns = computed( () => {
        const cols = resources.mapGroupedEditableColumns(fields.value, items.value)

        // Add actions column to a table
        cols.push({
            align: 'center',
            title: $t('tables.delete'),
            render(row) {
                return h(
                    NButton,
                    {
                        disabled: false,
                        size: "small",
                        secondary: true,
                        type:"error",
                        onClick: () => deleteRow(row),
                        renderIcon: () => resources.renderIcon(Trash, { color: '--n-color'} )
                    },
                );
            },
            key: "edit",
            width: "10%"
        })

        return cols
    })

    onMounted(async () => {
        LanguageOptions.value = await resources.getFromApi("language")
        SalesRoomeOptions.value = await resources.getFromApi("hostess-sales-room")
    })
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('client',2) }}</h1>
    <NCard class="my-2">
        <NGrid x-gap="12" :cols="5" responsive>
            <NGi span="1">
                <NFormItem :label="$t('tables.language')">
                    <NSelect :disabled="isLoading" v-model:value="defaultData.language" :options="lanOptions" :placeholder="$t('forms.select_default_field', { field: $t('language') })" />
                </NFormItem>
            </NGi>
             <NGi>
                <NFormItem :label="$t('tables.country')">
                    <NInput :disabled="isLoading" v-model:value="defaultData.country" :placeholder="$t('forms.enter_default_field', { field: $t('tables.country') })" />
                </NFormItem>
             </NGi>
             <NGi>
                <NFormItem :label="$t('tables.state')">
                    <NInput :disabled="isLoading" v-model:value="defaultData.state" :placeholder="$t('forms.enter_default_field', { field: $t('tables.state') })" />
                </NFormItem>
             </NGi>
             <NGi span="2">
                <NFlex justify="end">
                    <NButton :disabled="isLoading" @click="addNewRow()" strong secondary round type="primary">
                        +1
                    </NButton>
                    <NButton :disabled="isLoading" @click="addNewRow(5)" strong secondary round type="primary">
                        +5
                    </NButton>
                    <NButton :disabled="isLoading" @click="addNewRow(10)" strong secondary round type="primary">
                        +10
                    </NButton>
                </NFlex>
             </NGi>
        </NGrid>
        <NFlex justify="space-between" class="py-3">
        </NFlex>
        <template #action>
            <NFlex justify="space-between" class="">
                <NFormItem :label="$t('sale_room')" class="md:w-[50%] w-full">
                    <NSelect :disabled="isLoading" v-model:value="selectedSaleRoom" :options="SalesRoomeOptions" :placeholder="$t('forms.select_field', { field: $t('sale_room') })" />
                </NFormItem>
                <NButton :disabled="isLoading" @click="triggerSend()" type="primary" class="self-center">
                    {{ $t('tables.add_new', { item: $t(model, 2)}) }}
                </NButton>
            </NFlex>
        </template>
    </NCard>
    <NDataTable
        :columns="computedColumns"
        :data="items"
    />
</template>