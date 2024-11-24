<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import ObjectForm from '@/components/ObjectForm.vue';
    import { useResource } from '@/composables/useResource';

    const { $t, $toast } = useGlobalHelpers()
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
            translated: "tables.description",
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
            translated: "tables.category",
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
            translated: "tables.type",
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
        /*{
            field: "price",
            translated: "tables.price",
            span: 8,
            rules: {
                type: Number,
                required: true,
                default: 0
            },
            table: {
                align: 'right'
            }
        },*/
        {
            field: "digital",
            translated: "tables.digital",
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
            translated: "tables.giftable",
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
    <ObjectForm
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        prev-page="products"
        :id="id"
    />
</template>