<script setup>
    import { ref, computed, onMounted, h } from 'vue';
    import { NDataTable, NButton, NFlex, NCard } from 'naive-ui';
    import { Info } from '@vicons/fa';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';

    const { $t, $can } = useGlobalHelpers()
    const resources = useResource()

    const model = ref('client')
    const permission = computed(() => model.value)

    const LanguageOptions = ref([])
    const fields = ref([
        {
            field: "name",
            translated: "tables.name",
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'left'
            }
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
            table: {
                align: 'left'
            }
        },
        {
            field: "marital_status",
            translated: "tables.marital_status",
            span: 8,
            rules: {
                type: 'Select',
                required: false,
                default: null,
                options: [
                    { label: $t("marital_status.single"), value: 2 },
                    { label: $t("marital_status.married"), value: 3 },
                    { label: $t("marital_status.divorced"), value: 4 },
                    { label: $t("marital_status.widowed"), value: 5 },
                    { label: $t("marital_status.other"), value: 1 },
                ],
                optionsEndpoint : null
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "phone",
            translated: "tables.main_phone",
            span: 8,
            rules: {
                type: Number,
                required: false,
                default: null
            },
            table: {
                align: 'left'
            }
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
            table: {
                align: 'left'
            }
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
            table: {
                align: 'left'
            }
        },
        {
            field: "state",
            translated: "tables.state",
            span: 12,
            rules: {
                type: String,
                required: false,
                default: null
            },
            table: {
                align: 'left'
            }
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
            table: {
                align: 'left'
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
                language: defaultData.value.language
            })
            defaultData.value.key ++;
        }
    }

    const computedColumns = computed( () => {
        const cols = resources.mapEditableColumns(fields.value, items.value)
        console.log("colz", cols)

        // Add actions column to a table
        // if($can('change',permission.value)) {
        //     cols.push({
        //         align: 'center',
        //         title: $t('tables.edit'),
        //         render(row) {
        //             return h(
        //                 NButton,
        //                 {
        //                     disabled: !$can('change',permission.value),
        //                     size: "small",
        //                     secondary: true,
        //                     type:"info",
        //                     // onClick: () => edit(row),
        //                     renderIcon: () => resources.renderIcon(Info, { color: '--n-color'} )
        //                 },
        //             );
        //         },
        //         key: "edit",
        //     })
        // }

        return cols
    })

    onMounted(async () => {
        LanguageOptions.value = await resources.getFromApi("language")
    })
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('client',2) }}</h1>
    <NCard class="my-2">
        <NFlex justify="space-between" class="py-3">
            <NButton @click="addNewRow()">
                {{ $t('tables.add_new', { item: $t(model, 2)}) }}
            </NButton>
            <NFlex justify="end">
                <NButton @click="addNewRow()">
                    +1
                </NButton>
                <NButton @click="addNewRow(5)">
                    +5
                </NButton>
                <NButton @click="addNewRow(10)">
                    +10
                </NButton>
            </NFlex>
        </NFlex>
        <template #action>
            <NFlex justify="end">
                <NButton @click="addNewRow()">
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