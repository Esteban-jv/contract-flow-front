<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { NFlex, NPopconfirm, NButton, NIcon, NForm, NGrid, NFormItemGi, NSelect, NInput } from 'naive-ui';
    import { useRouter, useRoute } from 'vue-router';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { UserCheck } from '@vicons/fa';
    import ObjectForm from '@/components/ObjectForm.vue';
    import { useResource } from '@/composables/useResource';

    const { $t, $toast } = useGlobalHelpers()
    const resource = useResource()
    const router = useRouter()
    const route = useRoute()
    const model = ref('client')

    const id = computed(() => route.params.id ?? null)
    const formRef = ref(null)
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
                default: null,
                maxLength: 10,
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

    // Partner stuffs
    const willAddToPartner = ref(false)
    const partnerForm = ref({
        nationality: null,
        id_type: null,
        official_id: null,
        client: null
    })
    const partnerFormRules = ref(
        {
            nationality: [
                { type: "number",  required: true, message: $t('forms.field_is_required', { field: $t('tables.nationality') }), trigger: 'blur' }
            ],
            id_type: [
                { type: "number", required: true, message: $t('forms.field_is_required', { field: $t('tables.id_type') }), trigger: 'blur' }
            ],
            official_id: [
                { required: true, message: $t('forms.field_is_required', { field: $t('tables.official_id') }), trigger: 'blur' }
            ]
        }
    )
    const nationalities = ref([])
    const idTypes = ref([])

    const goToAddPartner = e => {
        e.preventDefault()
        console.log("Going to add partner")
        // Validate form by ref
        formRef.value?.validate(
            errors => {
                if(!errors) {
                    // Create partner
                    console.log('Creating partner')
                    partnerForm.value.client = id.value
                    resource.createOrUpdateResource(
                        'partner',
                        partnerForm.value,
                        { name: 'edit-partner', params: { id: 'ObjectCreatedId' } }
                    )
                } else {
                    $toast.open({
                        message: $t('forms.check_all_fields_msg'),
                        type: 'error'
                    })
                }
            }
        )
        // router.push({ name: 'edit-partner', params: { id: route.params.id } })
    }

    onMounted(async () => {
        // Fetch filters
        nationalities.value = await resource.getFromApi('nationality')
        idTypes.value = await resource.getFromApi('idtype')

        // console.log('nationalities', nationalities.value, idTypes.value)
    })
</script>
<template>
    <!-- Animate the next form to esae in -->
    <Transition name="slide-fade" v-if="id">
        <NForm v-if="willAddToPartner" ref="formRef" :model="partnerForm" :rules="partnerFormRules" label-placement="top">
            <NGrid :span="24" :x-gap="11" item-responsive responsive="screen">
                <NFormItemGi :label="$t('tables.nationality')" path="nationality" :span=8>
                    <NSelect
                        v-model:value="partnerForm.nationality"
                        :placeholder="$t('forms.enter_field', { field: $t('tables.nationality')})"
                        :options="nationalities"
                    />
                </NFormItemGi>
                <NFormItemGi :label="$t('tables.id_type')" path="id_type" :span="8">
                    <NSelect
                        v-model:value="partnerForm.id_type"
                        :placeholder="$t('forms.enter_field', { field: $t('tables.id_type')})"
                        :options="idTypes"
                    />
                </NFormItemGi>
                <NFormItemGi :label="$t('tables.official_id')" path="official_id" :span="8">
                    <NInput
                        name="official_id"
                        v-model:value="partnerForm.official_id"
                        :placeholder="$t('forms.enter_field', { field: $t('tables.official_id')})"
                    />
                </NFormItemGi>
            </NGrid>
        </NForm>
    </Transition>
    <NFlex justify="end" class="mb-4" v-if="id">
        <NButton
            v-if="!willAddToPartner"
            type="warning"
            ghost
            size="large"
            @click="willAddToPartner = true"
        >
            <template #icon>
            <NIcon><UserCheck /></NIcon>
            </template>
            {{ $t('partners.make_partner') }}
        </NButton>
        <div class="flex" v-else>
            <NButton
                type="tertiary"
                class="mx-2"
                secondary
                size="large"
                @click="willAddToPartner = false"
            >
                {{ $t('actions.cancel') }}
            </NButton>
            <NPopconfirm
            title="{{ $t('partners.make_partner') }}"
            :positive-text="$t('actions.confirm')"
            :negative-text="$t('actions.cancel')"
            @positive-click="goToAddPartner"
            >
                <template #trigger>
                    <NButton
                        type="warning"
                        ghost
                        size="large"
                        icon="arrow-back"
                    >
                    <template #icon>
                    <NIcon><UserCheck /></NIcon>
                    </template>
                        {{ $t('partners.make_partner') }}
                    </NButton>
                </template>
                {{ $t('partners.sure_of_making_partner') }}
            </NPopconfirm>
        </div>
    </NFlex>
    <ObjectForm
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        prev-page="clients"
        :id="id"
    />
</template>
<style scoped>
    .slide-fade-enter-active {
        transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
        transform: translateY(-20px);
        opacity: 0;
    }
</style>