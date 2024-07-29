<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import PartnerAPI from '@/api/client/PartnerAPI';
    import ClientAuthApi from '@/api/client/ClientAuthApi';

    
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('dashboard',2) }}</h1>
</template>