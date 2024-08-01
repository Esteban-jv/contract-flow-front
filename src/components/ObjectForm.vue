<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { NButton, NFlex, NCard, NForm, NGrid, NSelect, NAutoComplete,
        NFormItemGi, NInput, NCheckbox, NSkeleton, NSpace, useLoadingBar } from 'naive-ui';
    import { useGlobalHelpers } from '@/composables/useGlobalHelpers';
    import api from "@/lib/axios";

    const router = useRouter()
    const { $t, $can, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()

    const isLoading = ref(false)
    const MAX_OPTION_ITEMS = 50
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

    const permission = computed(() => props.permissionModel ?? props.model)
    const prevPage = computed(() => props.prevPage ?? props.model)
    const formRules = ref([])

    // Methods
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
    const goBack = form => {
        router.push({ name: props.model })
    }

    onMounted(async () => {
        // getResource()
        props.fields.forEach(async (f, i) => {
            // Get field
            const name = f.field
            const translated = f.translated
            // Set ref of form
            form.value[name] = f.rules.default

            // Set validation rules
            formRules.value[name] = [
                {
                    required: f.rules.required
                }
            ]
            if(f.rules.required) {
                formRules.value[name][0].message = $t('forms.field_is_required', { field: $t(translated) }),
                formRules.value[name][0].trigger = ["input", "blur"]
            }

            if(f.rules.optionsEndpoint) {
                f.rules.options = await getFromApi(f.rules.optionsEndpoint)
            }
        })

        // Add actions column to a table
        const can_edit = $can('change',permission.value)
        const can_delete = $can('delete',permission.value)
        console.log(can_edit, can_delete)
    })

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
            console.warn(prevPage)
            console.warn(prevPage.value)
            router.push({ name: prevPage.value })
        } catch (err) {
            console.warn(err)
            loadingBar.error()
            $toastError(err)
        } finally {
            isLoading.value = false
        }
    }
</script>
<template>
    <NCard
        :title="(form.id ? $t('tables.edit') : $t('tables.add')) + ' ' + $t(model)"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        content-class="p1"
        header-class="p1"
    >
        <NSpace vertical v-if="isLoading">
            <NSkeleton height="40px" :repeat="3" style="margin-top: 24px;" :sharp="false" />
        </NSpace>
        <NForm v-else ref="formRef" :model="form" :rules="formRules" size="medium" label-placement="top">
            <NGrid :span="24" :x-gap="11" item-responsive responsive="screen">
                <NFormItemGi v-for="field in fields" :span="calculatedSpan(field.span)" :label="$t(field.translated)" :path="field.field">
                    <NCheckbox
                        v-if="field.rules.type === Boolean"
                        v-model:checked="form[field.field]"
                    >
                        {{ $t(field.translated) }}
                    </NCheckbox>
                    <NInput
                        v-if="field.rules.type === String"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                    />
                    <NInput
                        v-if="field.rules.type === Number && !field.rules.options"
                        v-model:value="form[field.field]" type="number"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                    />
                    <NSelect
                        v-if="field.rules.type === Number && field.rules.options"
                        v-model:value="form[field.field]"
                        :placeholder="$t('forms.enter_field', { field: $t(field.translated)})"
                        :options="field.rules.options"
                    />
                </NFormItemGi>
            </NGrid>
        </NForm>
        <template #action>
            <NFlex justify="end">
                <NButton :disabled="isLoading" type="primary" @click="createOrUpdateResource()">{{ $t('actions.save') }}</NButton>
                <NButton :disabled="isLoading" secondary @click="goBack()">{{ $t('actions.go_back') }}</NButton>
            </NFlex>
        </template>
    </NCard>
</template>