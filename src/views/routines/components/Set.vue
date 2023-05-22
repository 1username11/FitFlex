<template>
  <div>
    <div class="flex justify-between">
      <div>
        {{ serial }}
      </div>

      <el-input class="bg-white max-w-[50px] border-none" type="text" placeholder="-"/>

      <el-input class="bg-white max-w-[50px]" type="text" placeholder="-"/>

      <button>
        <DeleteIcon />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  set: ISet
  serial: number
}>()
</script>
