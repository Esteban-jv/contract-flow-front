<script setup>
    import { ref, onMounted } from 'vue';
    import PartnerAPI from '@/api/client/PartnerAPI';

    const languages = ref([])
    const nationalities = ref([])
    const oficialIds = ref([])

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
</template>