<template>
  <div class="flex flex-col p-4 bg-white rounded-lg border border-gray-200">
    <p class="mb-5 text-gray-400">Filters</p>
    <div class="select-wrapper">
      <el-select v-model="equipmentForFiltering" class="mb-4" placeholder="All Equipment">
        <el-option
          v-for="equipmentsItem in equipments"
          :key="equipmentsItem"
          :value="equipmentsItem"
        />
      </el-select>
    </div>

    <div class="select-wrapper">
      <el-select v-model="primaryForFIltering" class="mb-4" placeholder="Primary">
        <el-option
          v-for="primaryItem in primaries"
          :key="primaryItem"
          :value="primaryItem"
        />
      </el-select>
    </div>

    <div>
      <div class="flex justify-between mb-4">
        <div class="text-gray-400">Library</div>

        <div>
          <p class="text-[#1D83EA]">+ Create Exercises</p>
        </div>
      </div>

      <div class="mb-4">
        <el-input v-model="inputFilteringValue" placeholder="Search" />
      </div>

      <div
        v-for="exersice in filteredExercises"
        :key="exersice.id"
      >
        <div
          class="flex items-center border-b border-b-gray-200 h-[90px]"
          @click="$emit('addExercise', exersice)"
        >
          <PlusIcon />
          <el-image :src="exersice.img" class="w-8 h-8 rounded-full overflow-hidden" />

          <div class="ml-2">
            <div>
              {{ exersice.name }}
            </div>
            <div class="text-gray-400">
              {{ exersice.primary }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineEmits(['addExercise'])

const routinesStore = useRoutinesStore()
const { exercises } = storeToRefs(routinesStore)

const equipments = ref(exercises.value.map(exercise => exercise.equipment)
  .filter((equipment, index, array) => array.indexOf(equipment) === index))

const primaries = ref(exercises.value
  .map((exercise) => exercise.primary)
  .filter((primary, index, array) => array.indexOf(primary) === index))

const equipmentForFiltering = ref<string>('')
const primaryForFIltering = ref<string>('')
const inputFilteringValue = ref<string>('')

const filteredExercises = computed(() => {
  const filteringValue = inputFilteringValue.value.toLowerCase().trim()

  return exercises.value.filter((exercise) => {
    const meetsEquipmentFilter =
      !equipmentForFiltering.value || exercise.equipment === equipmentForFiltering.value
    const meetsPrimaryFilter =
      !primaryForFIltering.value || exercise.primary === primaryForFIltering.value
    const meetsSearchFilter =
      !filteringValue ||
      exercise.name.toLowerCase().includes(filteringValue) ||
      exercise.primary.toLowerCase().includes(filteringValue)

    return meetsEquipmentFilter && meetsPrimaryFilter && meetsSearchFilter
  })
})
</script>

<style lang="scss">
.select-wrapper {
  .el-select {
    .el-input__wrapper {
      background: #f0f0f0;
    }
    .el-input.is-focus .el-input__wrapper {
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
    }
    :hover:not(.el-select--disabled) .el-input__wrapper{
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
    }
  }
}
</style>
