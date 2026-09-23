<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';

export interface Column<T = any> {
  key: string;
  header?: string;
  label?: string;
  align?: 'start' | 'center' | 'end' | 'left' | 'right';
  width?: string;
  render?: (item: T) => any;
  sortable?: boolean;
}

interface Props {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  striped?: boolean;
  hoverable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  keyExtractor: undefined,
  isLoading: false,
  emptyMessage: 'لا توجد بيانات للعرض حالياً',
  emptyDescription: undefined,
  striped: true,
  hoverable: true
});

const emit = defineEmits<{
  (e: 'rowClick', item: T): void;
}>();

function getItemKey(item: T, index: number): string | number {
  if (props.keyExtractor) {
    return props.keyExtractor(item, index);
  }
  return item.id || item.uuid || item.key || index;
}

function getAlignClass(align?: 'start' | 'center' | 'end' | 'left' | 'right'): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'end':
    case 'right':
      return 'text-end';
    case 'start':
    case 'left':
    default:
      return 'text-start';
  }
}

function handleRowClick(item: T) {
  emit('rowClick', item);
}
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="w-full bg-white border border-slate-200 rounded-xl overflow-hidden p-8 text-center"
    >
      <slot name="loading">
        <div class="inline-block w-8 h-8 border-3 border-[#34abb1] border-t-transparent rounded-full animate-spin mb-3" />
        <p class="text-sm text-slate-500 font-medium">جاري تحميل البيانات...</p>
      </slot>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="data.length === 0"
      class="w-full bg-white border border-slate-200 rounded-xl overflow-hidden p-12 text-center"
    >
      <slot name="empty">
        <p class="text-sm text-slate-600 font-medium">{{ emptyMessage }}</p>
        <p v-if="emptyDescription" class="text-xs text-slate-400 mt-1">
          {{ emptyDescription }}
        </p>
      </slot>
    </div>

    <!-- Table Container -->
    <div
      v-else
      class="w-full overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs"
    >
      <table class="w-full text-sm text-slate-800 border-collapse">
        <thead class="bg-slate-50/90 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'py-3.5 px-4 font-semibold',
                getAlignClass(col.align),
                col.width || ''
              ]"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.header || col.label || col.key }}
              </slot>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="(item, idx) in data"
            :key="getItemKey(item, idx)"
            :class="[
              'transition-colors',
              hoverable ? 'hover:bg-slate-50/70' : '',
              striped && idx % 2 === 1 ? 'bg-slate-50/25' : 'bg-white',
              $attrs.onRowClick ? 'cursor-pointer active:bg-slate-100/60' : ''
            ]"
            @click="handleRowClick(item)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                'py-3.5 px-4 align-middle',
                getAlignClass(col.align)
              ]"
            >
              <!-- Dynamic slot per column key: #cell-name or generic cell slot or col.render or direct value -->
              <slot
                :name="`cell-${col.key}`"
                :item="item"
                :value="item[col.key]"
                :index="idx"
              >
                <slot
                  name="cell"
                  :column="col"
                  :item="item"
                  :value="item[col.key]"
                  :index="idx"
                >
                  <template v-if="col.render">
                    <component :is="() => col.render!(item)" />
                  </template>
                  <template v-else>
                    {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
                  </template>
                </slot>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
