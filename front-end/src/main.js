import {createApp} from 'vue'
import {Dialog, Notify, Quasar} from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from '@/App.vue'
import router from "@/router/index.js";
import {createPinia} from "pinia";
import VueApexCharts from "vue3-apexcharts";
import {getMyFetch} from "@/stores/mainStore.js";
import {useCryptoStore} from "@/stores/cryptoStore.js";

const myApp = createApp(App)
const pinia = createPinia();

myApp.use(Quasar, {
    plugins: {
        Notify,
        Dialog,
    }, // import Quasar plugins and add here
    config: {
        notify: { /* Notify defaults */},
        dialog: { /* Dialog defaults */},
        dark: {
            // specify default dark mode
        }
    }
})

myApp.use(router);
myApp.use(pinia);
myApp.use(VueApexCharts);
myApp.mount('#app');

// const cryptoStore = useCryptoStore();
// cryptoStore.initMyFetch();
