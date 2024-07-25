<script setup>
  import { computed } from 'vue';
  import { RouterView } from 'vue-router'
  import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui';
  import { usePreferences } from './stores/usePreferences';

  const preferences = usePreferences()

  const theme = computed(() => {
    return (preferences.theme === 'dark') ? darkTheme : lightTheme
  })

  const themeOverrides = {
    common: {
      clearColor: '#cfc'
    },
    // ...
  }
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" class="full-body overflow-hidden">
    <RouterView />
  </n-config-provider>
</template>