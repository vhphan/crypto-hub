<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  newsItem: Object
});
</script>

<template>
  <q-card v-if="newsItem" style=""

          class="my-card text-white col-6 q-pa-xs">
    <q-card-section>
      <div class="text-h6">{{ newsItem.title }}</div>
      <div class="text-subtitle2">{{ newsItem.source }}</div>
      <span class="absolute-bottom-right">{{ newsItem.published_at }}</span>
    </q-card-section>
    <q-separator dark/>
    <q-card-section>{{ newsItem.description }}</q-card-section>
    <q-separator class="q-mt-auto" dark/>
    <q-card-actions>
      <q-btn flat icon="open_in_new" :href="newsItem.url" target="_blank" label="Read More"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.my-card {
  display: flex;
  flex-direction: column;
  min-width:500px;
  max-width:500px;
  margin: 5px;
  margin-left: auto;
  margin-right: auto;
}

.q-mt-auto {
  margin-top: auto;
}
</style>