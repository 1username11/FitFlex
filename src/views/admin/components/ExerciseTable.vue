<template>
  <div class="flex justify-between">
    <div class="select-wrapper">
      <el-select
        v-model="selectedEquipment"
        class="w-full mb-4"
        placeholder="All Equipment"
        clearable
      >
        <el-option
          v-for="equipmentsItem in equipments"
          :key="equipmentsItem"
          :value="equipmentsItem"
        />
      </el-select>
    </div>

    <div class="select-wrapper">
      <el-select
        v-model="slecetedPrimary"
        class="w-full mb-4"
        placeholder="Primary"
        clearable
      >
        <el-option
          v-for="primaryItem in primaries"
          :key="primaryItem"
          :value="primaryItem"
        />
      </el-select>
    </div>

    <div class="mb-4">
      <el-input v-model="searchedExercises" placeholder="Search" />
    </div>

    <p
      class="text-[#1D83EA] cursor-pointer"
      @click="isCreateExerciseVisible = !isCreateExerciseVisible"
    >
      + Create Exercises
    </p>
  </div>
  <el-table v-loading="loading" :data="exercises" style="width: 100%">
    <el-table-column label="Thumbnails" prop="thumbnails_url">
      <template #default="scope">
        <div class="thumbnail-image-wrapper">
          <el-image :src="scope.row.thumbnails_url" class="w-20 h-20 rounded-full overflow-hidden" cover="cover">
            <template #error>
              <ImagePlaseholder />
            </template>
          </el-image>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Equipment Category" prop="equipment_category" />
    <el-table-column label="Exercise Type" prop="exercise_type" />
    <el-table-column label="Id" prop="id" />
    <el-table-column label="Muscle Group" prop="muscle_group" />
    <el-table-column label="Title" prop="title" />
    <el-table-column fixed="right">
      <template #default="scope">
        <div class="flex flex-col space-y-3">
          <el-button :size="$elComponentSize.small" @click="handleEdit(scope.row)">
            Edit
          </el-button>
          <div class="button-wrapper">
            <el-button
              :size="$elComponentSize.small"
              :type="$elComponentType.primary" class="ml-0"
              @click="deleteExercise(scope.row.id)"
            >
              Delete
            </el-button>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div v-if="isCreateExerciseVisible">
    <CreateExercise
      class="popup-wrapper"
      :exerciseId="editedExerciseId"
      @close="isCreateExerciseVisible = false"
    />
    <div class="overlay" @click="isCreateExerciseVisible = !isCreateExerciseVisible" />
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'

const loading = ref(false)
const isCreateExerciseVisible = ref(false)
const editedExerciseId = ref('')

const exerciseStore = useExercisesStore()
const { getExercises, getMuscleGroups, getExerciseTypes, getEquipment } = exerciseStore
const {
  exercises,
  equipments,
  primaries,
  selectedEquipment,
  slecetedPrimary,
  searchedExercises
} = storeToRefs(exerciseStore)

function emitExercise (exercise: IExerciseRoutine) {
  console.log('exercise', exercise)
  emits('seeDetails', exercise)
  emits('addExercise', exercise)
}
function handleEdit (exercise: IExerciseRoutine) {
  isCreateExerciseVisible.value = true
  editedExerciseId.value = exercise.id
}

async function deleteExercise (id: string) {
  await supabase.from('exercise_sets').delete().match({ exercise_id: id })
  await exercisesService.deleteExercise(id)
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      getMuscleGroups(),
      getExerciseTypes(),
      getEquipment()
    ])
    await getExercises()
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  } finally {
    loading.value = false
    console.log(exercises.value)
  }
})
</script>

<style lang="scss">
.thumbnail-image-wrapper {

}
.select-wrapper {
  .el-select {
    .el-input__wrapper {
      background: white;
    }
    .el-input.is-focus .el-input__wrapper {
      align-items: center;
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
    }
    :hover:not(.el-select--disabled) .el-input__wrapper{
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset !important;
    }
  }
}
.button-wrapper{
  .el-button--small{
    width: 100%;
  }
}
</style>
