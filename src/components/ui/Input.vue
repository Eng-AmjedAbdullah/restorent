<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  error: '',
  hint: '',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label v-if="label" class="text-xs font-semibold text-slate-700">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div v-if="$slots.prefix" class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
        <slot name="prefix" />
      </div>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full bg-white text-sm text-slate-900 placeholder:text-slate-400 border rounded-xl py-2 px-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#34abb1] focus:border-[#34abb1]',
          $slots.prefix ? 'ps-10' : '',
          $slots.suffix ? 'pe-10' : '',
          error ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' : 'border-slate-200 hover:border-slate-300',
          disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''
        ]"
        @input="onInput"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 end-0 flex items-center pe-3.5 text-slate-400">
        <slot name="suffix" />
      </div>
    </div>
    <span v-if="error" class="text-xs text-rose-600 font-medium">{{ error }}</span>
    <span v-else-if="hint" class="text-xs text-slate-400">{{ hint }}</span>
  </div>
</template>
