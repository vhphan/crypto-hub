import {defineStore} from "pinia";
import {useUserStore} from "@/stores/userStore.js";
import {links} from "@/backendApi/apiLinks.js";


export const useCryptoStore = defineStore({
    id: 'cryptoStore',
    state: () => ({
        cryptoBars: {
            '1m': [],
            '1h': [],
            '1d': [],
        },
    }),
    actions: {
        getUserFavoriteSymbols() {
            const userStore = useUserStore();
            return userStore.favourites.symbols;
        },
        async fetchUserFavoriteCryptoData(timeFrame) {
            const symbols = this.getUserFavoriteSymbols();
            const url = links.cryptoBars(timeFrame, symbols);
            const response = await fetch(url);
            const data = await response.json();
            this.cryptoBars[timeFrame] = data.data;
        },
    }
})