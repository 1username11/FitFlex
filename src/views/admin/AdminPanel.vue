<template>
  <el-tabs type="border-card">
    <el-tab-pane label="User">
      <UsersTable />
    </el-tab-pane>
    <el-tab-pane label="Config">
      <ExercsiceTable />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import UsersTable from './components/UsersTable.vue'
import ExercsiceTable from './components/ExerciseTable.vue'
</script>
