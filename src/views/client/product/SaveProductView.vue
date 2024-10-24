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
    const model = ref('product')

    const id = computed(() => route.params.id ?? null)
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
            field: "description",
            translated: "description",
            span: 16,
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
            field: "category",
            translated: "category",
            span: 8,
            rules: {
                type: 'Select',
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "category"

            },
            table: {
                align: 'left',
                text: 'category.name'
            }
        },
        {
            field: "type",
            translated: "type",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: 'product',
                options: [
                    { label: $t("product"), value: 'product' },
                    { label: $t("service"), value: 'service' },
                ]
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "digital",
            translated: "digital",
            span: 4,
            rules: {
                type: Boolean,
                required: true,
                default: false
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "giftable",
            translated: "giftable",
            span: 4,
            rules: {
                type: Boolean,
                required: true,
                default: false
            },
            table: {
                align: 'left'
            }
        }
    ])
</script>
<template>
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