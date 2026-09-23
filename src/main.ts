import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import { i18n } from './locales';
import App from './app/App.vue';
import './index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
app.use(router);

app.mount('#root');
