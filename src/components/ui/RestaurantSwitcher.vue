<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Store, ChevronDown, Check, Building2, MapPin } from 'lucide-vue-next';

const authStore = useAuthStore();
const uiStore = useUIStore();
const isOpen = ref(false);

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
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition-colors shadow-2xs text-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4edee3]/30"
      @click="isOpen = !isOpen"
    >
      <div class="w-7 h-7 rounded-lg bg-[#4edee3]/15 text-[#4edee3] flex items-center justify-center shrink-0">
        <Store class="w-4 h-4" />
      </div>
      <div class="flex flex-col min-w-0">
        <span class="text-[10px] font-semibold uppercase tracking-wider text-[#4edee3]">
          {{ authStore.currentRestaurant?.code || 'REST' }}
        </span>
        <span class="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[180px]">
          {{ authStore.currentRestaurant?.name[uiStore.language] || 'Select Location' }}
        </span>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 ms-1 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute top-full mt-2 start-0 w-72 bg-[#0e1722] rounded-2xl border border-slate-800 shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
    >
      <div class="px-3 py-2 border-b border-slate-800/80 mb-1">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Building2 class="w-3.5 h-3.5 text-[#4edee3]" />
          <span>{{ uiStore.language === 'ar' ? 'الفروع والمطاعم المتاحة' : 'Available Locations' }}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-0.5">
          {{ uiStore.language === 'ar' ? 'يتم عزل وحصر البيانات وفقاً للفرع المختار' : 'Data is strictly scoped to selected restaurant' }}
        </p>
      </div>

      <div class="space-y-1">
        <button
          v-for="rest in authStore.availableRestaurants"
          :key="rest.id"
          type="button"
          :class="[
            'w-full flex items-start gap-2.5 p-2.5 rounded-xl text-start transition-all cursor-pointer',
            rest.id === authStore.currentRestaurant?.id
              ? 'bg-[#2c777c]/25 text-[#4edee3] font-semibold border border-[#4edee3]/30'
              : 'hover:bg-slate-800/70 text-slate-300'
          ]"
          @click="selectRestaurant(rest.id)"
        >
          <div
            :class="[
              'w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 font-bold',
              rest.id === authStore.currentRestaurant?.id ? 'bg-[#2c777c] text-white' : 'bg-slate-800 text-slate-400'
            ]"
          >
            {{ rest.code.slice(0, 3) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-xs truncate font-medium">
                {{ rest.name[uiStore.language] }}
              </span>
              <Check v-if="rest.id === authStore.currentRestaurant?.id" class="w-4 h-4 text-[#4edee3] shrink-0" />
            </div>
            <div class="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <MapPin class="w-3 h-3" />
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
