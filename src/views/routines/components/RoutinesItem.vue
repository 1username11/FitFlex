<template>
  <div class="flex justify-between bg-white p-4 border border-gray-300 rounded-lg  mt-4">
    <router-link
      :to="{name: $routeNames.routineDetail, params: {id: workout.id}}"
      class="text-lg font-bold"
    >
      {{ workout.name }}
    </router-link>
    <el-dropdown trigger="click">
      <span>
        <RoutinesItemButtonIcon />
      </span>

      <template #dropdown>
        <el-dropdown-menu class="text-base text-gray-400 py-2 px-3 space-y-2 min-w-[208px]">
          <el-dropdown-item>
            <EditIcon />
            Edit Routine
          </el-dropdown-item>

          <el-dropdown-item>
            <DuplicateIcon />
            Duplicate Routine
          </el-dropdown-item>

          <el-dropdown-item>
            <DeleteIcon />
            Delete Routine
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import DeleteIcon from './icons/DeleteIcon.vue'
import DuplicateIcon from './icons/DuplicateIcon.vue'
import EditIcon from './icons/EditIcon.vue'

defineProps<{
  workout: IWorkout
}>()
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
