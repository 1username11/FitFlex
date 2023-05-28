<template>
  <div class="flex">
    <div class="flex flex-col border border-gray-200 p-4 rounded-l-lg bg-white">
      <p class="text-gray-400">Account</p>
      <div
        class="flex justify-between lg:w-[260px] border-b border-b-gray-200 py-4 cursor-pointer"
        @click="onProfilePage()"
      >
        <div class="flex gap-2">
          <IconProfile class="w-[40px] h-[40px] mr-2" />
          <span class="hidden lg:flex items-center">Profile</span>
        </div>

        <div class="flex items-center">
          <IconArrow />
        </div>
      </div>
      <div
        class="flex justify-between lg:w-[260px] border-b border-b-gray-200 py-4 cursor-pointer"
        @click="onAccountPage()"
      >
        <div class="flex gap-2">
          <IconAccount class="w-[40px] h-[40px] mr-2" />
          <span class="hidden lg:flex items-center">Account</span>
        </div>

        <div class="flex items-center">
          <IconArrow />
        </div>
      </div>
    </div>
    <Profile v-if="page === 'profile'" />
    <Account v-else-if="page === 'account'" />
  </div>
</template>

<script lang="ts" setup>
import Profile from './Profile.vue'
import Account from './Account.vue'

const page = ref('profile')

function onProfilePage () {
  page.value = 'profile'
  console.log(page.value)
}

function onAccountPage () {
  page.value = 'account'
  console.log(page.value)
}
</script>
