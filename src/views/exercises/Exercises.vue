<template>
  <div class="flex gap-4">
    <Filters
      @seeDetails="seeDetails"
    />

    <ExerciseDetailCard :exercise="seeDetailExercise" />
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import ExerciseDetailCard from './components/ExerciseDetailCard.vue'
const seeDetailExercise = ref({} as IExerciseRoutine)

const exercisesStore = useExercisesStore()
const {
  mostReps,
  avarageReps,
  bestSetDuration,
  avarageDuration,
  avarageWeight,
  maxWeight,
  oneRepsMax,
  volume
} = storeToRefs(exercisesStore)

function formatTimestamp (timestamp: number) {
  const date = new Date(timestamp)

  const day = date.getDate().toString().padStart(2, '0')
  const month = getMonthName(date.getMonth())

  return `${month} ${day}`
}

function getMonthName (monthIndex: number) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return months[monthIndex]
}

async function seeDetails (exercise: IExerciseRoutine) {
  seeDetailExercise.value = exercise

  mostReps.value = [['x', 'y']]
  avarageReps.value = [['x', 'y']]
  bestSetDuration.value = [['x', 'y']]
  avarageDuration.value = [['x', 'y']]
  avarageWeight.value = [['x', 'y']]
  maxWeight.value = [['x', 'y']]
  oneRepsMax.value = [['x', 'y']]
  volume.value = [['x', 'y']]

  if (['weight reps', 'weight distance', 'weighted bodyweight']
    .includes(exercise.exercise_type)) {
    const { data, error } = await supabase
      .from('statistics')
      .select('avarage_weight, max_weight, one_reps_max, volume, created_at')
      .eq('exercise_id', exercise.id)
      .eq('user_id', localStorage.getItem('userId'))
      .order('created_at', { ascending: true })

    if (error) throw error
    data.forEach((item) => {
      avarageWeight.value.push([formatTimestamp(item.created_at), item.avarage_weight])
      maxWeight.value.push([formatTimestamp(item.created_at), item.max_weight])
      oneRepsMax.value.push([formatTimestamp(item.created_at), item.one_reps_max])
      volume.value.push([formatTimestamp(item.created_at), item.volume])
    })
  } else if (['assisted bodyweight', 'reps only'].includes(exercise.exercise_type)) {
    const { data, error } = await supabase
      .from('statistics')
      .select('avarage_reps, best_set_duration, avarage_duration, volume, created_at')
      .eq('exercise_id', exercise.id)
      .eq('user_id', localStorage.getItem('userId'))
      .order('created_at', { ascending: true })

    if (error) throw error
    data.forEach((item) => {
      avarageReps.value.push([formatTimestamp(item.created_at), item.avarage_reps])
      mostReps.value.push([formatTimestamp(item.created_at), item.avarage_reps])
      volume.value.push([formatTimestamp(item.created_at), item.volume])
    })
  } else if (['duration', 'distance duration'].includes(exercise.exercise_type)) {
    const { data, error } = await supabase
      .from('statistics')
      .select('best_set_duration, avarage_duration, volume, created_at')
      .eq('exercise_id', exercise.id)
      .eq('user_id', localStorage.getItem('userId'))
      .order('created_at', { ascending: true })
    if (error) throw error
    data.forEach((item) => {
      bestSetDuration.value.push([formatTimestamp(item.created_at), item.best_set_duration])
      avarageDuration.value.push([formatTimestamp(item.created_at), item.avarage_duration])
      volume.value.push([formatTimestamp(item.created_at), item.volume])
    })
  }

}
</script>
