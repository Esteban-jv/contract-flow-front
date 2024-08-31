<script setup>
    import { ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { NFlex, NButton, NPopconfirm, NForm, NFormItemGi, NGrid, NIcon, NInput } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import { UserLock } from '@vicons/fa';
    import ObjectForm from '@/components/ObjectForm.vue';
    import api from '@/lib/axios';

    const route = useRoute()
    const router = useRouter()
    const { $t } = useGlobalHelpers()

    const model = ref('user')
    const prevPage = ref('users')
    const id = computed(() => {
        const currentid = route.params.id
        if(currentid)
        { 
            return currentid
        }
        return null
    })
    const fields = computed( () => {
        const static_fields = [
            {
                field: "first_name",
                translated: "tables.first_name",
                span: 12,
                rules: {
                    type: String,
                    default: ''
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "last_name",
                translated: "tables.last_name",
                span: 12,
                rules: {
                    type: String,
                    default: ''
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "date_joined",
                translated: "tables.date_joined",
                span: 12,
                rules: {
                    type: Date,
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "is_active",
                translated: "tables.is_active",
                span: 4,
                rules: {
                    type: Boolean,
                    default: true
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "is_staff",
                translated: "tables.is_staff",
                span: 4,
                rules: {
                    type: Boolean,
                    default: false
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "is_superuser",
                translated: "tables.is_superuser",
                span: 4,
                rules: {
                    type: Boolean,
                    default: false
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "groups",
                translated: "tables.roles",
                span: 8,
                rules: {
                    type: 'Select',
                    required: false,
                    multiple: true,
                    default: [],
                    options: [],
                    optionsEndpoint : "group"
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "user_permissions",
                translated: "tables.permissions",
                span: 16,
                rules: {
                    type: 'Transfer',
                    required: false,
                    default: [],
                    options: [],
                    optionsEndpoint : "permission"
                },
                table: {
                    align: 'left'
                }
            }
        ]
        return id.value ? [
            {
                field: "username",
                translated: "tables.username",
                span: 12,
                rules: {
                    type: String,
                    required: true
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "email",
                translated: "tables.email",
                span: 12,
                rules: {
                    type: String,
                    regex: /^\S+@\S+\.\S+$/,
                },
                table: {
                    align: 'left'
                }
            },
            
        ].concat(static_fields) : [
            {
                field: "username",
                translated: "tables.username",
                span: 8,
                rules: {
                    type: String,
                    required: true
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "password",
                translated: "tables.password",
                span: 8,
                rules: {
                    type: 'Password',
                    required: true
                },
                table: {
                    align: 'left'
                }
            },
            {
                field: "email",
                translated: "tables.email",
                span: 8,
                rules: {
                    type: String,
                    regex: /^\S+@\S+\.\S+$/,
                },
                table: {
                    align: 'left'
                }
            }
        ].concat(static_fields)
    })

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

    const objectPermissions = computed( () => changePassword.value === true ? 'rdd' : 'crud')

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
        :fronendPermissions="objectPermissions"
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        :prev-page="prevPage"
        :id="id"
    />
</template>