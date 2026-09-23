<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { LogIn, Sparkles, Building, Lock, Mail, Globe } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const email = ref('sara.qahtani@restoraintel.com');
const password = ref('password123');
const isLoading = ref(false);

async function handleLogin() {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
    <!-- Background glow accents -->
    <div class="absolute -top-40 -start-40 w-96 h-96 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -end-40 w-96 h-96 bg-[#34abb1]/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
      <div class="inline-flex items-center justify-center p-3.5 rounded-2xl bg-[#0b131a] border border-slate-800 shadow-2xl mb-4">
        <img src="/branding/logo-without-bg-trimmed.webp" alt="RestoraIntel" class="h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(78,222,227,0.3)]" />
      </div>
      <div dir="ltr" class="flex items-center justify-center select-none font-sans">
        <span class="font-black text-white text-3xl sm:text-4xl tracking-tight">Restora</span>
        <span class="font-black text-[#4edee3] text-3xl sm:text-4xl tracking-tight ms-1">Intel</span>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
      <div class="bg-[#0e1722] py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800/80">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              {{ uiStore.language === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }}
            </label>
            <div class="relative">
              <Mail class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                v-model="email"
                type="email"
                required
                class="w-full ps-10 pe-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4edee3] focus:ring-1 focus:ring-[#4edee3]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">
              {{ uiStore.language === 'ar' ? 'كلمة المرور' : 'Password' }}
            </label>
            <div class="relative">
              <Lock class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                v-model="password"
                type="password"
                required
                class="w-full ps-10 pe-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#4edee3] focus:ring-1 focus:ring-[#4edee3]"
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400">
              {{ uiStore.language === 'ar' ? 'الدور: مدير العمليات' : 'Role: Operations Director' }}
            </span>
            <button
              type="button"
              class="text-xs text-[#4edee3] hover:underline cursor-pointer flex items-center gap-1"
              @click="uiStore.toggleLanguage"
            >
              <Globe class="w-3.5 h-3.5" />
              {{ uiStore.language === 'ar' ? 'English' : 'العربية' }}
            </button>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-gradient-to-r from-[#4edee3] to-[#34abb1] hover:brightness-105 transition-all shadow-lg shadow-[#34abb1]/20 cursor-pointer disabled:opacity-50"
          >
            <LogIn class="w-4 h-4" />
            <span>{{ uiStore.language === 'ar' ? 'تسجيل الدخول للنظام' : 'Sign in to RestoraIntel' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
