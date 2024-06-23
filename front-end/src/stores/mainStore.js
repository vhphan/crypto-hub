import {defineStore} from "pinia";

import myFetch from "@/backendApi/myFetch.js";


export const useMainStore = defineStore({
    id: 'main',
    state: () => ({
            isDark: true,
            loading: false,
        }
    ),

})


export function getMyFetch() {
    return new myFetch(useMainStore().loading);
}
