<script setup>
    import { ref } from 'vue';
    import { format, startOfHour, addHours } from 'date-fns';
    import useLocationMap from '@/composables/useLocationMap';
    import ResourceCreator from '@/components/ResourceCreator.vue'

    const model = ref('sales-room')
    const translated = ref('sale_room')
    const permission = ref('salesroom')

    const { center } = useLocationMap()

    const fields = ref([
        {
            field: "name",
            translated: "tables.name",
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "code",
            translated: "tables.code",
            rules: {
                type: String,
                required: true,
                default: null
            },
            table: {
                align: 'right'
            }
        },
        {
            field: "meeting_date",
            translated: "tables.meeting_date",
            rules: {
                type: Date,
                required: false,
                default: format(addHours(startOfHour(new Date()), 1), 'dd/MM/yyyy - HH:mm') //start of next hour
            },
            table: {
                align: 'center'
            }
        },
        {
            field: "hostesses",
            translated: "tables.hostesses",
            rules: {
                type: 'Transfer',
                required: false,
                default: null,
                options: [],
                optionsEndpoint : "hostess"
            },
            table: {
                align: 'center',
                tagsName: 'username' // When you fix this it will go back to be 'name'
            }
        },
        /*{ // TODO: Pending fix in backend
            field: "location",
            translated: "tables.location",
            rules: {
                type: 'Location',
                required: false,
                default: [20.50956, -87.2299585]
            },
            table: {
                align: 'center'
            }
        }*/
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t(translated,2) }}</h1>
    <ResourceCreator
        :endpoint="`/${model}`"
        :translated="translated"
        :model="model"
        :permission-model="permission"
        :fields="fields"
    />
</template>