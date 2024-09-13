<script setup>

import {useCryptoStore} from "@/stores/cryptoStore.js";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import {useMainStore} from "@/stores/mainStore.js";
import styles from "@/styles.js";
import {debounce} from "quasar";

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


const chartType = ref('area');

const symbolSummaries = computed(() => {
  return symbols.value.map((symbol) => {
    const data = chartData.value.find(d => d.name === symbol).data;
    let lastPriceValue = data[data.length - 1];
    return {
      symbol,
      lastPrice: lastPriceValue.toLocaleString(),
      change: lastPriceValue - data[0],
      percentChange: (((lastPriceValue - data[0]) / data[0]) * 100).toFixed(2),
    }
  });
});

const chartOptions = computed(() => {
  return symbols.value.map((symbol) => {
    return {
      stroke: {
        curve: 'straight',
      },
      fill: {
        opacity: 0.3,
      },
      // series: [{
      //   data: chartData.value.find(d => d.name === symbol).data
      // }],
      colors: isDark.value ? [styles.b2] : [styles.accent],

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
        text: selectedTimeFrame.value,
        offsetX: 0,
        style: {
          fontSize: '14px',
          color: isDark.value ? '#fff' : '#000'
        }
      },
      chart: {
        type: chartType.value,
        sparkline: {
          enabled: true
        },
        background: isDark.value ? '#333' : '#fff',
      }
    }
  });
});

function updateSummary(symbol) {
  const subtitleElements = Array.from(document.querySelectorAll('.my-subtitle'));
  const subtitleElement = subtitleElements.find(e => e.getAttribute('data-symbol') === symbol);
  if (!subtitleElement) return;
  const summary = symbolSummaries.value.find(s => s.symbol === symbol);
  // const arrow = summary.change >= 0 ? '↑' : '↓';
  const arrow = summary.change >= 0 ? 'arrow_upward' : 'arrow_downward';
  const arrowHtml = `<span class="material-icons arrow" style="color: ${summary.change >= 0 ? 'green' : 'red'};">${arrow}</span>`;
  const color = summary.change >= 0 ? 'green' : 'red';

  subtitleElement.innerHTML = `USD$ ${summary.lastPrice} ${arrowHtml} <span style="color: ${color};"> ${summary.percentChange}%</span>`;
}

const onChartMounted = (chartContext, symbol) => {
  console.log(chartContext);
  updateSummary(symbol);
}

watch(() => symbolSummaries.value, () => {
  symbols.value.forEach((symbol) => {
    updateSummary(symbol);
  });
  //update chart height
  // chartRefs.value.forEach((chartRef) => {
  //
  // });
});

const containerRef = ref(null);
const chartWidth = ref(500);

const stackedVertically = ref(false);

const checkStacked = () => {
  const charts = document.querySelectorAll('.chart-container');
  for (let i = 1; i < charts.length; i++) {
    const prevChart = charts[i - 1].getBoundingClientRect();
    const currChart = charts[i].getBoundingClientRect();
    if (currChart.top >= prevChart.bottom) {
      console.log('stacked vertically');
      return true;
    }
  }
  console.log('stacked horizontally');
  return false;
}

onMounted(() => {
  stackedVertically.value = checkStacked();
});

const onResize = debounce((size) => {
  console.log(size);
  // check if chart has been rendered using chartRefs
  if (chartRefs.value.length === 0) return;

  stackedVertically.value = checkStacked();
  if (stackedVertically.value) {
    chartRefs.value.forEach((chartRef) => {
      chartRef.updateOptions({
        chart: {
          width: 0.6 * size.width
        }
      });
    });
    return;
  }

  chartRefs.value.forEach((chartRef) => {
    chartRef.updateOptions({
      chart: {
        width: (size.width - 10)
      }
    });
  });


}, 300)


</script>

<template>
  <div class="row my-row">
    <q-select
        class="col-6"
        v-model="selectedTimeFrame"
        :options="timeFrameOptions"
        label="Time Frame"
        emit-value
        outlined
    />
    <q-select
        class="col-6"
        v-model="chartType"
        :options="['area', 'line', 'bar']"
        label="Chart Type"
        emit-value
        outlined
    />
  </div>
  <div class="row my-row" ref="containerRef">
    <div
        v-for="(symbol, idx) in symbols"
        :data-symbol="symbol"
        :key="symbol"
        class="col-12 col-md-4 chart-container"
    >
      <q-resize-observer @resize="onResize"/>
      <apexchart
          ref="chartRefs"
          :key="symbol"
          :options="chartOptions.find(o => o.title.text === symbol)"
          type="area"
          :width="chartWidth"
          :series="[{data: chartData.find(d => d.name === symbol).data}]"
          @mounted="(ctx)=>onChartMounted(ctx,  symbol)"
      />
      <div class="my-subtitle" :data-symbol="symbol">
      </div>
    </div>
  </div>

</template>

<style scoped>
.my-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.my-subtitle {
  font-size: 18px;
  text-align: center;
  margin-top: 10px;
}

</style>
<style>
.arrow {
  font-size: 30px;
}
</style>