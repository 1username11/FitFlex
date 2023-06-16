<template>
  <div class="flex justify-between bg-white p-4 border border-gray-300 rounded-lg  mt-4">
    <router-link
      :to="{name: $routeNames.routineDetail, params: {id: routine.id}}"
      class="text-lg font-bold"
    >
      {{ routine.title }}
    </router-link>
    <el-dropdown v-if="router.currentRoute.value.path !=='/'" trigger="click">
      <span>
        <IconRoutinesItemButton />
      </span>

      <template #dropdown>
        <el-dropdown-menu class="text-base text-gray-400 py-3 space-y-2 cursor-pointer min-w-[210px]">
          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="navigate()">
            <IconEdit />
            Edit Routine
          </el-dropdown-item>

          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('duplicate', routine)">
            <IconDuplicate />
            Duplicate Routine
          </el-dropdown-item>

          <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('delete', routine)">
            <IconDelete />
            Delete Routine
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const props = defineProps<{
  routine: IRoutine
}>()
defineEmits(['duplicate', 'delete'])

const router = useRouter()

function navigate () {
  router.push({ name: routeNames.editRoutine, params: { id: props.routine.id } })
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
