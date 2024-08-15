<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { NButton, NFlex, NCard, NForm, NGrid, NSelect, NAutoComplete,
        NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, useLoadingBar } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import api from "@/lib/axios";
import DeleteButton from './DeleteButton.vue';

    const router = useRouter()
    const route = useRoute()
    const { $t, $can, $toast, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    const isLoading = ref(false)
    const MAX_OPTION_ITEMS = 50
    const formRef = ref(null);
    const form = ref({})

    const props = defineProps({
        model: {
            type: String,
            required: true
        },
        permissionModel: {
            type: String,
            required: false
        },
        prevPage: {
            type: String,
            required: false
        },
        endpoint: {
            type: String,
            required: true
        },
        fields: {
            type: Array,
            required: true
        }
    })

    const id = computed(() => route.params.id ?? null )
    const permission = computed(() => props.permissionModel ?? props.model)
    const prevPage = computed(() => props.prevPage ?? props.model)
    const disableEdit = computed(() => id.value && !$can('change',permission.value) )
    const disableDelete = computed(() => id.value && !$can('delete',permission.value) )
    const formRules = ref([])

    // Methods
    const onlyAllowNumber = (value) => !value || /^\d+$/.test(value)
    const calculatedSpan = span => {
        if (span)
            return `24 s:12 m:${(span ?? 24)}`
        return 24
    }
    const getFromApi = async endpoint => {
        try {
            const { data } = await api.get(`${endpoint}/`, {
                params: {
                    limit: MAX_OPTION_ITEMS,
                    offset: 0
                }
            })
            return data.results.map( d => { return { label: d.name, value: d.id} })
        } catch (err){
            $toastError(err)
            throw err
        }
    }
    const getResource = async id => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${props.endpoint}/${id}/`)
            form.value = data
            loadingBar.finish()
        } catch (err) {
            loadingBar.error()
            $toastError(err)
        } finally {
            isLoading.value = false
        }
    }
    const goBack = form => {
        router.push({ name: prevPage.value })
    }

    onMounted(async () => {
        const { id } = route.params
        if(id) {
            getResource(id)
        }
        // getResource()
        props.fields.forEach(async (f, i) => {
            // Get field
            const name = f.field
            const translated = f.translated
            // Set ref of form
            form.value[name] = f.rules.default

            // Set validation rules
            const { regex } = f.rules
            const { required } = f.rules
            if(regex) {
                formRules.value[name] = [
                    {
                        validator(rule, value) {
                            if(required && !value) {
                                return new Error($t('forms.field_is_required', { field: $t(translated) }));
                            }
                            if (!value.match(regex)) {
                                return new Error($t('forms.enter_valid_field', { field: $t(translated)}));
                            }
                            return true;
                        },
                    }
                ]
                formRules.value[name][0].trigger = ["input", "blur"]
            } else {
                formRules.value[name] = [ { required: required } ]
                if(required) {
                    formRules.value[name][0].message = $t('forms.field_is_required', { field: $t(translated) })
                    // formRules.value[name][0].trigger = ["input", "blur"] // It doesn't work on selects
                }
            }

            if(f.rules.optionsEndpoint) {
                f.rules.options = await getFromApi(f.rules.optionsEndpoint)
            }
        })

        // Add actions column to a table
        const can_edit = $can('change',permission.value)
        const can_delete = $can('delete',permission.value)
        // console.log(can_edit, can_delete)
        // console.log(formRules.value)
    })

    // Submit method
    const saveChanges = () => {
        // console.log(formRef.value, form.value)
        formRef.value?.validate(
            errors => {
                if(!errors) {
                    createOrUpdateResource()
                } else {
                    // console.log(errors)
                    $toast.open({
                        message: $t('forms.check_all_fields_msg'),
                        type: 'error'
                    })
                }
            }
         )
    }
    // REST Methods
    const createOrUpdateResource = async () => {
        try {
            isLoading.value = true
            loadingBar.start()
            if (form.value.id) {
                const { data } = await api.put(`${props.endpoint}/${form.value.id}/`,form.value)
            } else {
                const { data } = await api.post(`${props.endpoint}/`,form.value)
            }
            loadingBar.finish()
            router.push({ name: prevPage.value })
        } catch (err) {
            // console.warn(err)
            loadingBar.error()
            $toastError(err)
        } finally {
            isLoading.value = false
        }
    }
</script>
<template>
    <NCard
        :title="(form.id ? '' : ($t('tables.add')) + ' ') + $t(model)"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        content-class="p1"
        header-class="p1"
    >
        <NSpace vertical v-if="isLoading">
            <NSkeleton height="40px" :repeat="4" style="margin-top: 24px;" :sharp="false" />
        </NSpace>
        <NForm v-else ref="formRef" :model="form" :rules="formRules" size="medium" label-placement="top">
            <NGrid :span="24" :x-gap="11" item-responsive responsive="screen">
                <NFormItemGi v-for="field in fields" :span="calculatedSpan(field.span)" :label="$t(field.translated)" :path="field.field">
                    <NCheckbox
                        v-if="field.rules.type === Boolean"
                        v-model:checked="form[field.field]"
                        :disabled="disableEdit"
                    >
                        {{ $t(field.translated) }}
                    </NCheckbox>
                    <NInput
                        v-if="field.rules.type === String"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :disabled="disableEdit"
                    />
                    <NInput
                        v-if="field.rules.type === Number"
                        :allow-input="onlyAllowNumber"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :disabled="disableEdit"
                    />
                    <NSelect
                        v-if="field.rules.type === 'Select'"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :options="field.rules.options"
                        :disabled="disableEdit"
                    />
                </NFormItemGi>
            </NGrid>
        </NForm>
        <template #action>
            <NFlex justify="space-between">
                <DeleteButton
                    v-if="!disableEdit"
                    :delete_msg="$t('actions.confirm_msg',{ verb: $t('tables.delete').toLowerCase(), obj: $t(props.model) })"
                    :deleted_msg="$t('messages.deleted_successfully',{ obj: $t(props.model) })"
                    :delete_endpoint="`${props.endpoint}/${id}/`"
                    :onObjectDeleted="() => goBack()"
                />
                <NFlex justify="end">
                    <NButton
                        v-if="!disableEdit"
                        :disabled="isLoading"
                        type="primary"
                        @click="saveChanges()"
                    >{{ (form.id ? $t('tables.edit') : $t('tables.add')) }}</NButton>
                    <NButton :disabled="isLoading" secondary @click="goBack()">{{ $t('actions.go_back') }}</NButton>
                </NFlex>
            </NFlex>
        </template>
    </NCard>
</template>