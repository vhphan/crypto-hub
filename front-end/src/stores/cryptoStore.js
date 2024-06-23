import {defineStore} from "pinia";
import {useUserStore} from "@/stores/userStore.js";
import {links} from "@/backendApi/apiLinks.js";
import {getMyFetch} from "@/stores/mainStore.js";

let MyFetch;

export const useCryptoStore = defineStore({
    id: 'cryptoStore',
    state: () => ({
        cryptoBars: {
            '1m': {},
            '1h': {},
            '1d': {},
        },
        cryptoNews: [],
    }),
    actions: {
        initMyFetch() {
            MyFetch = getMyFetch();
        },

        getUserFavoriteSymbols() {
            const userStore = useUserStore();
            const {symbols} = userStore.favourites;
            return symbols;
        },

        async fetchUserFavoriteCryptoData(timeFrame) {
            const symbols = this.getUserFavoriteSymbols();
            const url = links.cryptoBars(timeFrame, symbols);
            const jsonData = (await MyFetch.fetch(url)).data;
            this.cryptoBars[timeFrame] = jsonData.data;
        },

        async fetchCryptoNews(mode) {
            const url = links.cryptoNews(mode);
            const jsonData = (await MyFetch.fetch(url)).data;
            this.cryptoNews = jsonData.data;
        },

    }
})