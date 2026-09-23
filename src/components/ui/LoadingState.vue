<script setup lang="ts">
interface Props {
  message?: string;
  rows?: number;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  message: 'جاري المعالجة...',
  rows: 4,
  className: ''
});
</script>

<template>
  <div
    :class="[
      'w-full space-y-3 p-6 bg-white rounded-xl border border-slate-200',
      className
    ]"
    role="status"
    aria-live="polite"
  >
    <!-- Spinner & Message Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-5 h-5 border-2 border-[#34abb1] border-t-transparent rounded-full animate-spin shrink-0" />
      <span class="text-xs font-semibold text-slate-600">{{ message }}</span>
    </div>

    <!-- Skeleton Rows -->
    <div
      v-for="i in rows"
      :key="i"
      class="animate-pulse flex items-center space-s-4"
    >
      <div class="rounded-full bg-slate-200 h-10 w-10 shrink-0" />
      <div class="flex-1 space-y-2 py-1">
        <div class="h-3 bg-slate-200 rounded-md w-3/4" />
        <div class="h-2 bg-slate-100 rounded-md w-1/2" />
      </div>
    </div>
  </div>
</template>
