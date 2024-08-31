<script setup>
    import { ref } from 'vue';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('group')
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
                field: "permissions",
                translated: "tables.permissions",
                span: 24,
                rules: {
                    type: 'Transfer',
                    required: false,
                    default: [],
                    options: [],
                    optionsEndpoint : "permission"
                },
                table: {
                    align: 'left'
                }
            }
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('group',2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
    />
</template>