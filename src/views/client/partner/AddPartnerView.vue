<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { NTabs, NTabPane } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';
    import ObjectForm from '@/components/ObjectForm.vue';

    const { $t } = useGlobalHelpers()
    const resource = useResource()

    const MaritalStatusOptions = ref([
        { label: $t("marital_status.single"), value: 2 },
        { label: $t("marital_status.married"), value: 3 },
        { label: $t("marital_status.divorced"), value: 4 },
        { label: $t("marital_status.widowed"), value: 5 },
        { label: $t("marital_status.other"), value: 1 },
    ])


    const partnerModel = ref('partner')
    const partnerFields = ref([
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
                type: Number,
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
                regex: /^\S+@\S+\.\S+$/,
                default: ""
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

    const clientModel = ref('client')
    const clientFields = ref([
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
        },
        {
            field: "sales_room",
            translated: "sale_room",
            span: 8,
            rules: {
                type: 'Select',
                required: false,
                default: null,
                options: [],
                optionsEndpoint : "sales-room"
            },
            table: {
                align: 'left'
            }
        }
    ])

    const computedMessage = computed(() => {
        console.log("Computed!")
        return "Computed message"
    })
</script>
<template>
    <NTabs type="segment" animated>
        <NTabPane title="client_data" :name="$t('partners.client_data')">
            <ObjectForm
                :endpoint="`/${clientModel}`"
                :model="clientModel"
                :fields="clientFields"
                prev-page="clients"
            />
        </NTabPane>
        <NTabPane title="payment_data" :name="$t('partners.payment_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
        <NTabPane title="contact_data" :name="$t('partners.contact_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
        <NTabPane title="address_data" :name="$t('partners.address_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
        <NTabPane title="beneficiary_data" :name="$t('partners.beneficiary_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
    </NTabs>
</template>