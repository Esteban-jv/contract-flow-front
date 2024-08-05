<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { NDataTable } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';

    const { $t, $can } = useGlobalHelpers()
    const resources = useResource()

    const model = ref('client')
    const permission = computed(() => model.value)
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
                type: Number,
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
                type: Number,
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "language"
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "status",
            translated: "tables.status",
            rules: {
                type: Boolean,
                required: false,
                default: true
            },
            table: {
                align: 'center'
            }
        }
    ])

    const items = ref([])

    const computedColumns = computed( () => {
        const cols = resources.mapColumns(fields.value)

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
                            // onClick: () => edit(row),
                            renderIcon: () => renderIcon(Info, { color: '--n-color'} )
                        },
                    );
                },
                key: "edit",
            })
        }

        return cols
    })

    onMounted(() => {
        resources.getResource(model.value)
        items.value = resources.items
    })
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('client',2) }}</h1>
    <NDataTable
        :columns="computedColumns"
        :items="items"
    />
</template>