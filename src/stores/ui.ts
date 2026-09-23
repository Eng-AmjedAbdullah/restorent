import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Language, Direction } from '@/types/ui';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export const useUIStore = defineStore('ui', () => {
  const language = ref<Language>('ar');
  const direction = ref<Direction>('rtl');
  const sidebarCollapsed = ref<boolean>(false);
  const mobileMenuOpen = ref<boolean>(false);
  const toasts = ref<ToastItem[]>([]);

  function setLanguage(lang: Language) {
    language.value = lang;
    direction.value = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = direction.value;
  }

  function toggleLanguage() {
    const nextLang = language.value === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setMobileMenuOpen(val: boolean) {
    mobileMenuOpen.value = val;
  }

  function addToast(toast: Omit<ToastItem, 'id'>) {
    const id = `toast-${Date.now()}`;
    const newToast: ToastItem = { ...toast, id };
    toasts.value.push(newToast);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  return {
    language,
    direction,
    sidebarCollapsed,
    mobileMenuOpen,
    toasts,
    setLanguage,
    toggleLanguage,
    toggleSidebar,
    setMobileMenuOpen,
    addToast,
    removeToast
  };
});
