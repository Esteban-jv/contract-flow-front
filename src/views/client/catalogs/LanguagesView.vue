<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('language')
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
    <h1 class="text-2xl pb-4">{{ $t('language',2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        permission-model="language"
    />
</template>