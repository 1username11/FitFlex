<template>
  <GChart
    class="w-full h-full"
    type="ColumnChart"
    :data="chartData"
    :options="chartOptions.chart"
  />
</template>

<script lang="ts" setup>
import { GChart } from 'vue-google-charts'

defineProps<{
  chartData: [string, number | string][]
}>()

const chartOptions = ref({
  chart: {
    title: 'Workout duration',
    legend: { position: 'none' },
    chartArea: { width: '90%' }
  }
})
</script>
