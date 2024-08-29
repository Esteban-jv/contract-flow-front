<script setup>
    import { ref } from 'vue';
    import ResourceViewer from '@/components/ResourceViewer.vue';

    const model = ref('user')
    const fields = ref([
        {
            field: "username",
            translated: "tables.username",
            span: 8,
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "email",
            translated: "tables.email",
            span: 8,
            rules: {
                type: String,
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "first_name",
            translated: "tables.name",
            span: 8,
            rules: {
                type: String,
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "last_name",
            translated: "tables.last_name",
            span: 8,
            rules: {
                type: String,
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "is_active",
            translated: "tables.is_active",
            span: 8,
            rules: {
                type: Boolean,
                default: true
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "is_staff",
            translated: "tables.is_staff",
            span: 8,
            rules: {
                type: Boolean,
                default: true
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "date_joined",
            translated: "tables.date_joined",
            span: 8,
            rules: {
                type: Date,
                default: new Date()
            },
            table: {
                align: 'center'
            }
        }
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('user',2) }}</h1>
    <ResourceViewer
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        :filters="true"
    />
</template>