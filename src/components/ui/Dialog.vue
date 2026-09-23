<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { X } from 'lucide-vue-next';
import Button from './Button.vue';
import type { ButtonVariant } from '@/types/ui';

interface Props {
  isOpen?: boolean;
  modelValue?: boolean;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  confirmLoading?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: undefined,
  modelValue: undefined,
  title: undefined,
  description: undefined,
  maxWidth: 'lg',
  showCloseButton: true,
  confirmText: undefined,
  cancelText: undefined,
  confirmVariant: 'primary',
  confirmLoading: false,
  closeOnBackdrop: true,
  closeOnEscape: true
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:isOpen', value: boolean): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const visible = computed(() => {
  if (props.isOpen !== undefined) return props.isOpen;
  if (props.modelValue !== undefined) return props.modelValue;
  return false;
});

const maxWidthStyles = computed(() => {
  switch (props.maxWidth) {
    case 'sm':
      return 'max-w-sm';
    case 'md':
      return 'max-w-md';
    case 'xl':
      return 'max-w-xl';
    case '2xl':
      return 'max-w-2xl';
    case 'lg':
    default:
      return 'max-w-lg';
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

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
  handleClose();
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
      class="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        @click="handleBackdropClick"
      />

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          :class="[
            'w-full transform overflow-hidden rounded-2xl bg-white text-start shadow-xl transition-all border border-slate-200',
            maxWidthStyles
          ]"
          @click.stop
        >
          <!-- Header slot or default header -->
          <slot name="header">
            <div
              v-if="title || description || showCloseButton"
              class="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4"
            >
              <div>
                <h3 v-if="title" class="text-lg font-bold text-slate-900">
                  {{ title }}
                </h3>
                <p v-if="description" class="text-xs text-slate-500 mt-1">
                  {{ description }}
                </p>
              </div>

              <button
                v-if="showCloseButton"
                type="button"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
                @click="handleClose"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </slot>

          <!-- Main Content Slot -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer slot or default actions -->
          <slot name="footer">
            <div
              v-if="confirmText || cancelText"
              class="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3"
            >
              <Button
                v-if="cancelText"
                variant="secondary"
                size="md"
                @click="handleCancel"
              >
                {{ cancelText }}
              </Button>
              <Button
                v-if="confirmText"
                :variant="confirmVariant"
                size="md"
                :loading="confirmLoading"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </Button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
