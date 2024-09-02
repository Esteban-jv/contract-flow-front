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
    <div class="md:h-screen md:flex md:items-center bg-white dark:bg-black h-full">
        <div class="md:mx-auto md:w-1/3 lg:w-1/3 xs:w-2/3 w-100 px-2 py-[20%]">
            <div class="">
                <RouterView />
            </div>
        </div>
    </div>
</template>
<style scoped>
    body * {
        @apply transition-colors duration-200;
    }
</style>