<script setup>
    import { ref } from 'vue';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';

    const { $t } = useGlobalHelpers()
    const model = ref('partner')
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('tables.add_new', { item: $t('partner',2) }) }}</h1>
</template>