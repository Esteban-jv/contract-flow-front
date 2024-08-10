<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('sales-room')
    const translated = ref('sale_room')
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
            field: "code",
            translated: "tables.code",
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'right'
            }
        },
        {
            field: "meeting_date",
            translated: "tables.meeting_date",
            rules: {
                type: Date,
                required: false,
                default: true
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "location",
            translated: "tables.location",
            rules: {
                type: Location,
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
    <h1 class="text-2xl pb-4">{{ $t(translated,2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :translated="translated"
        :model="model"
        :fields="fields"
    />
</template>