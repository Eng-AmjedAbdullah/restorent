<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { DEMO_PASSWORD } from '@/data/providers/mock.provider';
import { LogIn, Lock, Mail, Globe, ShieldCheck } from 'lucide-vue-next';
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const ui = useUIStore();
const email = ref('sara.qahtani@restoraintel.com');
const password = ref(DEMO_PASSWORD);
const error = ref('');
const isLoading = ref(false);
const personas = [
  { email: 'admin@restoraintel.com', ar: 'مدير النظام', en: 'System administrator' },
  { email: 'sara.qahtani@restoraintel.com', ar: 'مديرة العمليات', en: 'Operations director' },
  { email: 'ahmed.mansoor@restoraintel.com', ar: 'مدير فرع', en: 'Branch manager' },
  { email: 'khalid.ghamdi@restoraintel.com', ar: 'موظف محدود الصلاحيات', en: 'Limited-permission staff' },
];
async function handleLogin() {
  if (isLoading.value) return;
  error.value = ''; isLoading.value = true;
  try {
    await auth.login(email.value.trim(), password.value);
    const redirect = route.query.redirect;
    await router.replace(typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Demo login failed.';
  } finally { isLoading.value = false; }
}
function selectPersona(value: string) { email.value = value; password.value = DEMO_PASSWORD; error.value = ''; }
</script>

<template>
  <div class="min-h-screen bg-[#08131F] text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
    <div class="absolute -top-40 -start-40 w-96 h-96 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-40 -end-40 w-96 h-96 bg-[#34abb1]/10 rounded-full blur-3xl pointer-events-none" />
    <div class="relative z-10 w-full max-w-md space-y-6">
      <div class="text-center space-y-3">
        <img class="w-20 h-20 object-contain mx-auto" src="/branding/logo-without-bg-trimmed.webp" alt="RestoraIntel" />
        <h1 class="text-3xl font-black tracking-tight" dir="ltr">Restora<span class="text-[#4edee3]">Intel</span></h1>
        <p class="text-sm text-slate-400">{{ ui.language === 'ar' ? 'نظام إدارة المطاعم — وضع المحاكاة' : 'Restaurant management — demo mode' }}</p>
      </div>
      <form class="space-y-4 p-6 sm:p-8 bg-[#111e2c] border border-[#284252] rounded-3xl shadow-2xl" @submit.prevent="handleLogin">
        <div class="flex items-center justify-between gap-4">
          <span class="inline-flex items-center gap-2 text-xs font-semibold text-[#4edee3]"><ShieldCheck class="w-4 h-4" />{{ ui.language === 'ar' ? 'بيانات تجريبية، دون اتصال بالخادم' : 'Demo data — no backend connection' }}</span>
          <button type="button" class="text-xs text-slate-200 underline" @click="ui.toggleLanguage"><Globe class="w-4 h-4 inline" /> {{ ui.language === 'ar' ? 'English' : 'العربية' }}</button>
        </div>
        <label class="block space-y-2"><span class="text-sm font-semibold">{{ ui.language === 'ar' ? 'البريد الإلكتروني' : 'Email' }}</span>
          <span class="relative block"><Mail class="absolute start-3 top-3.5 w-4 h-4 text-slate-500" /><input v-model="email" type="email" required autocomplete="username" dir="ltr" class="w-full ps-10 pe-3 py-3 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 text-sm focus:border-[#4edee3] outline-none" /></span>
        </label>
        <label class="block space-y-2"><span class="text-sm font-semibold">{{ ui.language === 'ar' ? 'كلمة مرور الحساب التجريبي' : 'Demo password' }}</span>
          <span class="relative block"><Lock class="absolute start-3 top-3.5 w-4 h-4 text-slate-500" /><input v-model="password" type="password" required autocomplete="current-password" dir="ltr" class="w-full ps-10 pe-3 py-3 rounded-xl bg-slate-900 border border-slate-600 text-slate-100 text-sm focus:border-[#4edee3] outline-none" /></span>
        </label>
        <p v-if="error" role="alert" class="text-sm text-rose-200 border border-rose-600 bg-rose-950/70 p-3 rounded-xl">{{ error }}</p>
        <button type="submit" :disabled="isLoading" class="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-[#4edee3] text-[#08131F] font-extrabold disabled:opacity-50"><LogIn class="w-4 h-4" />{{ isLoading ? '...' : ui.language === 'ar' ? 'دخول' : 'Sign in' }}</button>
        <div class="border-t border-slate-700 pt-4 space-y-2">
          <p class="text-xs text-slate-400">{{ ui.language === 'ar' ? 'اختر شخصية لاختبار حدود الصلاحيات:' : 'Choose a persona to test access controls:' }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button v-for="p in personas" :key="p.email" type="button" :class="['p-3 rounded-xl border text-start text-xs transition-colors', email === p.email ? 'border-[#4edee3] bg-[#4edee3]/10' : 'border-slate-700 hover:border-slate-500']" @click="selectPersona(p.email)">
              <span class="block font-bold text-white">{{ p[ui.language] }}</span><span class="block text-[10px] text-slate-400 mt-1 truncate" dir="ltr">{{ p.email }}</span>
            </button>
          </div>
          <p class="text-[11px] text-slate-400" dir="ltr">Demo password: {{ DEMO_PASSWORD }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
