import axios from "axios";

export class MyFetch {
    constructor(loadingState) {
        this.axiosInstance = axios.create({ timeout: 60_000 });
        this.loadingState = loadingState;
        this.addInterceptor();
    }

    addInterceptor() {
        this.axiosInstance.interceptors.request.use(config => {
            this.loadingState = true;
            return config;
        });

        this.axiosInstance.interceptors.response.use(response => {
            this.loadingState = false;
            return response;
        }, () => {
            this.loadingState = false;
        });
    }

    async fetch(url, options) {
        return await this.axiosInstance.get(url, options);
    }
}

export default MyFetch;