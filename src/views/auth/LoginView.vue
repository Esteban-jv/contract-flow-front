<script setup>
    // import { ref, inject } from 'vue';
    // import { useRouter } from 'vue-router';
    // import AuthAPI from '@/api/AuthAPI';

    // const toast = inject('toast')
    // const router = useRouter()
    // const loading = ref(false)

    // const handleSubmit = async (formData) => {
    //     loading.value = true
    //     try {
    //         const response = await AuthAPI.login(formData)
    //         console.log(response)
    //         const { data: { token } } = response
    //         localStorage.setItem('AUTH_TOKEN',token)
    //         loading.value = false
    //         // router.push({name: ''})
    //     } catch (err) {
    //         toast.open({
    //             message: err.response.data.msg,
    //             type: 'error'
    //         })
    //         loading.value = false
    //     }
    // }
</script>

<template>
    <div class="dark:bg-gray-900 bg-slate-300">
        <h1 class="text-5xl font-extrabold text-center text-blue-950 dark:text-white mt-5">{{ $t('login.access') }}</h1>
        <p class="text-2xl text-blue-950 dark:text-white text-center my-3">{{ $t('login.welcome_msg') }}</p>
    </div>

    <!-- Login Form Here -->
</template>