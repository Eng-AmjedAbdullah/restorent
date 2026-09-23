<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { X } from 'lucide-vue-next';

interface Props {
  isOpen?: boolean;
  modelValue?: boolean;
  title?: string;
  subtitle?: string;
  side?: 'end' | 'start' | 'right' | 'left';
  width?: 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: undefined,
  modelValue: undefined,
  title: undefined,
  subtitle: undefined,
  side: 'end',
  width: 'lg',
  closeOnBackdrop: true,
  closeOnEscape: true,
  showCloseButton: true
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:isOpen', value: boolean): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const visible = computed(() => {
  if (props.isOpen !== undefined) return props.isOpen;
  if (props.modelValue !== undefined) return props.modelValue;
  return false;
});

const widthStyles = computed(() => {
  switch (props.width) {
    case 'md':
      return 'max-w-md';
    case 'xl':
      return 'max-w-2xl';
    case 'full':
      return 'max-w-full';
    case 'lg':
    default:
      return 'max-w-lg';
  }
});

const sideClasses = computed(() => {
  switch (props.side) {
    case 'start':
      return 'start-0 border-e';
    case 'left':
      return 'left-0 border-r';
    case 'right':
      return 'right-0 border-l';
    case 'end':
    default:
      return 'end-0 border-s';
  }
});

function handleClose() {
  emit('close');
  emit('update:isOpen', false);
  emit('update:modelValue', false);
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    handleClose();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (props.closeOnEscape && e.key === 'Escape' && visible.value) {
    handleClose();
  }
}

watch(
  visible,
  (isOpen) => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        @click="handleBackdropClick"
      />

      <!-- Panel Container -->
      <div :class="['fixed inset-y-0 flex max-w-full', sideClasses]">
        <div
          :class="[
            'w-screen bg-white shadow-2xl flex flex-col border-slate-200 transform transition-transform duration-300 ease-out',
            widthStyles
          ]"
          @click.stop
        >
          <!-- Header slot or default header -->
          <slot name="header">
            <div
              v-if="title || subtitle || showCloseButton"
              class="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50 shrink-0"
            >
              <div>
                <h3 v-if="title" class="text-base font-bold text-slate-900">
                  {{ title }}
                </h3>
                <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
                  {{ subtitle }}
                </p>
              </div>

              <button
                v-if="showCloseButton"
                type="button"
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close"
                @click="handleClose"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </slot>

          <!-- Scrollable Body Slot -->
          <div class="flex-1 overflow-y-auto p-6">
            <slot />
          </div>

          <!-- Footer Slot -->
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
