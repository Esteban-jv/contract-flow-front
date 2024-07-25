<script setup>
    import { NLayoutFooter, NDivider, NText, NSpace } from 'naive-ui';
</script>
<template>
    <NLayoutFooter bordered position="static">
        <div class="footer-links p-5 w-full pb-0">
            <n-space justify="space-around" size="large">
                <NSpace vertical>
                    <NText>
                        {{ $t('about')}}
                    </NText>
                </NSpace>

                <NSpace vertical>
                    <NText>
                        {{ $t('help')}}
                    </NText>
                </NSpace>

                <NSpace vertical>
                    <NText>
                        {{ $t('contact')}}
                    </NText>
                </NSpace>
            </n-space>
        </div>
        <NDivider role="separator" />
        <div class="p-5 text-center pt-0">
            <NText>
                ContractFlow v0.1 - {{ $t('made_by') }} Esteban Juarez - 2024
            </NText>
        </div>
    </NLayoutFooter>
</template>