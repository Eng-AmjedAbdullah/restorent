<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonVariant, ButtonSize } from '@/types/ui';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  loading: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#2c777c] hover:bg-[#236064] text-white shadow-sm border border-transparent focus:ring-[#34abb1]';
    case 'secondary':
      return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs focus:ring-[#34abb1]';
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500';
    case 'ghost':
      return 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400';
    case 'outline':
      return 'bg-transparent border border-[#2c777c] text-[#2c777c] hover:bg-[#2c777c]/5 focus:ring-[#2c777c]';
    default:
      return 'bg-[#2c777c] text-white';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5';
    case 'lg':
      return 'px-5 py-2.5 text-base rounded-xl gap-2.5';
    case 'md':
    default:
      return 'px-3.5 py-2 text-sm rounded-xl gap-2';
  }
});

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
      variantClasses,
      sizeClasses
    ]"
    @click="handleClick"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>
