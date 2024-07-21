<script setup>
    import { ref, inject, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';
    import { NButton, NInput, NFormItem, NForm, NRow, NCol } from 'naive-ui';
    import { i18n } from '@/plugins/i18n';
    import AuthApi from '@/api/AuthApi';

    const router = useRouter()
    onBeforeMount(() => {
        if(localStorage.getItem('AUTH_TOKEN')) {
            return router.push({name: 'master'})
        }
    })

    const toast = inject('toast')
    const loading = ref(false)
    const form = ref({
        username: '',
        password: ''
    })

    const formRules = ref({
        username: [
            {
                required: true,
                validator(rule, value) {
                    if (!value) {
                        return new Error(i18n.global.t('forms.field_is_required', { field: i18n.global.t('auth.username')}));
                    } /*else if (!/^\d*$/.test(value)) {
                        return new Error("Age should be an integer");
                    } else if (Number(value) < 18) {
                        return new Error("Age should be above 18");
                    }*/
                    return true;
                },
                trigger: ["input", "blur"]
            }
        ],
        password: [
            {
                required: true,
                validator(rule, value) {
                    if (!value) {
                        return new Error(i18n.global.t('forms.field_is_required', { field: i18n.global.t('auth.password')}));
                    } /*else if (!/^\d*$/.test(value)) {
                        return new Error("Age should be an integer");
                    } else if (Number(value) < 18) {
                        return new Error("Age should be above 18");
                    }*/
                    return true;
                },
                trigger: ["input", "blur"]
            }
        ]
    })

    const handleSubmit = async (formData) => {
        loading.value = true
        console.log(formData, form.value)
        try {
            const response = await AuthApi.login(form.value)
            // console.log(response)
            const { data: { token } } = response
            localStorage.setItem('AUTH_TOKEN',token)
            loading.value = false
            router.push({name: 'master'})
        } catch (err) {
            toast.open({
                message: err.response.data.msg,
                type: 'error'
            })
            loading.value = false
        }
    }
</script>

<template>
    <div class="shadow-xl">
        <div class="dark:bg-gray-900 bg-slate-300 rounded-ss-xl rounded-se-xl p-2">
        <h1 class="text-5xl font-extrabold text-center text-blue-950 dark:text-white mt-5">{{ $t('auth.access') }}</h1>
        <p class="text-2xl text-blue-950 dark:text-white text-center my-3">{{ $t('auth.welcome_msg') }}</p>
    </div>

    <NForm :model="form" :rules="formRules" class="p-4">
        <NFormItem path="username" :label="$t('auth.username')">
            <NInput v-model:value="form.username" @keydown.enter.prevent :placeholder="$t('forms.enter_field', { field: $t('auth.username').toLowerCase() })" />
        </NFormItem>
        <NFormItem path="password" :label="$t('auth.password')">
            <NInput type="password" v-model:value="form.password" @keydown.enter.prevent :placeholder="$t('forms.enter_field', { field: $t('auth.password').toLowerCase() })" />
        </NFormItem>
        <NRow :gutter="[0, 24]">
            <NCol :span="24">
                <div class="mt-5 button-container">
                    <NButton
                        :disabled="!form.username"
                        class="full-width-button"
                        size="large"
                        type="primary"
                        @click="handleSubmit(form)">
                        {{ $t('auth.login') }}
                    </NButton>
                </div>
            </NCol>
        </NRow>
  </NForm>
    </div>
</template>
<style>
.button-container {
  width: 100%; /* O el ancho que desees */
}
.full-width-button {
  width: 100%;
  display: flex;
  text-align: center;
}
</style>