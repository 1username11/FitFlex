<template>
  <div class="flex flex-col justify-center items-center bg-white max-w-[550px] p-5 rounded-lg">
    <p class="text-lg font-bold mb-4 w-full">Create Exercise</p>

    <el-image class="w-[80px] h-[80px] rounded-full overflow-hidden border mb-5" />

    <button class="text-[#1D83EA] cursor-pointer mb-5">
      Add Image
    </button>

    <div class="border-b border-b-gray-300 py-6 w-full element-input-wrapper">
      <el-input
        v-model="title"
        class="text-xl text-gray-400"
        placeholder="Exercise Name"
      />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Exercise type
      </p>

      <el-select-v2 v-model="type" :options="exerciseTypes" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Equipment
      </p>

      <el-select-v2 v-model="equipment" :options="equipments" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Primary Muscle Group
      </p>

      <el-select-v2 v-model="primary" :options="muscleGroups" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Secondary Muscle Group
      </p>

      <el-select-v2 v-model="secondary" :options="muscleGroups" class="ml-2" />
    </div>

    <div class="flex justify-end items-end w-full">
      <el-button type="primary" class="mt-28 w-[200px]" @click="insertExercise(exersiceForm)">
        Create Exercise
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const title = ref('')
const type = ref('')
const equipment = ref('')
const primary = ref('')
const secondary = ref('')

const exercisesStore = useExercisesStore()
const { insertExercise } = exercisesStore
const {
  hashedMuscleGroups,
  hashedExerciseTypes,
  hashedEquipment
} = storeToRefs(exercisesStore)
console.log(hashedMuscleGroups.value, hashedExerciseTypes.value, hashedEquipment.value)

const exerciseTypes = ref(Object.entries(hashedExerciseTypes.value)
  .map(([key, value]) => ({ label: value, value: key })))
const equipments = ref(Object.entries(hashedEquipment.value)
  .map(([key, value]) => ({ label: value, value: key })))
const muscleGroups = ref(Object.entries(hashedMuscleGroups.value)
  .map(([key, value]) => ({ label: value, value: key })))

const exersiceForm = computed(() => {
  return {
    title,
    equipment_category: equipment,
    muscle_group: primary,
    secondary_muscles: secondary,
    exercise_type: type
  }
})

</script>

<style lang="scss">
.element-input-wrapper{
.el-input__wrapper {
  box-shadow: none !important;
  padding: 1px 0px 1px 0px !important;
}
}
</style>
