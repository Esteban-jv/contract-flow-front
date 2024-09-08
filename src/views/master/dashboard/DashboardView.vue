<script setup>
    import { ref, computed, onMounted, h } from 'vue';
    import { useRouter } from 'vue-router';
    import { NButton, NDataTable } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import MasterApi from '@/api/master/MasterApi';

    const router = useRouter()
    const { $t } = useGlobalHelpers()

    const clients = ref([])
    const columns = computed( () => [
        { title: $t('tables.id'), key: 'id' },
        { title: $t('tables.name'), key: 'name' },
        { title: $t('tables.schema'), key: 'schema_name' },
        { title: $t('tables.created_at'), key: 'created_on' },
        { title: $t('tables.domain'), key: 'domain', render(row) {
            return h(
            NButton,
            {
                text: true,
                tag: "a",
                href: row.url,
                target: "_blank",
                type: "info"
            },
            { default: () => row.domain }
            );
        }
    }])

    onMounted(async () => {
        const response = await MasterApi.getClients()
        // clients.value = response.data
        // reder domain as a link using Naive UI
        clients.value = response.data
    })
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('client',2) }}</h1>
    <div class="w-full">
        <NDataTable
            :bordered="false"
            :single-line="false"
            single-column
            :columns="columns"
            :data="clients"
        />
    </div>
</template>