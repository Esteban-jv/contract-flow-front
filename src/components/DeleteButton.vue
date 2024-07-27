<script setup>
    import { ref } from 'vue';
    import { NSpin, NIcon, NButton, NPopconfirm } from 'naive-ui';
    import { Trash } from '@vicons/fa';
    import api from "@/lib/axios";

    const props = defineProps({
        delete_msg: {
            Type: String,
            required: true
        },
        delete_endpoint: {
            Type: String,
            required: true
        }
    })
    const emit = defineEmits(['object-deleted'])

    const isLoading = ref(false)

    const handlePositiveClick = async () =>  {
        isLoading.value = true
        await api.delete(props.delete_endpoint)
        isLoading.value = false
        emit('object-deleted')
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