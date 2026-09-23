<script setup lang="ts">
import { PackageOpen } from 'lucide-vue-next';
import Button from './Button.vue';

interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  icon?: any;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  actionLabel: undefined,
  icon: undefined,
  className: ''
});

const emit = defineEmits<{
  (e: 'action'): void;
}>();

function handleAction() {
  emit('action');
}
</script>

<template>
  <div
    :class="[
      'p-10 text-center rounded-2xl border border-dashed border-slate-300 bg-white/70 flex flex-col items-center justify-center',
      className
    ]"
  >
    <!-- Icon Slot / Default Icon -->
    <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
      <slot name="icon">
        <component
          :is="icon"
          v-if="icon"
          class="w-6 h-6 text-slate-500"
        />
        <PackageOpen v-else class="w-6 h-6 text-slate-400" />
      </slot>
    </div>

    <!-- Title -->
    <h4 class="text-sm font-bold text-slate-800">
      {{ title }}
    </h4>

    <!-- Description -->
    <p
      v-if="description"
      class="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed"
    >
      {{ description }}
    </p>

    <!-- Action Slot / Default Button -->
    <slot name="action">
      <Button
        v-if="actionLabel"
        variant="primary"
        size="sm"
        @click="handleAction"
      >
        {{ actionLabel }}
      </Button>
    </slot>
  </div>
</template>
