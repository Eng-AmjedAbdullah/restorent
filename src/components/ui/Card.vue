<script setup lang="ts">
interface Props {
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  className: '',
  padding: 'md'
});
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl border border-slate-200/80 shadow-xs transition-shadow',
      padding === 'none' ? 'p-0' : '',
      padding === 'sm' ? 'p-3.5' : '',
      padding === 'md' ? 'p-5' : '',
      padding === 'lg' ? 'p-7' : '',
      className
    ]"
  >
    <slot />
  </div>
</template>
