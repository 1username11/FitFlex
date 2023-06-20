<template>
  <GChart
    class="w-full h-full max-w-[660px]"
    type="LineChart"
    :data="chartData"
    :options="chartOptions.chart"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { GChart } from 'vue-google-charts'

const props = defineProps<{
  chartData: [string, number | string][]
  label: string
}>()

const chartOptions = ref({
  chart: {
    title: props.label,
    curveType: 'function',
    legend: { position: 'none' },
    hAxis: {
    }
  }
})
</script>
