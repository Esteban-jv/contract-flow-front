<script setup>
    /*import { useRoute } from 'vue-router';
    import { useThemeStore } from '@/stores/useTheme';

    const theme = useThemeStore()

    const authRoutes = [
        { name: 'register', text: 'Crear cuenta' },
        { name: 'login', text: 'Iniciar sesión' },
        { name: 'forgot-password', text: 'Olvidé mi contraseña' },
    ]
    const route = useRoute()*/

    // const handleTheme = () => {
    //     theme.customToggleMode();
    // }
</script>

<template>
    <div class="md:h-screen md:flex md:items-center">
        <div class="md:mx-auto md:w-1/3 lg:w-1/3 xs:w-2/3 w-100 px-2 md:py-20 py-3">
            <div class="">
                <RouterView />

                <!-- <nav class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-between lg:space-y-0">
                    <RouterLink
                        class="uppercase font-bold dark:text-white"
                        v-for="authRoute in authRoutes"
                        :to="{name: authRoute.name}"
                        :class="{ 'hidden': route.name === authRoute.name }"
                    >{{ authRoute.text }}</RouterLink>
                </nav> -->
            </div>
        </div>
    </div>
</template>
<style scoped>
    .body-bg {
        background-image: url('/img/martial-arts-bg.jpg');
    }

    body * {
        @apply transition-colors duration-200;
    }
</style>