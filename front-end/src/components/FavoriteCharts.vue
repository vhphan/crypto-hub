<script setup>
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {useCryptoStore} from "@/stores/cryptoStore.js";
import LWChart from "@/components/LWChart.vue";

const cryptoStore = useCryptoStore();
const {
  cryptoBars
} = storeToRefs(cryptoStore);

const timeFrameOptions = Object.keys(cryptoBars.value).map((timeFrame) => {
  return {
    value: timeFrame,
    label: timeFrame
  }
});

const selectedTimeFrame = ref(timeFrameOptions[0].value);
const selectedTimeFrameData = computed(() => {
  return cryptoBars.value[selectedTimeFrame.value];
});
const symbols = computed(() => {
  return Object.keys(selectedTimeFrameData.value);
});

const chartRefs = ref([]);

const convertISOtoUnix = (iso) => {
  return new Date(iso).getTime() / 1000;
};

const getChartData = (symbol) => {
  return selectedTimeFrameData.value[symbol].map(d => {
    return {
      time: convertISOtoUnix(d.openTime),
      value: d.close
    }
  });
};

</script>

<template>
  <div ref="chartRefs" v-for="symbol in symbols">
    {{ symbol }}
    <br/>
    <LWChart
        type="line"
        :data="getChartData(symbol)"
        ref="myChart"
        :chart-options="{width: 800, height: 400}"
    />
  </div>
</template>

<style>

</style>