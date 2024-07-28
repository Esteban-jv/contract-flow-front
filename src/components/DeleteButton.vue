<script setup>
    import { ref } from 'vue';
    import { NSpin, NIcon, NButton, NPopconfirm, useLoadingBar } from 'naive-ui';
    import { Trash } from '@vicons/fa';
    import api from "@/lib/axios";
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';

    const props = defineProps({
        delete_msg: {
            Type: String,
            required: true
        },
        delete_endpoint: {
            Type: String,
            required: true
        },
        disabled: {
            typ: String,
            required: false
        }
    })
    const emit = defineEmits(['object-deleted'])

    const { $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()
    const isLoading = ref(false)

    const handlePositiveClick = async () =>  {
        try {
            loadingBar.start()
            isLoading.value = true
            await api.delete(props.delete_endpoint)
            emit('object-deleted')
            loadingBar.end()
        } catch (err) {
            $toastError(err)
            loadingBar.error()
        } finally {
            isLoading.value = false
        }
        
    }
    const handleNegativeClick = () => 0
</script>
<template>
    <NSpin :show="isLoading">
        <NPopconfirm
            @positive-click="handlePositiveClick"
            @negative-click="handleNegativeClick"
            :positive-text="$t('actions.confirm')"
            :negative-text="$t('actions.cancel')"
        >
            <template #trigger>
                <NButton
                    size="small"
                    secondary
                    type="error"
                    :disabled="props.disabled"
                >
                    <NIcon size="20" color="--n-color">
                        <Trash />
                    </NIcon>
                </NButton>
            </template>
            {{ delete_msg }}
        </NPopconfirm>
    </NSpin>
</template>