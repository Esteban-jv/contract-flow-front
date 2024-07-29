<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('nationality')
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
        }
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('nationality',2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>