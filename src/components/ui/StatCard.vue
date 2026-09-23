<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  iconBg?: string;
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  trend: '',
  trendUp: true,
  iconBg: 'bg-[#4edee3]/15 text-[#2c777c]'
});
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-[#34abb1]/40 transition-colors">
    <div class="flex items-center justify-between gap-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {{ title }}
      </span>
      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg]">
        <slot name="icon" />
      </div>
    </div>

    <div class="mt-3 flex items-baseline gap-2">
      <span class="text-2xl font-bold tracking-tight text-slate-900">
        {{ value }}
      </span>
      <span
        v-if="trend"
        :class="[
          'text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
          trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        ]"
      >
        <span v-if="trendUp">↑</span>
        <span v-else>↓</span>
        {{ trend }}
      </span>
    </div>

    <p v-if="subtitle" class="mt-1 text-xs text-slate-500">
      {{ subtitle }}
    </p>

    <div v-if="$slots.footer || $slots.default" class="mt-2">
      <slot name="footer" />
      <slot />
    </div>
  </div>
</template>
