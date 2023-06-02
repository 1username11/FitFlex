<template>
  <div v-if="props.exercise.id" :key="props.exercise.id" v-loading="loading" class="flex flex-col grow h-full">
    <div class="flex flex-col">
      <div class="flex justify-between">
        <p class="text-lg font-bold mb-4">{{ props.exercise.name }}</p>
        <el-select v-model="action" placeholder="Select" class="w-[100px]">
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
          <div v-if="props.exercise.media?.split('?')[0].split('/').slice(-1)[0].split('.')[1] === 'mp4'">
            <video
              v-if="!videoError"
              autoplay
              loop
            >
              <source
                :src="props.exercise.media" type="video/mp4"
                @error="handleError"
              >
            </video>

            <ImagePlaseholder v-else />
          </div>

          <el-image
            v-else
            :src="props.exercise.thumbnail"
          >
            <template #error>
              <ImagePlaseholder />
            </template>
          </el-image>
        </div>

        <div class="ml-4">
          <p class="mb-2 text-gray-400">Info</p>

          <div class="flex mb-2">
            <IconEquipment />

            <p>Equipment:</p>

            <p class="capitalize">&nbsp; {{ props.exercise.equipment }}</p>
          </div>

          <div class="flex">
            <IconPrimary />

            <p>Primary:</p>

            <p class="capitalize">&nbsp; {{ props.exercise.primary }}</p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="flex justify-between mt-4">
        <p class="text-lg font-bold mb-4">Statistics</p>

        <el-select v-model="duration">
          <el-option
            v-for="timeOption in timeOptions"
            :key="timeOption"
            :value="timeOption"
          />
        </el-select>
      </div>

      <div>
        <div class="flex flex-col mt-4">
          <p class="text-gray-400 mb-4">Hawiest Weight</p>

          <div v-if="statistics.heaviestWeight">{{ statistics.heaviestWeight }}</div>

          <div v-else class="statistic-placeholder">
            No data in selected time frame
          </div>
        </div>

        <div class="flex flex-col mt-4">
          <p class="text-gray-400 mb-4">Best Set Volume</p>

          <div v-if="statistics.bestSetVolume">{{ statistics.bestSetVolume }}</div>

          <div v-else class="statistic-placeholder">
            No data in selected time frame
          </div>
        </div>

        <div class="flex flex-col mt-4">
          <p class="text-gray-400 mb-4">One Reps Max</p>

          <div v-if="statistics.oneRepMax">{{ statistics.oneRepMax }}</div>

          <div v-else class="statistic-placeholder">
            No data in selected time frame
          </div>
        </div>

        <div class="flex flex-col mt-4">
          <p class="text-gray-400 mb-4">Best Time</p>

          <div v-if="statistics.bestTime">{{ statistics.bestTime }}</div>

          <div v-else class="statistic-placeholder">
            No data in selected time frame
          </div>
        </div>

        <div class="flex flex-col mt-4">
          <p class="text-gray-400 mb-4">Best Time</p>

          <div v-if="statistics.mostReps">{{ statistics.mostReps }}</div>

          <div v-else class="statistic-placeholder">
            No data in selected time frame
          </div>
        </div>
      </div>
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
  exercise: IExercise
  statistics: IExerciseStatistics
}>()

const exerciseStore = useExercisesStore()
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

const duration = ref<string>()
const timeOptions = ref(['last 12 week', 'Year', 'All time'])
const videoError = ref(false)

const handleError = () => {
  videoError.value = true
  console.log('error', videoError.value)
}

async function deleteExercise (id: string) {
  await exercisesService.deleteExercise(id)
}
watch(action, async (value) => {
  if (value === 'edit') {
    modalVisible.value = true
    action.value = ''
  } else if (value === 'delete') {
    console.log('delete', props.exercise.id)
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
      props.exercise.id = ''
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
