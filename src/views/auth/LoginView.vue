<script setup>
    import { ref, onBeforeMount } from 'vue';
    import { useRouter } from 'vue-router';
    import { NButton, NInput, NFormItem, NForm, NRow, NCol } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { useAuth } from '@/stores/useAuth';
    import domain from '@/utils/domain';

    const { $t } = useGlobalHelpers()
    const { getToken, login, flush } = useAuth()
    const router = useRouter()
    const nextView = ref('')

    const isAdmin = ref(false)

    onBeforeMount(() => {
        isAdmin.value = domain.isAdmin()
        nextView.value = (isAdmin.value ? 'master' : 'language')
        if(getToken()) {
            goNext()
        }
    })

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
                        return new Error($t('forms.field_is_required', { field: $t('auth.username')}));
                    }
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
                        return new Error($t('forms.field_is_required', { field: $t('auth.password')}));
                    }
                    return true;
                },
                trigger: ["input", "blur"]
            }
        ]
    })

    const handleSubmit = async (formData) => {
        try {
            loading.value = true
            const r = await login(formData)
            console.log(r)
            if(r === true) {
                router.push({
                    name: nextView.value
                })
            } else if (r.response && r.response.data) {
                const { data } = r.response
                if(data.detail === $t('auth.invalid_token')) {
                    flush()
                }
            }
            loading.value = false
        } catch(err) {
            console.warn(err)
            loading.value = false
        }
    }
</script>

<template>
    <div class="shadow-xl">
        <div
            class="rounded-ss-xl rounded-se-xl p-2"
            :class="[isAdmin ? 'bg-blue-100 dark:bg-zink-900' : 'bg-green-100 dark:bg-green-900']"
        >
            <h1
                class="text-5xl font-extrabold text-center dark:text-white mt-5"
                :class="[isAdmin ? 'text-blue-950' : 'text-green-950']"
            >{{ $t('auth.access') }}</h1>
        <p
            class="text-xl dark:text-white text-center my-3"
            :class="[isAdmin ? 'text-blue-800' : 'text-green-800']"
        >{{ $t('auth.welcome_msg') }}</p>
    </div>

    <NForm :model="form" :rules="formRules" class="p-4 bg-white dark:bg-zinc-900">
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
                        strong secondary :type="isAdmin ? 'info' : 'primary'"
                        :disabled="!form.username || loading"
                        class="full-width-button"
                        size="large"
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