<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'
    import ResourceViewer from '@/components/ResourceViewer.vue';

    const model = ref('partner')
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
            rules: {
                type: Number,
                required: true,
                default: 0
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "main_phone",
            translated: "tables.main_phone",
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
            field: "main_email",
            translated: "tables.main_email",
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
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('partner',2) }}</h1>
    <ResourceViewer
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>