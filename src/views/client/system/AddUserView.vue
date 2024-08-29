<script setup>
    import { ref, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import ObjectForm from '@/components/ObjectForm.vue';

    const route = useRoute()

    const model = ref('user')
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
</script>
<template>
    <ObjectForm
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        prev-page="users"
        :id="id"
    />
</template>