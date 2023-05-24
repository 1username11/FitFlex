<template>
  <div
    class="flex flex-col items-center py-6 px-2.5
  bg-white border-t border-t-gray-200 border-r border-r-gray-200
  border-b border-b-gray-200 rounded-r-lg w-full h-screen"
  >
    <el-image class="w-[100px] h-[100px] rounded-full overflow-hidden" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
    <button class="text-sm text-[#1d83ea] mt-4">Change Picture</button>
    <div class="flex py-4 border-b border-b-gray-200 w-full gap-8">
      <div class="w-12">
        <p class="flex items-center font-light">Name</p>
      </div>

      <el-input class="w-[300px]" label="Name" />
    </div>
    <div class="flex py-4 border-b border-b-gray-200 w-full gap-8">
      <div class="w-12">
        <p class="flex items-cente  font-light">Bio</p>
      </div>

      <el-input class="w-[300px]" label="Bio" />
    </div>
    <el-button type="primary" class="w-[300px] mt-4">Save</el-button>
  </div>
</template>
