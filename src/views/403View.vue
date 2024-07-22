<script setup>
    import { useRouter } from 'vue-router';
    import { NResult, NButton } from 'naive-ui';

    const router = useRouter()

    const goToMain = () => {
        router.push({ name: 'login' }) // This will return to another page if user is logged in
    }
</script>
<template>
    <div class="bg-gray-50 dark:bg-zinc-800 h-full">
        <section class="flex items-center h-full p-16">
		    <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
			    <div class="max-w-md text-center"></div>
                <NResult
                    status="403"
                    :title="$t('pages.403_title')"
                    :description="$t('pages.403_msg')"
                >
                    <template #footer>
                        <NButton @click="goToMain()">{{ $t('go_to_main') }}</NButton>
                    </template>
                </NResult>
            </div>
        </section>
    </div>
</template>