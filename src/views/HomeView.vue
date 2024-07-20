<script setup>
  import { usePreferences } from '@/stores/usePreferences';

  const preferences = usePreferences()
</script>

<template>
  <label for="locale">Locale: </label>
  <select v-model="$i18n.locale" id="locale" @change="preferences.setLocaleInStorage()">
    <option v-for="locale in $i18n.availableLocales" :value="locale">{{ locale }}</option>
  </select>
  <h1 class="text-4xl">{{ $t('intro_msg') }}</h1>
</template>
