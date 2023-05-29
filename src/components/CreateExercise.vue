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

      <el-select v-model="type" class="w-5/12">
        <el-option
          v-for="exerciseType in exerciseTypes"
          :key="exerciseType"
          :value="exerciseType"
        />
      </el-select>
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Equipment
      </p>

      <el-select v-model="equipment" class="w-5/12">
        <el-option
          v-for="equipmentItem in equipments"
          :key="equipmentItem"
          :value="equipmentItem"
        />
      </el-select>
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Primary Muscle Group
      </p>

      <el-select v-model="primary" class="w-5/12">
        <el-option
          v-for="primaryMuscleGroup in muscleGroups"
          :key="primaryMuscleGroup"
          :value="primaryMuscleGroup"
        />
      </el-select>
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Secondary Muscle Group
      </p>

      <el-select v-model="secondary" class="w-5/12">
        <el-option
          v-for="secondaryMuscleGroup in muscleGroups"
          :key="secondaryMuscleGroup"
          :value="secondaryMuscleGroup"
        />
      </el-select>
    </div>

    <div class="flex justify-end items-end w-full">
      <el-button type="primary" class="mt-28 w-[200px]">
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

const exerciseTypes = [
  'Weight Reps',
  'Reps Only',
  'Weighted Bodyweight',
  'Assisted Bodyweight',
  'Bodyweight',
  'Duration',
  'Distance Duration',
  'Weght and Distance'
]

const equipments = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Bands',
  'Other',
  'None'
]

const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quads',
  'Hamstrings',
  'Calves',
  'Abs',
  'Glutes',
  'Cardio',
  'Full Body',
  'Other'
]
</script>

<style lang="scss">
.element-input-wrapper{
.el-input__wrapper {
  box-shadow: none !important;
  padding: 1px 0px 1px 0px !important;
}
}

</style>
