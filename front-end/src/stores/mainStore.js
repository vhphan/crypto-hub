import {defineStore} from "pinia";

import myFetch from "@/backendApi/myFetch.js";
import {useLocalStorage} from "@vueuse/core";


export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
            isDark: useLocalStorage('isDark', true),
            loading: false,
        }
    ),

})


export function getMyFetch() {
    return new myFetch(useMainStore().loading);
}
