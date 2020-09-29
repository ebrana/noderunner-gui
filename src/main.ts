import { createLogger } from 'vuex'
import {createApp} from 'vue'
import App from './App.vue'
// @ts-ignore
import store from './store/store'

createLogger();
createApp(App).use(store).mount('#app')