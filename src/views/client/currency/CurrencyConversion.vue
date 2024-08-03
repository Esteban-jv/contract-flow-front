<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('conversion')
    const fields = ref([
        {
            field: "in_currency",
            translated: "tables.currency",
            rules: {
                type: 'Select',
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "currency"
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "operator",
            translated: "tables.operator",
            span: 8,
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "value",
            translated: "tables.value",
            span: 16,
            rules: {
                type: "Currency",
                required: true,
                default: null
            },
            table: {
                align: 'rigth'
            }
        },
        {
            field: "out_currency",
            translated: "tables.currency",
            rules: {
                type: 'Select',
                required: true,
                default: null,
                options: [],
                optionsEndpoint : "currency"
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "reversible",
            translated: "tables.reversible",
            span:12,
            rules: {
                type: Boolean,
                required: false,
                default: false
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "status",
            translated: "tables.status",
            span:12,
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
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t(model,2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>