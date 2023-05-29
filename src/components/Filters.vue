<template>
  <div
    v-if="isLargeScreen"
    v-loading="loading"
    class="flex flex-col p-4 bg-white rounded-lg border border-gray-200 w-80 h-[830px] overflow-auto"
  >
    <p class="mb-5 text-gray-400">Filters</p>

    <div class="select-wrapper">
      <el-select
        v-model="equipmentForFiltering"
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
        v-model="primaryForFiltering"
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

    <div>
      <div class="flex justify-between mb-4">
        <div class="text-gray-400">Library</div>

        <div>
          <p
            class="text-[#1D83EA] cursor-pointer"
            @click="isCreateExerciseVisible = !isCreateExerciseVisible"
          >
            + Create Exercises
          </p>
        </div>
      </div>

      <div class="mb-4">
        <el-input v-model="inputFilteringValue" placeholder="Search" />
      </div>

      <div
        v-for="exercise in exercises"
        :key="exercise.id"
      >
        <div
          class="flex items-center border-b border-b-gray-200 h-[90px]"
          @click="emitExercise(exercise)"
        >
          <IconPlus />
          <el-image :src="exercise.img" class="w-8 h-8 rounded-full overflow-hidden" />

          <div class="ml-2">
            <div>
              {{ exercise.name }}
            </div>
            <div class="text-gray-400">
              {{ exercise.primary }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isLargeScreen">
    <el-button
      type="primary"
      class="absolute"
      :class="currentRoute === '/exercise' ? 'left-0 routate-90' : 'right-0 -rotate-90'"
      @click="drawer = true"
    >
      Show Filters
    </el-button>

    <el-drawer
      v-model="drawer"
      :with-header="true"
      :class="isMediumScreen ? 'drawer-md' : 'drawer-sm'"
      direction="ltr"
    >
      <p class="mb-5 text-gray-400">Filters</p>

      <div class="select-wrapper">
        <el-select v-model="equipmentForFiltering" class="w-full mb-4" placeholder="All Equipment" clearable>
          <el-option
            v-for="equipmentsItem in equipments"
            :key="equipmentsItem"
            :value="equipmentsItem"
          />
        </el-select>
      </div>

      <div class="select-wrapper">
        <el-select v-model="primaryForFiltering" class="w-full mb-4" placeholder="Primary" clearable>
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
            <p
              class="text-[#1D83EA] cursor-pointer"
              @click="isCreateExerciseVisible = !isCreateExerciseVisible"
            >
              + Create Exercises
            </p>
          </div>
        </div>

        <div class="mb-4">
          <el-input v-model="inputFilteringValue" placeholder="Search" />
        </div>

        <div
          v-for="exercise in exercises"
          :key="exercise.id"
        >
          <div
            class="flex items-center border-b border-b-gray-200 h-[90px]"
            @click="emitExercise(exercise)"
          >
            <IconPlus />
            <el-image :src="exercise.img" class="w-8 h-8 rounded-full overflow-hidden" />

            <div class="ml-2">
              <div>
                {{ exercise.name }}
              </div>
              <div class="text-gray-400">
                {{ exercise.primary }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>

  <div v-if="isCreateExerciseVisible">
    <CreateExercise
      class="popup-wrapper"
      @close="isCreateExerciseVisible = false"
    />
    <div class="overlay" @click="isCreateExerciseVisible = !isCreateExerciseVisible" />
  </div>
</template>

<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'

const emits = defineEmits(['addExercise', 'seeDetails'])

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const isMediumScreen = useMediaQuery('(min-width: 768px)')

const drawer = ref(false)
const loading = ref(false)
const isCreateExerciseVisible = ref(false)
const currentRoute = useRouter().currentRoute.value.path

const exerciseStore = useExercisesStore()
const { getExercises, getMuscleGroups, getExerciseTypes, getEquipment } = exerciseStore
const {
  exercises,
  equipments,
  primaries,
  equipmentForFiltering,
  primaryForFiltering,
  inputFilteringValue
} = storeToRefs(exerciseStore)

function emitExercise (exercise: IExercise) {
  emits('seeDetails', exercise)
  emits('addExercise', exercise)
}

onMounted(async () => {
  loading.value = true
  Promise.allSettled([
    getMuscleGroups(),
    getExerciseTypes(),
    getEquipment()
  ]).then(() =>{
    getExercises()
  }).finally(() => {
    loading.value = false
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
.popup-wrapper {
  position: absolute;
    inset: 50% auto auto 50%;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(252, 252, 252);
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

.drawer-sm {
  width: 100% !important;
}
.drawer-md{
  width: 50% !important;
}
.el-drawer.ltr{
  z-index: 50 !important;
}
.el-drawer.fade-enter-active, .el-drawer.fade-leave-active {
  z-index: 500 !important;
}
</style>
