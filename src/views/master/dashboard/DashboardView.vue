<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import MasterApi from '@/api/master/MasterApi';

    const clients = ref([])
    const router = useRouter()

    onMounted(async () => {
        const response = await MasterApi.getClients()
        clients.value = response.data
    })

    const logout = async () => {
        await MasterApi.logout()
        localStorage.removeItem('AUTH_TOKEN')
        router.push({ name: 'login' })
    }
</script>
<template>
    <h1>{{ $t('client', 2) }}</h1>
    <p v-for="c in clients">
        {{ c.name }}
    </p>
    <br>
    <br>
    <br>
    <button @click="logout">{{ $t('auth.logout') }}</button>
</template>