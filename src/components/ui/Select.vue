<script setup lang="ts">
interface Option {
  value: string;
  label: string;
}

interface Props {
  modelValue?: string;
  label?: string;
  options: Option[];
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-xs font-semibold text-slate-700">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      class="w-full bg-white text-sm text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl py-2 px-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#34abb1] focus:border-[#34abb1] cursor-pointer"
      @change="onChange"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>
