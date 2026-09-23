<script setup lang="ts">
import { useUIStore } from '@/stores/ui';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-vue-next';

const uiStore = useUIStore();
</script>

<template>
  <div class="fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
    <div
      v-for="toast in uiStore.toasts"
      :key="toast.id"
      class="pointer-events-auto bg-white rounded-2xl border border-slate-200/90 shadow-lg p-3.5 flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200"
    >
      <div class="shrink-0 mt-0.5">
        <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-600" />
        <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-amber-500" />
        <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-rose-600" />
        <Info v-else class="w-5 h-5 text-[#2c777c]" />
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-slate-900">{{ toast.title }}</h4>
        <p v-if="toast.message" class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ toast.message }}</p>
      </div>

      <button
        type="button"
        class="text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
        @click="uiStore.removeToast(toast.id)"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
