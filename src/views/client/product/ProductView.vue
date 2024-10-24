<script setup>
    import { ref } from 'vue';
    import ResourceViewer from '@/components/ResourceViewer.vue';

    const model = ref('product')
    /*
    PRODUCT_TYPE_CHOISES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )
    name = models.CharField(max_length=150, null=False, blank=False)
    description = models.CharField(max_length=255, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, null=False, related_name='category')
    type = models.CharField(max_length=10, choices=PRODUCT_TYPE_CHOISES, default='product')
    digital = models.BooleanField(default=True)
    giftable = models.BooleanField(default=True)
     */
    const fields = ref([
        {
            field: "name",
            translated: "name",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "description",
            translated: "description",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "category",
            translated: "category",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left',
                text: 'category.name'
            }
        },
        {
            field: "type",
            translated: "type",
            rules: {
                type: String,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "digital",
            translated: "digital",
            rules: {
                type: Boolean,
                required: true
            },
            table: {
                align: 'left'
            }
        },
        {
            field: "giftable",
            translated: "giftable",
            rules: {
                type: Boolean,
                required: true
            },
            table: {
                align: 'left'
            }
        },
    ])
</script>
<template>
    <h1 class="text-2xl pb-4">{{ $t('product',2) }}</h1>
    <ResourceViewer
        :endpoint="`/${model}`"
        :model="model"
        :fields="fields"
        :filters="true"
    />
</template>