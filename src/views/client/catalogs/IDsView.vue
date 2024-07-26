<script setup>
    import { ref, h, computed, onMounted } from 'vue';
    import { NDataTable, NIcon, NButton, NFlex } from 'naive-ui';
    import { CheckCircle, TimesCircle } from '@vicons/fa';
    import { useRouter } from 'vue-router';
    import PartnerAPI from '@/api/client/PartnerAPI';
    import { i18n } from '@/plugins/i18n';

    // const router = useRouter()

    function renderIcon(icon) {
      return () => h(NIcon, null, { default: () => h(icon) });
    }

    const columns = ref([
        {
            title: i18n.global.t('tables.name'),
            key: 'name'
        },
        {
            title: i18n.global.t('tables.description'),
            key: 'description'
        },
        {
            title: i18n.global.t('tables.status'),
            key: 'status',
            render: (row) => h(NIcon, null, { default: () => h(
                row.status ? CheckCircle : TimesCircle, { color: row.status ? "#0e7a0d" : "#D50049" }
            ) })
        },
        {
            title: i18n.global.t('tables.actions'),
            key: 'actions',
            render(row) {
                return h(
                NButton,
                {
                    size: "small",
                    onClick: () => actionMethod(row)
                },
                { default: () => i18n.global.t('tables.edit'), }
                );
            }
        }
    ])
    const items = ref([])
    const pagination = ref(null)

    const hasPagination = computed(() => false)

    onMounted(async () => {
        try {
            const { data } = await PartnerAPI.getOficialIds()
            items.value = data
        } catch (err) {
            console.error(err)
        }
    })

    const actionMethod = row => console.log("row",row)
    const add = () => console.log("Add new row")
    
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('official_id',2) }}</h1>
    <NFlex justify="end" class="py-3">
        <NButton @click="add">
            {{ $t('tables.add_new', { item: $t('official_id')}) }}
        </NButton>
    </NFlex>
    <div class="w-full">
        <NDataTable
            :bordered="false"
            :single-line="false"
            single-column
            :columns="columns"
            :data="items"
            :pagination="hasPagination ? pagination : []"
        />
    </div>
</template>