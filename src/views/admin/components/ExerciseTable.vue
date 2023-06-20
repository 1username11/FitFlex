<template>
  <div class="lg:flex justify-between lg:space-x-2">
    <div class="flex justify-between space-x-2 lg:w-1/2">
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
    </div>

    <div class="flex justify-between space-x-2 lg:w-1/2">
      <div class="mb-4 filter-input-wrapper">
        <el-input v-model="searchedExercises" placeholder="Search" />
      </div>

      <p
        class="text-[#1D83EA] cursor-pointer min-w-[132px]"
        @click="createExercise()"
      >
        + Create Exercises
      </p>
    </div>
  </div>

  <el-table :data="exercises" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div class="flex flex-col-reverse lg:flex-row lg:justify-between p-3">
          <div class="flex space-x-4">
            <div class="hidden sm:flex items-center thumbnail-image-wrapper">
              <el-image :src="props.row.thumbnails_url" class="w-20 h-20 rounded-full overflow-hidden" cover="cover">
                <template #error>
                  <ImagePlaseholder />
                </template>
              </el-image>
            </div>

            <div>
              <div class="flex space-x-2">
                <p class="font-semibold text-gray-600">Title:</p>
                <p class="underline font-medium text-gray-600">{{ props.row.title }}</p>
              </div>

              <div class="flex space-x-2">
                <p class="font-semibold text-gray-600">Equipment Category:</p>
                <p class="underline font-medium text-gray-600">{{ props.row.equipment_category }}</p>
              </div>

              <div class="flex space-x-2">
                <p class="font-semibold text-gray-600">Exercise Type:</p>
                <p class="underline font-medium text-gray-600">{{ props.row.exercise_type }}</p>
              </div>

              <div class="flex space-x-2">
                <p class="font-semibold text-gray-600">Primary:</p>
                <p class="underline font-medium text-gray-600">{{ props.row.muscle_group }}</p>
              </div>
            </div>
          </div>
          <div
            class="flex space-x-3 mb-3
           lg:space-x-0 lg:mb-0 lg:flex-col lg:justify-center lg:items-end lg:space-y-3"
          >
            <div class="button-wrapper">
              <el-button
                :size="$elComponentSize.small"
                @click="handleEdit(props.row.id)"
              >
                Edit
              </el-button>
            </div>

            <div class="button-wrapper">
              <el-button
                :size="$elComponentSize.small"
                :type="$elComponentType.primary" class="ml-0"
                @click="deleteConfirm(props.row.id)"
              >
                Delete
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="ID" prop="id" />
    <el-table-column label="Title" prop="title" />
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

function handleEdit (id: string) {
  isCreateExerciseVisible.value = true
  editedExerciseId.value = id
  console.log('edted exercise id', editedExerciseId.value)
}

async function deleteConfirm (id: string) {
  await ElMessageBox.confirm('This will permanently delete the exercise. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async () => {
    await deleteExercise(id)
  }).catch((err: any) => {
    console.log('err', err)
  })
}

async function deleteExercise (id: string) {
  try {
    const { error: setsDeleteErr } = await supabase.from('exercise_sets').delete().match({ exercise_id: id })
    const { error: statDeleteErr } = await supabase.from('statistics').delete().match({ exercise_id: id })
    const { error: exerciseDeleteErr } = await exercisesService.deleteExercise(id)

    if (setsDeleteErr || statDeleteErr || exerciseDeleteErr) throw new Error('Error while deleting exercise')

    await getExercises()

    ElNotification({
      title: 'Success',
      message: 'Exercise deleted successfully',
      type: 'success'
    })
  } catch (e: any) {
    ElNotification({
      title: 'Error',
      message: e.message,
      type: 'error'
    })
  }
}

function createExercise () {
  isCreateExerciseVisible.value = true
  editedExerciseId.value = ''
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
  }
})
</script>

<style lang="scss">
.thumbnail-image-wrapper {
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}
.select-wrapper {
  width: 100%;
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

.popup-wrapper {
    position: fixed;
    inset: 50% auto auto 50%;
    border: 1px solid rgb(204, 204, 204);
    background: white;
    overflow: auto;
    border-radius: 8px;
    outline: none;
    padding: 20px;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
    z-index: 1000;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.el-tabs__content{
  overflow: visible;
}

.filter-input-wrapper{
  width: 100%;
}
</style>
