<template>
  <div class="w-full h-[300px]">
    <Scatter :data="data" :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'

const props = defineProps<{
  // data: any
  exerciseId: string
}>()

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)
const statistics = ref()
const data = ref({
  datasets: [
    {
      fill: false,
      borderColor: '#1C82EA',
      backgroundColor: '#1C82EA',
      data: statistics.value
    }
  ]
})

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
})

onMounted(async () => {
  const { data, error } = await exercisesService.getExerciseStatistics(props.exerciseId)
  if (error) throw new Error(error.message)
  // if (data.length === 0) {
  //   statistics.value = {
  //     most_reps: [],
  //     avarage_reps: [],
  //     avarage_duration: [],
  //     best_set_duration: [],
  //     avarage_weight: [],
  //     max_weight: [],
  //     one_reps_max: [],
  //     volume: []
  //   }
  // } else {
  //   statistics.value = {
  //     most_reps: data.map(item => {
  //       return {
  //         x: item.created_at,
  //         y: item.most_reps
  //       }
  //     }),

  //     avarage_reps: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.avarage_reps
  //       }
  //     }),
  //     avarage_duration: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.avarage_duration
  //       }
  //     }),
  //     best_set_duration: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.best_set_duration
  //       }
  //     }),
  //     avarage_weight: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.avarage_weight
  //       }
  //     }),
  //     max_weight: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.max_weight
  //       }
  //     }),
  //     one_reps_max: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.one_reps_max
  //       }
  //     }),
  //     volume: data.map(item => {
  //       return {
  //         x: item.created_at / 1000,
  //         y: item.volume
  //       }
  //     })
  //   }
  // }

  console.log('statistics', statistics.value)

  console.log('data', data)
})

</script>
