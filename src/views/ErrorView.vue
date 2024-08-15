<script setup>
    import { useRouter } from 'vue-router';
    import { NResult, NButton } from 'naive-ui';

    const props = defineProps({
        error: {
            Type: String,
            default: '404'
        },
        title: {
            Type: String,
            default: null
        },
        description: {
            Type: String,
            default: null
        }
    })

    const router = useRouter()

    const goToMain = () => {
        router.push({ name: 'dashboard' }) // This will return to another page if user is logged in
    }
</script>
<template>
    <div class="bg-gray-50 dark:bg-zinc-800 h-full">
        <section class="flex items-center h-full p-16">
		    <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
			    <div class="max-w-md text-center"></div>
                <NResult
                    :status="props.error"
                    :title="props.title ?? $t('pages.404_title')"
                    :description="props.description ?? $t('pages.404_msg')"
                >
                    <template #footer>
                        <NButton @click="goToMain()">{{ $t('go_to_main') }}</NButton>
                    </template>
                </NResult>
            </div>
        </section>
    </div>
</template>