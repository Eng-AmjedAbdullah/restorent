<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Store, ChevronDown, Check, Building2, MapPin } from 'lucide-vue-next';

interface Props {
  showFullLabel?: boolean;
}

withDefaults(defineProps<Props>(), {
  showFullLabel: false
});

const authStore = useAuthStore();
const uiStore = useUIStore();
const isOpen = ref(false);
const switcherRef = ref<HTMLElement | null>(null);

function selectRestaurant(id: string) {
  authStore.switchRestaurant(id);
  isOpen.value = false;
  uiStore.addToast({
    title: uiStore.language === 'ar' ? 'تم تبديل الفرع النشط' : 'Switched Active Branch',
    message: authStore.currentRestaurant?.name[uiStore.language],
    type: 'info',
    duration: 3000
  });
}

function handleClickOutside(event: MouseEvent) {
  if (switcherRef.value && !switcherRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="switcherRef" class="relative">
    <button
      type="button"
      class="inline-flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#12202f] hover:bg-[#1a2d40] border border-[#1e344d] hover:border-[#4edee3]/40 transition-all shadow-xs text-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4edee3]/30"
      @click="isOpen = !isOpen"
    >
      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#4edee3]/15 text-[#4edee3] border border-[#4edee3]/30 flex items-center justify-center shrink-0">
        <Store class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4edee3]" />
      </div>
      <div class="flex flex-col min-w-0">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#4edee3]">
          {{ authStore.currentRestaurant?.code || 'REST' }}
        </span>
        <span :class="['text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[170px] md:max-w-[210px]', showFullLabel ? 'block' : 'hidden sm:block']">
          {{ authStore.currentRestaurant?.name[uiStore.language] || 'Select Location' }}
        </span>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 ms-0.5 sm:ms-1 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu (Clean, elegant, non-dark style with crisp dark border) -->
    <div
      v-if="isOpen"
      class="absolute top-full mt-2 start-0 w-72 sm:w-84 bg-white rounded-2xl border-2 border-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.22)] z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-slate-800"
    >
      <div class="px-3 py-2.5 bg-slate-50/90 border border-slate-100 rounded-xl mb-1.5">
        <div class="flex items-center gap-1.5 text-xs font-bold text-[#0f766e] uppercase tracking-wider">
          <Building2 class="w-3.5 h-3.5 text-[#0f766e]" />
          <span>{{ uiStore.language === 'ar' ? 'الفروع والمطاعم المتاحة' : 'Available Locations' }}</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-0.5">
          {{ uiStore.language === 'ar' ? 'يتم عزل وحصر البيانات وفقاً للفرع المختار' : 'Data is strictly scoped to selected restaurant' }}
        </p>
      </div>

      <div class="space-y-1 max-h-64 overflow-y-auto">
        <button
          v-for="rest in authStore.availableRestaurants"
          :key="rest.id"
          type="button"
          :class="[
            'w-full flex items-start gap-2.5 p-2.5 rounded-xl text-start transition-all cursor-pointer',
            rest.id === authStore.currentRestaurant?.id
              ? 'bg-teal-50/90 text-slate-900 font-bold border border-teal-300/80 shadow-xs'
              : 'hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-transparent'
          ]"
          @click="selectRestaurant(rest.id)"
        >
          <div
            :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold tracking-tight',
              rest.id === authStore.currentRestaurant?.id ? 'bg-[#0f766e] text-white shadow-xs' : 'bg-slate-100 text-slate-600 border border-slate-200'
            ]"
          >
            {{ rest.code.slice(0, 3) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span :class="['text-xs truncate', rest.id === authStore.currentRestaurant?.id ? 'font-bold text-slate-900' : 'font-semibold text-slate-800']">
                {{ rest.name[uiStore.language] }}
              </span>
              <Check v-if="rest.id === authStore.currentRestaurant?.id" class="w-4 h-4 text-[#0f766e] shrink-0" />
            </div>
            <div :class="['flex items-center gap-1 text-[11px] mt-0.5', rest.id === authStore.currentRestaurant?.id ? 'text-teal-700' : 'text-slate-500']">
              <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
              <span>{{ rest.city[uiStore.language] }}</span>
              <span>•</span>
              <span>{{ rest.active_tables_count }} {{ uiStore.language === 'ar' ? 'طاولة' : 'tables' }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
