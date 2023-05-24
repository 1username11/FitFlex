<template>
  <div class="bg-gray-50 relative flex flex-col h-full overflow-y-auto">
    <NavBar />
    <div class="h-full">
      <div class="w-full max-w-[1024px] p-3 h-full mx-auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
