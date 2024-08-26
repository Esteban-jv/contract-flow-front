<script setup>
    import { ref } from 'vue';
    import ResourceViewer from '@/components/ResourceViewer.vue';

    const model = ref('partner')
    const fields = ref([
        {
            field: "client.name",
            translated: "tables.name",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "client.folio",
            translated: "tables.lead",
            rules: {
                type: Number,
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
        forntend-permissions="rud"
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>