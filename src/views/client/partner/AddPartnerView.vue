<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { NTabs, NTabPane } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useResource } from '@/composables/useResource';
    import ObjectForm from '@/components/ObjectForm.vue';
    import ResourceCreator from '@/components/ResourceCreator.vue';

    const { $t } = useGlobalHelpers()
    const resource = useResource()
    const route = useRoute()

    const MaritalStatusOptions = ref([
        { label: $t("marital_status.single"), value: 2 },
        { label: $t("marital_status.married"), value: 3 },
        { label: $t("marital_status.divorced"), value: 4 },
        { label: $t("marital_status.widowed"), value: 5 },
        { label: $t("marital_status.other"), value: 1 },
    ])

    const id = computed(() => route.params.id ?? null)
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

    const clientId = ref(null)
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

    const phoneModel = ref('phone')
    const phoneFields = ref([
        {
            field: "ext",
            translated: "tables.ext",
            span: 6,
            rules: {
                type: "Select",
                required: true,
                default: '+52',
                options: [
                    // Claves de telefonos por paises más populares
                    { label: '+52', value: '+52' }, // México
                    { label: '+1', value: '+1' }, // USA
                    { label: '+33', value: '+33' }, // Francia
                    { label: '+49', value: '+49' }, // Alemania
                    { label: '+39', value: '+39' }, // Italia
                    { label: '+44', value: '+44' }, // Reino Unido
                    { label: '+34', value: '+34' }, // España
                    { label: '+57', value: '+57' }, // Colombia
                    { label: '+54', value: '+54' }, // Argentina
                    { label: '+55', value: '+55' }, // Brasil
                    { label: '+56', value: '+56' }, // Chile
                    { label: '+51', value: '+51' }, // Perú
                    { label: '+58', value: '+58' }, // Venezuela
                    { label: '+593', value: '+593' }, // Ecuador
                    { label: '+507', value: '+507' }, // Panamá
                    { label: '+598', value: '+598' } // Uruguay
                ]
            },
            table: {
                align: 'left',
                width: '10%',
            }
        },
        {
            field: "number",
            translated: "tables.phone",
            span: 18,
            rules: {
                type: Number,
                required: true,
                default: null
            },
            table: {
                align: 'left',
                width: '70%',
            }
        },
        {
            field: "mobile",
            translated: "tables.status",
            span: 23,
            rules: {
                type: Boolean,
                required: false,
                default: true
            },
            table: {
                align: 'center',
                width: '10%',
            }
        },
        {
            field: "partner",
            translated: " ",
            span: 1,
            rules: {
                type: "Hidden",
                required: true,
                default: id.value
            },
            table: {
                align: 'left',
                width: '0%',
            }
        }
    ])
    const emailModel = ref('email')
    const emailFields = ref([
        {
            field: "email",
            translated: "tables.email",
            span: 23,
            rules: {
                type: String,
                required: true,
                regex: /^\S+@\S+\.\S+$/,
                default: ""
            },
            table: {
                align: 'left',
                width: '70%',
            }
        },
        {
            field: "partner",
            translated: " ",
            span: 1,
            rules: {
                type: "Hidden",
                required: true,
                default: id.value
            },
            table: {
                align: 'left',
                width: '0%',
            }
        }
    ])

    const computedMessage = computed(() => {
        console.log("Computed!")
        return "Computed message"
    })

    onMounted(async () => {
        const { data } = await resource.retrieveResourceById(partnerModel.value, id.value)
        clientId.value = data.client
    })
</script>
<template>
    <NTabs type="segment" animated>
        <NTabPane title="client_data" :name="$t('partners.client_data')">
            <ObjectForm
                v-if="clientId"
                :endpoint="`/${clientModel}`"
                :model="clientModel"
                :id="clientId"
                :fields="clientFields"
                prev-page="partner"
            />
        </NTabPane>
        <NTabPane title="payment_data" :name="$t('partners.payment_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
        <NTabPane title="contact_data" :name="$t('partners.contact_data')" display-directive="show:lazy">
            <ResourceCreator
                :filters="{ partner: id }"
                :endpoint="`/${phoneModel}`"
                :model="phoneModel"
                :fields="phoneFields"
            />
            <ResourceCreator
                :filters="{ partner: id }"
                :endpoint="`/${emailModel}`"
                :model="emailModel"
                :fields="emailFields"
            />
        </NTabPane>
        <NTabPane title="address_data" :name="$t('partners.address_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
        <NTabPane title="beneficiary_data" :name="$t('partners.beneficiary_data')" display-directive="show:lazy">
            <p>{{ computedMessage }}</p>
        </NTabPane>
    </NTabs>
</template>