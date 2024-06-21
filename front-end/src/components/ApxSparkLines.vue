<script setup>

import {useCryptoStore} from "@/stores/cryptoStore.js";
import {storeToRefs} from "pinia";
import {computed, ref} from "vue";
import {useMainStore} from "@/stores/mainStore.js";

const mainStore = useMainStore();
const isDark = storeToRefs(mainStore).isDark;


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

const symbols = computed(() => {
  return Object.keys(cryptoBars.value[selectedTimeFrame.value]);
});

const chartRefs = ref([]);

const chartData = computed(() => {
  return Object.keys(cryptoBars.value[selectedTimeFrame.value]).map((symbol) => {
    return {
      name: symbol,
      data: cryptoBars.value[selectedTimeFrame.value][symbol].map(d => d.close)
    }
  });
});

const baseOptions = {

  stroke: {
    curve: 'straight'
  },
  fill: {
    opacity: 0.3,
  },
};

const chartOptions = computed(() => {
  return symbols.value.map((symbol) => {
    return {
      ...baseOptions,
      // series: [{
      //   data: chartData.value.find(d => d.name === symbol).data
      // }],
      theme: {
        mode: isDark.value ? 'dark' : 'light',
        palette: isDark.value ? 'palette4' : 'palette1',
      },
      title: {
        text: symbol,
        offsetX: 0,
        style: {
          fontSize: '24px',
          color: isDark.value ? '#fff' : '#000'
        }
      },
      subtitle: {
        text: 'Sales',
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: isDark.value ? '#fff' : '#000'
        }
      },
      chart: {
        type: 'area',
        height: 160,
        sparkline: {
          enabled: true
        },
        background: isDark.value ? '#333' : '#fff',
      }

    }
  });
});


</script>

<template>
  <div class="row">
    <q-select
        class="col-12"
        v-model="selectedTimeFrame"
        :options="timeFrameOptions"
        label="Time Frame"
        dense
        emit-value

    />
    <q-space />
    <div ref="chartRefs" v-for="(symbol, idx) in symbols" class="col-3 q-ma-md">
      {{ symbol }}
      <br/>
      <apexchart
          :key="symbol"
          :options="chartOptions.find(o => o.title.text === symbol)"
          type="area"
          width="300"
          :series="[{data: chartData.find(d => d.name === symbol).data}]"
      />
    </div>
    <q-space />
  </div>

</template>

<style scoped>

</style>