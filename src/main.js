import './assets/main.scss'

import { createApp } from 'vue'
import router from "@/router/index.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";

const pinia = createPinia()
const persist = createPersistedState()
const app = createApp(App)

pinia.use(persist)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
