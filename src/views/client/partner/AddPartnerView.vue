<script setup>
    import { ref, onMounted } from 'vue';
    import { NButton, NFlex, NCard, NForm, NGrid, NSelect, NAutoComplete,
        NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, useLoadingBar } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import ObjectForm from '@/components/ObjectForm.vue';

    const { $t } = useGlobalHelpers()
    const model = ref('partner')

    const fields = ref([
    {
            field: "name",
            translated: "tables.name",
            span: 12,
            rules: {
                type: String,
                required: true,
                default: null
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
            }
        },
        {
            field: "marital_status",
            translated: "tables.marital_status",
            span: 8,
            rules: {
                type: Number,
                required: true,
                default: 2,
                options: [
                    { label: $t("marital_status.single"), value: 2 },
                    { label: $t("marital_status.married"), value: 3 },
                    { label: $t("marital_status.divorced"), value: 4 },
                    { label: $t("marital_status.widowed"), value: 5 },
                    { label: $t("marital_status.other"), value: 1 },
                ],
                optionsEndpoint : null
            }
        },
        {
            field: "main_phone",
            translated: "tables.main_phone",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: null
            }
        },
        {
            field: "main_email",
            translated: "tables.main_email",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: null
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
            }
        },
        {
            field: "nationality",
            translated: "nationality",
            span: 8,
            rules: {
                type: Number,
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "nationality"
            }
        },
        {
            field: "id_type",
            translated: "idtype",
            span: 4,
            rules: {
                type: Number,
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "idtype"
            }
        },
        {
            field: "official_id",
            translated: "idtype",
            span: 4,
            rules: {
                type: String,
                required: true,
                default: null,
            }
        },
        {
            field: "status",
            translated: "tables.status",
            rules: {
                type: Boolean,
                required: false,
                default: true
            }
        }
    ])
</script>
<template>
    <ObjectForm
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>