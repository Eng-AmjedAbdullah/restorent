<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
const { locale } = useI18n();

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = uiStore.language;
    document.documentElement.dir = uiStore.direction;
  }
  locale.value = uiStore.language;
});

watch(
  () => uiStore.language,
  (newLang) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
      document.documentElement.dir = uiStore.direction;
    }
    locale.value = newLang;
  }
);
</script>

<template>
  <router-view />
</template>
