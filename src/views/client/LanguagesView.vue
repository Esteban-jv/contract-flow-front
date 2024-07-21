<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import PartnerAPI from '@/api/client/PartnerAPI';
    import ClientAuthApi from '@/api/client/ClientAuthApi';

    const languages = ref([])
    const nationalities = ref([])
    const oficialIds = ref([])
    const router = useRouter()

    onMounted(async () => {
        try {
            const { data } = await PartnerAPI.getLanguages()
            languages.value = data

            const natResponse = await PartnerAPI.getNationalities()
            const idResponse = await PartnerAPI.getOficialIds()

            nationalities.value = natResponse.data
            oficialIds.value = idResponse.data
        } catch (err) {
            console.error(err)
        }
    })

    const logout = async () => {
        await ClientAuthApi.logout()
        localStorage.removeItem('AUTH_TOKEN')
        router.push({ name: 'login' })
    }
</script>
<template>
    <div>
        <h1>Languages</h1>
        <p v-for="l in languages">
            {{ l.name }}
        </p>
        <br>
        <p v-for="n in nationalities">
            {{ n.name }}
        </p>
        <br>
        <p v-for="i in oficialIds">
            {{ i.name }}
        </p>
    </div>
    <br>
    <br>
    <br>
    <button @click="logout">{{ $t('auth.logout') }}</button>
</template>