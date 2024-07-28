<script setup>
  import { computed } from 'vue';
  import { RouterView } from 'vue-router'
  import { darkTheme, lightTheme, NConfigProvider, NLoadingBarProvider } from 'naive-ui';
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
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" class="full-body overflow-hidden">
    <NLoadingBarProvider>
      <RouterView />
    </NLoadingBarProvider>
  </NConfigProvider>
</template>