<script setup>
import {useCryptoStore} from "@/stores/cryptoStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import styles from "@/styles.js";
import {useMainStore} from "@/stores/mainStore.js";
import NewsCard from "@/components/NewsCard.vue";

const cryptoStore = useCryptoStore();
const {cryptoNews} = storeToRefs(cryptoStore);

const totalNumberOfNews = computed(() => cryptoNews.value.length);
const totalPages = computed(() => Math.ceil(totalNumberOfNews.value / 2));


// paginationOptions example:
//        [
//           {label: '1', value: 0},
//           {label: '2', value: 1},
//           {label: '3', value: 2},
//           {label: '4', value: 3},
//           {label: '5', value: 4}
//         ]

const paginationOptions = computed(
    () => Array.from({length: totalPages.value}, (_, i) => ({label: i + 1, value: i}))
);

const slide = ref(0);
const slides = computed(() => Array.from({length: totalPages.value}, (_, i) => i));

const mainStore = useMainStore();
const {isDark} = storeToRefs(mainStore);
const cardStyles = computed(() => ({
  backgroundColor: isDark.value ? styles.b4 : styles.accent
}));

const getNewsItem = (slideIndex, cardIndex) => computed(() => cryptoNews.value[slideIndex * 2 + cardIndex]);

const totalNumberOfNewsPerSlide = 2;
const cardIndexes = Array.from({length: totalNumberOfNewsPerSlide}, (_, i) => i);

</script>

<template>
  <div class="q-pa-md items-start q-gutter-md">
    <q-carousel
        v-model="slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        animated
        control-color="primary"
        class="rounded-borders"
    >
      <q-carousel-slide
          v-for="(slideIndex, index) in slides"
          :name="slideIndex"
          :key="index"
          class="column no-wrap flex-center"
      >
        <div class="row">
          <NewsCard v-for="cardIndex in cardIndexes"
                    :key="cardIndex"
                    :newsItem="getNewsItem(slideIndex, cardIndex).value"
                    :style="cardStyles"
          />
        </div>

      </q-carousel-slide>
    </q-carousel>
  </div>
  <div class="row justify-center">
    <q-btn-toggle
        glossy
        v-model="slide"
        :options="paginationOptions"
    />
  </div>

</template>

<style scoped>
.my-card {
  display: flex;
  flex-direction: column;
}

.q-mt-auto {
  margin-top: auto;
}
</style>