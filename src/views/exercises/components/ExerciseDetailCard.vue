<template>
  <div v-if="props.exercise.id" :key="props.exercise.id" v-loading="loading" class="flex flex-col grow h-full">
    <div class="flex flex-col">
      <div class="flex justify-between">
        <p class="text-lg font-bold mb-4">{{ props.exercise.title }}</p>
        <el-select v-if="!exercise.is_public" v-model="action" placeholder="Select" class="w-[100px]">
          <el-option
            v-for="item in actions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="md:flex">
        <div class="image-wrapper">
          <div v-if="props.exercise.exercise_media_url?.split('?')[0].split('/').slice(-1)[0].split('.')[1] === 'mp4'">
            <video
              v-if="!videoError"
              autoplay
              loop
            >
              <source
                :src="props.exercise.exercise_media_url" type="video/mp4"
                @error="handleError"
              >
            </video>

            <ImagePlaseholder v-else />
          </div>

          <el-image
            v-else
            :src="props.exercise.thumbnails_url"
          >
            <template #error>
              <ImagePlaseholder class="w-[100px] h-[100px]" />
            </template>
          </el-image>
        </div>

        <div class="ml-4">
          <p class="mb-2 text-gray-400">Info</p>

          <div class="flex mb-2">
            <IconEquipment />

            <p>Equipment:</p>

            <p class="capitalize">&nbsp; {{ props.exercise.equipment_category }}</p>
          </div>

          <div class="flex">
            <IconPrimary />

            <p>Primary:</p>

            <p class="capitalize">&nbsp; {{ props.exercise.muscle_group }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between mt-4">
      <p class="text-lg font-bold mb-4">Statistics</p>
    </div>

    <div v-if="!isStatisticsEmpty">
      <div
        v-for="statisticsItem in formatedStatistics"
        :key="statisticsItem.label"
        class="max-w-[660px]"
      >
        <div v-if="statisticsItem.data.length > 1" class="flex flex-col mt-4">
          <div class="border border-gray-300 rounded-lg overflow-hidden">
            <Chart :chartData="statisticsItem.data" :label="statisticsItem.label" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex justify-center items-center w-full h-[500px] text-gray-400 text-2xl font-semibold"
    >
      No Data
    </div>
  </div>

  <div v-else class="flex flex-col py-[30%] items-center grow h-full">
    <IconDumbell />

    <p class="text-xl font-bold mt-4">Select an exercise</p>
  </div>

  <div v-if="modalVisible">
    <CreateExercise
      :exerciseId="exercise.id"
      class="popup-wrapper"
      @close="modalVisible = false"
    />
    <div class="overlay" @click="modalVisible = !modalVisible" />
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  exercise: IExerciseRoutine
}>()

const exerciseStore = useExercisesStore()
const {
  mostReps,
  avarageReps,
  bestSetDuration,
  avarageDuration,
  avarageWeight,
  maxWeight,
  oneRepsMax,
  volume
} = storeToRefs(exerciseStore)
const { getExercises, getMuscleGroups, getExerciseTypes, getEquipment } = exerciseStore

const loading = ref(false)
const modalVisible = ref(false)
const action = ref<string>('')
const actions = ref([
  {
    label: 'Edit',
    value: 'edit'
  },
  {
    label: 'Delete',
    value: 'delete'
  }
])

const formatedStatistics = computed(() => {
  return [
    {
      label: 'Most reps',
      data: mostReps.value as [string, number | string][]
    },
    {
      label: 'Avarage reps',
      data: avarageReps.value as [string, number | string][]
    },
    {
      label: 'Avarage duration',
      data: avarageDuration.value as [string, number | string][]
    },
    {
      label: 'Best set duration',
      data: bestSetDuration.value as [string, number | string][]
    },
    {
      label: 'Avarage weight',
      data: avarageWeight.value as [string, number | string][]
    },
    {
      label: 'Max weight',
      data: maxWeight.value as [string, number | string][]
    },
    {
      label: 'One reps max',
      data: oneRepsMax.value as [string, number | string][]
    },
    {
      label: 'Volume',
      data: volume.value as [string, number | string][]
    }
  ]
})

const isStatisticsEmpty = computed(() => {
  return formatedStatistics.value.every((item) => item.data.length === 1)
})

const videoError = ref(false)

const handleError = () => {
  videoError.value = true
}

async function deleteExercise (id: string) {
  await exercisesService.deleteExercise(id)
}

watch(action, async (value) => {
  if (value === 'edit') {
    modalVisible.value = true
    action.value = ''
  } else if (value === 'delete') {
    await deleteExercise(props.exercise.id).then(() => {
      action.value = ''
    })
    loading.value = true
    Promise.allSettled([
      getMuscleGroups(),
      getExerciseTypes(),
      getEquipment()
    ]).then(() => {
      getExercises()
    }).catch((e) => {
      console.log(e)
    }).finally(() => {
      loading.value = false
    })
  }
})
</script>

<style lang="scss">
.image-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 320px;
  aspect-ratio: 1.6 / 1;
  overflow: hidden;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(224, 224, 224);
}

.statistic-placeholder{
  display: flex;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(224, 224, 224);
    padding: 90px 0px 90px 0px;
}
</style>
