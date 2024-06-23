<script setup>
import MainLayout from "./components/MainLayout.vue";
import {useCryptoStore} from "@/stores/cryptoStore.js";
import {onMounted} from "vue";

const cryptoStore = useCryptoStore();
cryptoStore.initMyFetch();

onMounted(() => {
  cryptoStore.fetchUserFavoriteCryptoData('1m');
  cryptoStore.fetchUserFavoriteCryptoData('1h');
  cryptoStore.fetchUserFavoriteCryptoData('1d');
  cryptoStore.fetchCryptoNews('jsonFile');
});

</script>

<template>
  <main-layout/>
</template>