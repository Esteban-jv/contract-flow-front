<script setup>
    import { ref } from 'vue';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import ObjectForm from '@/components/ObjectForm.vue';

    const { $t } = useGlobalHelpers()
    const model = ref('client')

    const MaritalStatusOptions = ref([
        { label: $t("marital_status.single"), value: 2 },
        { label: $t("marital_status.married"), value: 3 },
        { label: $t("marital_status.divorced"), value: 4 },
        { label: $t("marital_status.widowed"), value: 5 },
        { label: $t("marital_status.other"), value: 1 },
    ])
    const fields = ref([
        {
            field: "name",
            translated: "tables.name",
            span: 8,
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
            span: 8,
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
            field: "phone",
            translated: "tables.main_phone",
            span: 8,
            rules: {
                type: Number,
                required: false,
                default: null
            },
            table: {
                align: 'left',
                width: '23%',
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
                align: 'left',
            }
        },
        {
            field: "state",
            translated: "tables.state",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'left',
            }
        },
        {
            field: "country",
            translated: "tables.country",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'left',
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
                options: MaritalStatusOptions.value,
                optionsEndpoint : null
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
                options: [],
                optionsEndpoint : "language"
            },
            table: {
                align: 'left'
            }
        }
    ])
</script>
<template>
    <ObjectForm
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        prev-page="clients"
    />
</template>