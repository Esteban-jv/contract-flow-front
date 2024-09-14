<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { NButton, NFlex, NCard, NForm, NGrid, NSelect, NDatePicker, NTransfer, NUpload,
        NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, useLoadingBar } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import api from "@/lib/axios";
import DeleteButton from './DeleteButton.vue';

    const router = useRouter()
    const route = useRoute()
    const { $t, $can, $toast, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    const isLoading = ref(true)
    const MAX_OPTION_ITEMS = 350
    const formRef = ref(null);
    const form = ref({})

    const props = defineProps({
        model: {
            type: String,
            required: true
        },
        id: {
            type: [String, Number],
            required: false,
            default: null
        },
        permissionModel: {
            type: String,
            required: false
        },
        fronendPermissions: {
            type: String,
            required: false,
            default: 'crud'
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
        },
        title: {
            type: String,
            required: false
        },
        hideBackButton: {
            type: Boolean,
            required: false,
            default: false
        }
    })

    const id = computed(() => props.id ?? null )
    const permission = computed(() => props.permissionModel ?? props.model)
    const modelOrTitle = computed(() => props.title ?? props.model)
    const prevPage = computed(() => props.prevPage ?? props.model)
    const disableEdit = computed(() => id.value && !$can('change',permission.value) )
    const disableDelete = computed(() => id.value && !$can('delete',permission.value) )
    const can_add = computed(() => $can('add',permission.value))
    const can_edit = computed(() =>  $can('change',permission.value))
    const can_delete = computed (() => $can('delete',permission.value))
    const formRules = ref([])

    // Methods
    const onlyAllowNumber = (value) => !value || /^\d+$/.test(value)
    const calculatedSpan = span => {
        if (span)
            return `24 s:12 m:${(span ?? 24)}`
        return 24
    }
    const getFromApi = async (endpoint, filters=null, value='id') => {
        try {
            const params = {
                ...filters,
                limit: MAX_OPTION_ITEMS,
                offset: 0,
            }
            const { data } = await api.get(`${endpoint}/`, {params})
            return data.results.map( d => { return { label: d.name, value: d[value]} })
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
    const handleFileChange = (file) => {
        console.log(file)
        console.log(file[0])
        console.log(file[0].file)
        form.value.image = file[0].file
    }

    onMounted(async () => {
        isLoading.value = true
        // First build the form rules
        for(var i = 0; i < props.fields.length; i++) {
            const f = props.fields[i]
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
                f.rules.options = await getFromApi(f.rules.optionsEndpoint, f.rules.endpointFilters ?? null, f.rules.idValue ?? 'id') 
            }
        }
        const { id } = props
        if(id) {
            await getResource(id)
        }
        isLoading.value = false
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
                // form.value.image = null
                console.warn("U P D A T E",form.value)
                const { data } = await api.put(`${props.endpoint}/${form.value.id}/`,form.value, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
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
        :title="(form.id ? '' : ($t('tables.add')) + ' ') + $t(modelOrTitle)"
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
                        :maxlength="field.rules.maxLength ?? 256"
                    />
                    <NInput
                        v-if="field.rules.type === 'Password'"
                        type="password"
                        show-password-on="click"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :disabled="disableEdit"
                        :maxlength="field.rules.maxLength ?? 256"
                    />
                    <NInput
                        v-if="field.rules.type === Number"
                        :maxlength="field.rules.maxLength ?? 256"
                        :allow-input="onlyAllowNumber"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :disabled="disableEdit"
                    />
                    <NSelect
                        v-if="field.rules.type === 'DynamicSelect'"
                        filterable tag
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :options="field.rules.options"
                        :disabled="disableEdit"
                    />
                    <NSelect
                        v-if="field.rules.type === 'Select'"
                        clearable
                        :multiple="field.rules.multiple === true ? true : false"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :options="field.rules.options"
                        :disabled="disableEdit"
                    />
                    <NDatePicker
                        v-if="field.rules.type === Date"
                        v-model:formatted-value="form[field.field]"
                        :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                        format="dd/MM/yyyy - HH:mm"
                        value-format="dd/MM/yyyy - HH:mm"
                        class="w-full"
                        type="datetime"
                        clearable
                    />
                    <NTransfer
                        v-if="field.rules.type === 'Transfer'"
                        v-model:value="form[field.field]"
                        :options="field.rules.options"
                        :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                        class="w-full"
                    />
                    <NUpload
                        list-type="image-card"
                        name="image"
                        :multiple="field.rules.multiple === true ? true : false"
                        accept="image/*"
                        :default-upload="true"
                        :max="1"
                        v-if="field.rules.type === 'File'"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.select_field', { field: $t(field.translated)})"
                        @update:file-list="handleFileChange"
                    >
                        {{ $t('forms.upload_file') }}
                    </NUpload>
                </NFormItemGi>
            </NGrid>
        </NForm>
        <template #action>
            <NFlex justify="space-between">
                <DeleteButton
                    v-if="!disableEdit && props.fronendPermissions.includes('d') && can_delete"
                    :disabled="props.fronendPermissions.includes('dd')"
                    :delete_msg="$t('actions.confirm_msg',{ verb: $t('tables.delete').toLowerCase(), obj: $t(props.model) })"
                    :deleted_msg="$t('messages.deleted_successfully',{ obj: $t(props.model) })"
                    :delete_endpoint="`${props.endpoint}/${id}/`"
                    :onObjectDeleted="() => goBack()"
                />
                <NFlex justify="end">
                    <NButton
                        v-if="!disableEdit"
                        :disabled="isLoading || !props.fronendPermissions.includes('u') || (!can_add && !id) || (!can_edit && id)"
                        type="primary"
                        @click="saveChanges()"
                    >{{ (form.id ? $t('tables.edit') : $t('tables.add')) }}</NButton>
                    <NButton v-if="!props.hideBackButton" :disabled="isLoading" secondary @click="goBack()">{{ $t('actions.go_back') }}</NButton>
                </NFlex>
            </NFlex>
        </template>
    </NCard>
</template>