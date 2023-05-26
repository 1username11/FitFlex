<template>
  <div
    class="flex flex-col items-center py-6 px-2.5
  bg-white border-t border-t-gray-200 border-r border-r-gray-200
  border-b border-b-gray-200 rounded-r-lg w-full h-screen"
  >
    <div class="border-b border-b-gray-200">
      <div class="flex justify-between">
        <p class="flex items-center">
          Private Profile
        </p>
        <el-select v-model="privacySettings" class="m-2 w-[100px]" placeholder="Select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <p class="text-sm text-gray-400 mb-4">
        Having a private profile means other users need to request to follow you.
        Only if you accept their follow request, will they be able to see your workouts.
      </p>
    </div>

    <div class="w-full border-b border-b-gray-200">
      <div class="mt-4">
        <p>Current Password</p>

        <div class="account-input">
          <el-input v-model="currentPassword" />
        </div>
      </div>

      <div class="mt-4">
        <p>New Password</p>

        <div class="account-input">
          <el-input v-model="newPassword" />
        </div>
      </div>

      <el-button type="primary" class="w-[180px] my-4" disabled>Update Password</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const options = [
  {
    value: 'private',
    label: 'Private'
  },
  {
    value: 'public',
    label: 'Public'
  }
]
const privacySettings = ref('private')

const currentPassword = ref('')
const newPassword = ref('')
</script>

<style lang="scss">
.account-input {
  width: 100%;
  margin-top: 16px;
  max-width: 300px;
  .el-input__wrapper {
    background: #F8F8F7 !important;
  }
}
</style>
