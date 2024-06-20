import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";


export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
            user: null,
            favourites: useLocalStorage('favourites', {
                symbols: [
                    'ETHUSDT',
                    'BTCUSDT',
                    'ADAUSDT',
                ]
            }),
        }
    ),
    actions: {
        setUser(user) {
            this.user = user;
        },
        addFavourite(coin) {
            this.favourites.symbols.push(coin);
        },
        removeFavourite(coin) {
            this.favourites.symbols = this.favourites.symbols.filter(c => c !== coin);
        }
    }
});
