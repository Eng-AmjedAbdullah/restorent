<script setup lang="ts">
import { ref, computed } from 'vue';
import { User } from 'lucide-vue-next';

interface Props {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  variant?: 'icon' | 'initials';
  alt?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  src: undefined,
  name: '',
  size: 'md',
  status: undefined,
  variant: 'icon',
  alt: undefined,
  className: ''
});

const imgError = ref(false);

const sizeStyles = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-7 h-7 text-xs';
    case 'lg':
      return 'w-11 h-11 text-sm font-semibold';
    case 'xl':
      return 'w-16 h-16 text-lg font-bold';
    case 'md':
    default:
      return 'w-9 h-9 text-xs font-semibold';
  }
});

const iconSizes = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3.5 h-3.5';
    case 'lg':
      return 'w-5.5 h-5.5';
    case 'xl':
      return 'w-8 h-8';
    case 'md':
    default:
      return 'w-4.5 h-4.5';
  }
});

const statusStyles = computed(() => {
  switch (props.status) {
    case 'online':
      return 'bg-emerald-500';
    case 'offline':
      return 'bg-slate-400';
    case 'busy':
      return 'bg-rose-500';
    case 'away':
      return 'bg-amber-500';
    default:
      return '';
  }
});

const initials = computed(() => {
  if (!props.name) return 'U';
  const parts = props.name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

function handleImgError() {
  imgError.value = true;
}
</script>

<template>
  <div
    :class="['relative inline-flex shrink-0', className]"
    :role="'img'"
    :aria-label="name || alt || 'Avatar'"
  >
    <!-- Image -->
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt || name"
      :class="[
        sizeStyles,
        'rounded-full object-cover ring-1 ring-slate-200'
      ]"
      @error="handleImgError"
    />

    <!-- Fallback Initials -->
    <div
      v-else-if="variant === 'initials'"
      :class="[
        sizeStyles,
        'rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center ring-1 ring-emerald-200 select-none'
      ]"
    >
      {{ initials }}
    </div>

    <!-- Fallback Icon -->
    <div
      v-else
      :class="[
        sizeStyles,
        'rounded-full bg-gradient-to-b from-[#132A42] to-[#0A1726] text-[#39DCE6] flex items-center justify-center ring-1 ring-[#1E3F61] shadow-xs select-none'
      ]"
      :title="name"
    >
      <User :class="[iconSizes, 'text-[#39DCE6]']" />
    </div>

    <!-- Status Indicator -->
    <span
      v-if="status"
      :class="[
        'absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-white',
        statusStyles
      ]"
    />
  </div>
</template>
