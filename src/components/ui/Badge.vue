<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeVariant } from '@/types/ui';

interface Props {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md'
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'cyan':
      return 'bg-[#4edee3]/15 text-[#2c777c] border border-[#4edee3]/40';
    case 'teal':
      return 'bg-[#34abb1]/15 text-[#2c777c] border border-[#34abb1]/30';
    case 'success':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'warning':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'danger':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'neutral':
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
});

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';
});
</script>

<template>
  <span :class="['inline-flex items-center gap-1.5 rounded-full font-medium transition-colors', variantClasses, sizeClasses]">
    <slot />
  </span>
</template>
