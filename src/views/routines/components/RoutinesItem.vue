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
        <el-dropdown-menu class="text-base text-gray-400 py-3 space-y-2 cursor-pointer min-w-[210px]">
          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="navigate()">
            <EditIcon />
            Edit Routine
          </el-dropdown-item>

          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('duplicate', workout)">
            <DuplicateIcon />
            Duplicate Routine
          </el-dropdown-item>

          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('delete', workout)">
            <DeleteIcon />
            Delete Routine
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'
import DeleteIcon from './icons/DeleteIcon.vue'
import DuplicateIcon from './icons/DuplicateIcon.vue'
import EditIcon from './icons/EditIcon.vue'

const props = defineProps<{
  workout: IWorkout
}>()
defineEmits(['duplicate', 'delete'])

const router = useRouter()

function navigate () {
  router.push({ name: routeNames.editRoutine, params: { id: props.workout.id } })
}
</script>

<style>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-button:hover{
  background-color: #e6e6e6;
  border-color: #e6e6e6;
}
</style>
