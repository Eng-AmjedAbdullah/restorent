<script setup lang="ts">
import { computed } from 'vue';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: any;
}

interface Props {
  tabs: TabItem[];
  activeTab?: string;
  modelValue?: string;
  variant?: 'pill' | 'underline';
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: undefined,
  modelValue: undefined,
  variant: 'pill',
  className: ''
});

const emit = defineEmits<{
  (e: 'change', tabId: string): void;
  (e: 'update:modelValue', tabId: string): void;
}>();

const currentActive = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue;
  if (props.activeTab !== undefined) return props.activeTab;
  return props.tabs.length > 0 ? props.tabs[0].id : '';
});

function handleSelect(tabId: string) {
  emit('change', tabId);
  emit('update:modelValue', tabId);
}
</script>

<template>
  <!-- Underline Variant -->
  <div
    v-if="variant === 'underline'"
    :class="['border-b border-slate-200 overflow-x-auto', className]"
  >
    <nav class="flex space-s-6 -mb-px">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="[
          'py-3 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer',
          tab.id === currentActive
            ? 'border-[#34abb1] text-[#2c777c] font-bold'
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
        ]"
        @click="handleSelect(tab.id)"
      >
        <component
          :is="tab.icon"
          v-if="tab.icon"
          class="w-4 h-4 shrink-0"
        />
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count !== undefined"
          :class="[
            'text-xs px-2 py-0.5 rounded-full transition-colors',
            tab.id === currentActive
              ? 'bg-[#4edee3]/20 text-[#2c777c] font-bold'
              : 'bg-slate-100 text-slate-600'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </nav>
  </div>

  <!-- Pill Variant (Default) -->
  <div
    v-else
    :class="[
      'flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto',
      className
    ]"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      :class="[
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer',
        tab.id === currentActive
          ? 'bg-white text-[#2c777c] shadow-xs ring-1 ring-[#34abb1]/40 font-bold'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
      ]"
      @click="handleSelect(tab.id)"
    >
      <component
        :is="tab.icon"
        v-if="tab.icon"
        class="w-3.5 h-3.5 shrink-0"
      />
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        :class="[
          'text-[11px] px-1.5 py-0.2 rounded-full font-bold transition-colors',
          tab.id === currentActive
            ? 'bg-[#4edee3]/20 text-[#2c777c]'
            : 'bg-slate-200 text-slate-600'
        ]"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>
