<script setup>
import {useCryptoStore} from "@/stores/cryptoStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import styles from "@/styles.js";
import {useMainStore} from "@/stores/mainStore.js";

const cryptoStore = useCryptoStore();
const {cryptoNews} = storeToRefs(cryptoStore);

const slide = ref(0);
const slides = [0, 1, 2, 3, 4];

const mainStore = useMainStore();
const {isDark} = storeToRefs(mainStore);
const cardStyles = computed(() => ({
  backgroundColor: isDark.value ? styles.b4 : styles.accent
}));

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
          <q-card v-for="cardIndex in [0, 1]"
                  style="max-width:500px; margin: 5px;"
                  :style="cardStyles"
                  class="my-card
                  text-white
                  col-6
                  q-pa-xs"
          >

            <q-card-section v-if="cryptoNews[slideIndex * 2 + cardIndex]">
              <div class="text-h6">{{ cryptoNews[slideIndex * 2 + cardIndex].title }}</div>
              <div class="text-subtitle2">{{ cryptoNews[slideIndex * 2 + cardIndex].source }}</div>
            </q-card-section>
            <q-separator dark/>

            <q-card-section v-if="cryptoNews[slideIndex * 2 + cardIndex]">
              {{ cryptoNews[slideIndex * 2 + cardIndex].description }}
            </q-card-section>

            <q-separator class="q-mt-auto" dark/>

            <q-card-actions class=""
            v-if="cryptoNews[slideIndex*2+cardIndex]"
            >
              <q-btn flat
                     icon="open_in_new"
                     :href="cryptoNews[slideIndex*2+cardIndex].url" target="_blank"
                      label="Read More"
              >
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>

      </q-carousel-slide>
    </q-carousel>
  </div>
  <div class="row justify-center">
    <q-btn-toggle
        glossy
        v-model="slide"
        :options="[
          {label: '1', value: 0},
          {label: '2', value: 1},
          {label: '3', value: 2},
          {label: '4', value: 3},
          {label: '5', value: 4}
        ]"
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