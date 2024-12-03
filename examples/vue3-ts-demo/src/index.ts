import './style.css';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

// @ts-ignore
console.log('import.meta.webpackContext', import.meta?.webpackContext);
