<script setup>
    import { ref } from 'vue';
    import HistoricalRecordViewer from '@/components/HistoricalRecordViewer.vue';

    const model = ref('client')
    const fields = ref([
        {
            field: "sales_room",
            translated: "sale_room",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left',
                text: 'sales_room.name'
            }
        },
        {
            field: "full_name",
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
            field: "folio",
            translated: "tables.lead",
            rules: {
                type: Number,
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "phone",
            translated: "tables.main_phone",
            rules: {
                type: String,
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "email",
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
        },
        {
            field: "marital_status",
            translated: "tables.marital_status",
            rules: {
                type: Number,
            },
            table: {
                align: 'left'
            }
        }
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('client',2) }}</h1>
    <HistoricalRecordViewer
        :endpoint="`${model}`"
        :model="model"
        :fields="fields"
        :filters="true"
    />
</template>