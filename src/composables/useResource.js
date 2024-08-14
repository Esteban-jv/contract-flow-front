import { ref, computed, reactive, h } from "vue";
import { useGlobalHelpers } from "./useGlobalHelpers";
import { useLoadingBar, NInput, NIcon, NCheckbox, NSelect } from "naive-ui";
import { CheckCircle, TimesCircle, Times, Edit } from '@vicons/fa';
import api from "@/lib/axios";

export function useResource() {
    // Helpers
    const { $t, $toast, $toastError } = useGlobalHelpers()
    const loadingBar = useLoadingBar()
    // Data
    const isLoading = ref(false)
    // For pagination
    const pageSizes = ref([5, 10, 20, 50])
    const MAX_OPTION_ITEMS = ref(50)
    const pagination = reactive({
        pageSize:5,
        page:1
    })
    const items = ref([])
    // Methos
    const getFromApi = async endpoint => {
        try {
            const { data } = await api.get(`${endpoint}/`, {
                params: {
                    limit: MAX_OPTION_ITEMS.value,
                    offset: 0
                }
            })
            return data.results.map( d => { return { label: d.name, value: d.id} })
        } catch (err){
            $toastError(err)
            throw err
        }
    }
    const onlyAllowNumber = (value) => !value || /^\d+$/.test(value)
    const formatCurrency = (value) => {
        if (value === null)
          return "";
        return `$ ${value.toLocaleString("es-MX")}`;
      }
    const parseCurrency = (input) => {
        const nums = input.replace(/(,|\$|\s)/g, "").trim();
        if (/^\d+(\.(\d+)?)?$/.test(nums))
          return Number(nums);
        return nums === "" ? null : Number.NaN;
      }
    const calculatedSpan = span => {
        if (span)
            return `24 s:12 m:${(span ?? 24)}`
        return 24
    }
    const makeRules = async fields => {
        const rules = []
        fields.forEach(async f => {
            // Get field
            const name = f.field
            const translated = f.translated
            // Set ref of form
            // form.value[name] = f.rules.default

            // Set validation rules
            const { regex } = f.rules
            const { required } = f.rules
            if(regex) {
                rules[name] = [
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
                rules[name][0].trigger = ["input", "blur"]
            } else {
                rules[name] = [ { required: required } ]
                if(required) {
                    rules[name][0].message = $t('forms.field_is_required', { field: $t(translated) })
                    // formRules.value[name][0].trigger = ["input", "blur"] // It doesn't work on selects
                }
            }

            if(f.rules.optionsEndpoint) {
                f.rules.options = await getFromApi(f.rules.optionsEndpoint)
            }
        })
        return rules
    }

    const updatePage = (page, endpoint) => {
        pagination.page = page
        getResource(endpoint)
    }

    // Render Item Functions
    const renderIcon = (icon, props={}) => h(NIcon, null, { default: () => h(icon, props) });
    const itemData = (current, fields) => {
        fields.forEach(f => {
            const { field, table } = f
            if(current[field]) {
                // we need to get the value from the object by table.text which contains the field name like 'sales_room.name'
                const fieldz = table.text.split('.')
                current[field] = fieldz.reduce((acc, val) => acc[val], current)
            }
        })
        return current
    }
    const itemTagsData = (current, fields) => {
        fields.forEach(f => {
            const { field, table } = f
            if(current[field]) {
                // console.log(current, field, table)
                const field_name = table.tagsName
                current[field] = current[field].map( f => {
                    // console.log(f)
                    const field_contain = f[field_name]
                    // console.log(field_contain)
                    return field_contain
                }).join(', ')
            }
        })
        return current
    }
    // Render Input Functions
    const inputText = (row, index, f, items) => {
        const { field, translated } = f
        return h(NInput, {
            value: row[field],
            placeholder: $t('forms.enter_field', { field: translated ? $t(translated) : '?' }),
            class: "my-1",
            onUpdateValue(v) {
                items[index][field] = v;
            }
        });
    }
    const checkBox = (row, index, name, items) => {
        return h(NCheckbox, {
            defaultChecked: row[name],
            onUpdateChecked(v) {
                items[index][name] = v;
            }
        });
    }
    const select = (row, index, f, items) => {
        const { field, translated, rules } = f
        const options = rules.options
        return h(NSelect, {
            value: row[field],
            placeholder: $t('forms.select_field', { field: translated ? $t(translated) : '' }),
            class: "my-1",
            options,
            onUpdateValue(v) {
                items[index][field] = v;
            }
        });
    }
    const renderInput = (row, index, f, items) => {
        const { rules } = f
        switch (rules.type) {
            case String:
                return inputText(row, index, f, items)
            case Boolean:
                return checkBox(row, index, f.field, items)
            case 'Select':
                return select(row, index, f, items)
            default:
                return inputText(row, index, f, items)
        }
    }
    const getResource = async endpoint => {
        try {
            isLoading.value = true
            loadingBar.start()
            const { data } = await api.get(`${endpoint}/`, {
                params: {
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize
                }
            })
            items.value = data.results
            console.log(items.value)
            pagination.itemCount = data.count
            pagination.pageCount = Math.ceil(data.count / pagination.pageSize)
            loadingBar.finish()
        } catch (err) {
            // console.error(err)
            loadingBar.error()
            $toast.open({
                message: $t('forms.something_went_wrong'),
                type: 'error'
            })
        } finally { isLoading.value = false }
    }
    // Render Columns Functions
    const mapColumns = fields => {
        return fields.map((f) => {
            // Get field
            const name = f.field
            const translated = f.translated

            // Set Table Columns
            var current = {
                align: f.table.align,
                title: $t(translated),
                key: name,
                width: f.table.width || '15%',
            }
            if(f.rules.type === Boolean) {
                current.render = ((row) => row.status ? 
                    renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                    renderIcon(TimesCircle, { color: '#D50049'}))
            }
            return current
        })
    }
    const mapEditableColumns = (fields, items) => {
        const fieldColumns = fields.map((f) => {
            // Get field
            const name = f.field
            const translated = f.translated

            // Set Table Columns
            var current = {
                title: $t(translated),
                key: name,
                render: (row, index) => renderInput(row, index, f, items)
            }
            return current
        })
        return fieldColumns
    }
    const mapGroupedEditableColumns = (fields, items) => {
        // console.warn("Editable", fields)
        const fieldColumns = fields.map((f) => {
            // Get field
            const name = f.title
            const translated = f.title

            // Set Table Columns
            var current = {
                align: f.table.align,
                title: $t(translated),
                key: name,
                render: (row, index) => {
                    return f.fields.map( currentField => renderInput(row, index, currentField, items) )
                },
                width: f.table.width,
                // className: "p-0 m-0"
                // colSpan: () => 2,
                // rowSpan: () => 2,
            }
            // if(f.rules.type === Boolean) {
                // current.render = ((row) => row.status ? 
                //     renderIcon(CheckCircle, { color: '#0e7a0d'}) : 
                //     renderIcon(TimesCircle, { color: '#D50049'}))
            // }
            return current
        })
        // console.error(fieldColumns)
        return fieldColumns
    }

    
    return {
        loadingBar,
        isLoading,
        items,
        pagination,
        pageSizes,
        MAX_OPTION_ITEMS,

        onlyAllowNumber,
        formatCurrency,
        parseCurrency,
        calculatedSpan,

        updatePage,

        renderIcon,
        itemData,
        itemTagsData,
        getFromApi,
        getResource,
        mapColumns,
        mapEditableColumns,
        mapGroupedEditableColumns,

        makeRules
    }
}