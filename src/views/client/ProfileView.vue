<script setup>
    import { ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { NFlex, NButton, NPopconfirm, NForm, NFormItemGi, NGrid, NIcon, NInput } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { UserLock } from '@vicons/fa';
    import ObjectForm from '@/components/ObjectForm.vue';
    import api from '@/lib/axios';

    const router = useRouter()
    const { $t } = useGlobalHelpers()

    const model = ref('user')
    const prevPage = ref('profile')
    const id = computed(() => {
        return 1
    })
    const fields = ref([
            {
                field: "first_name",
                translated: "tables.first_name",
                span: 12,
                rules: {
                    type: String,
                    default: ''
                }
            },
            {
                field: "last_name",
                translated: "tables.last_name",
                span: 12,
                rules: {
                    type: String,
                    default: ''
                }
            },
            {
                field: "image",
                translated: "tables.profile_picture",
                span: 24,
                rules: {
                    type: 'File',
                    default: ''
                }
            },
        ])

    // Password stuff
    function validatePasswordStartWith(rule, value) {
      return !!passwordForm.value.password && passwordForm.value.password.startsWith(value) && passwordForm.value.password.length >= value.length;
    }
    function validatePasswordSame(rule, value) {
      return value === passwordForm.value.password;
    }
    const formRef = ref(null)
    const changePassword = ref(false)
    const passwordForm = ref({
        id: id.value,
        password: '',
        repeat_password: ''
    })
    const passwordFormRules = ref({
        password: [
            { required: true, message: $t('forms.field_is_required', { field: $t('tables.password') }), trigger: 'blur' },
            { min: 8, message: $t('forms.min_length', { field: $t('tables.password'), length: 8 }), trigger: 'blur' }
        ],
        repeat_password: [
            { required: true, message: $t('forms.field_is_required', { field: $t('tables.repeat_password') }), trigger: 'blur' },
            { min: 8, message: $t('forms.min_length', { field: $t('tables.repeat_password'), length: 8 }), trigger: 'blur' },
            {
                validator: validatePasswordStartWith,
                message: "Password is not same as re-entered password!",
                trigger: "input"
            },
            {
                validator: validatePasswordSame,
                message: "Password is not same as re-entered password!",
                trigger: ["blur", "password-input"]
            }
        ]
    })
    
    const cancelChangingPassword = () => {
        changePassword.value = false
        passwordForm.value = {
            id: id.value,
            password: '',
            repeat_password: ''
        }
    }
    const handleChangePassword = e => {
        e.preventDefault()
        // first validate form
        formRef.value?.validate(
            errors => {
                if(!errors) {
                // then submit form
                api.put(`/${model.value}/${id.value}/`, passwordForm.value)
                    .then(response => {
                        console.log(response)
                        changePassword.value = false
                        passwordForm.value = {
                            id: id.value,
                            password: '',
                            repeat_password: ''
                        }
                        router.push({ name: prevPage.value })
                    })
                    .catch(error => {
                        console.log(error)
                    })

            } else {
                console.log('error submit!!');
                return false;
            }
        })
    }

    const objectPermissions = ref('ru')

</script>
<template>
    <Transition name="slide-fade" v-if="id">
        <NForm v-if="changePassword" ref="formRef" :model="passwordForm" :rules="passwordFormRules" label-placement="top">
            <NGrid :span="24" :x-gap="11" item-responsive responsive="screen">
                <NFormItemGi :label="$t('tables.password')" path="password" span="m:12 24">
                    <NInput
                        type="password"
                        v-model:value="passwordForm.password"
                        :placeholder="$t('forms.enter_field', { field: $t('tables.password')})"
                    />
                </NFormItemGi>
                <NFormItemGi :label="$t('tables.repeat_password')" path="repeat_password" span="m:12 24">
                    <NInput
                        type="password"
                        v-model:value="passwordForm.repeat_password"
                        :placeholder="$t('forms.enter_field', { field: $t('tables.password')})"
                    />
                </NFormItemGi>
            </NGrid>
        </NForm>
    </Transition>
    <NFlex justify="end" class="mb-4" v-if="id">
        <NButton
            v-if="!changePassword"
            type="warning"
            ghost
            size="large"
            @click="changePassword = true"
        >
            <template #icon>
            <NIcon><UserLock /></NIcon>
            </template>
            {{ $t('auth.change_password') }}
        </NButton>
        <div class="flex" v-else>
            <NButton
                type="tertiary"
                class="mx-2"
                secondary
                size="large"
                @click="cancelChangingPassword()"
            >
                {{ $t('actions.cancel') }}
            </NButton>
            <NPopconfirm
            title="{{ $t('auth.change_password') }}"
            :positive-text="$t('actions.confirm')"
            :negative-text="$t('actions.cancel')"
            @positive-click="handleChangePassword"
            >
                <template #trigger>
                    <NButton
                        type="warning"
                        ghost
                        size="large"
                        icon="arrow-back"
                    >
                    <template #icon>
                    <NIcon><UserLock /></NIcon>
                    </template>
                        {{ $t('auth.change_password') }}
                    </NButton>
                </template>
                {{ $t('auth.sure_of_changin_password') }}
            </NPopconfirm>
        </div>
    </NFlex>
    <ObjectForm
        title="profile"
        :fronendPermissions="objectPermissions"
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        :prev-page="prevPage"
        :id="id"
        hide-back-button
    />
</template>