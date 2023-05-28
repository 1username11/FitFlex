<template>
  <div v-if="exercise.id" class="flex flex-col grow h-full">
    <div class="flex flex-col">
      <p class="text-lg font-bold mb-4 ">{{ exercise.name }}</p>
      <div class="flex grow">
        <div class="image-wrapper">
          <el-image :src="exercise.img" />
        </div>

        <div class="ml-4">
          <p class="mb-2 text-gray-400">Info</p>
          <div class="flex mb-2">
            <IconEquipment />
            <p>
              Equipment:
            </p>
            <p class="capitalize">&nbsp; {{ exercise.equipment }}</p>
          </div>
          <div class="flex">
            <IconPrimary />
            <p>
              Primary:
            </p>
            <p class="capitalize">&nbsp; {{ exercise.primary }}</p>
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
    <IconDumbell @click="$emit('createExercise')" />

    <p class="text-xl font-bold mt-4">Select an exercise</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  exercise: IExercise
  statistics: IExerciseStatistics
}>()
defineEmits(['createExercise'])

const duration = ref<string>()
const timeOptions = ref(['last 12 week', 'Year', 'All time'])
</script>

<style lang="scss">
.image-wrapper{
  background-color: white;
    display: flex;
    width: 50%;
    aspect-ratio: 1.6 / 1;
    -webkit-box-pack: center;
    justify-content: center;
    overflow: hidden;
    background-color: white;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(224, 224, 224);
}

.statistic-placeholder{
  display: flex;
    flex: 1 1 0%;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    background-color: white;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    border-color: rgb(224, 224, 224);
    padding: 90px 0px 90px 0px;
}
</style>
