<template>
  <el-tabs type="border-card">
    <el-tab-pane label="User">
      <UsersTable />
    </el-tab-pane>

    <el-tab-pane label="Config">
      <ExerciseTable />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import UsersTable from './components/UsersTable.vue'
import ExerciseTable from './components/ExerciseTable.vue'
</script>
