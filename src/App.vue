<script setup>
  import { computed } from 'vue';
  import { RouterView } from 'vue-router'
  import { darkTheme, lightTheme, NConfigProvider } from 'naive-ui';
  import { usePreferences } from './stores/usePreferences';

  const preferences = usePreferences()

  const theme = computed(() => {
    return (preferences.theme === 'dark') ? darkTheme : lightTheme
  })
</script>

<template>
  <n-config-provider :theme="theme">
    <RouterView />
  </n-config-provider>
</template>