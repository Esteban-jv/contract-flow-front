<script setup>
    import { ref, onMounted } from 'vue';
    import MasterApi from '@/api/master/MasterApi';

    const clients = ref([])

    onMounted(async () => {
        const response = await MasterApi.getClients()
        clients.value = response.data
    })
</script>
<template>
    <h1>{{ $t('client') }}</h1>
    <p v-for="c in clients">
        {{ c.name }}
    </p>
</template>