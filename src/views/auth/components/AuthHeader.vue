<template>
  <div class="w-full border-b border-gray-300 bg-white">
    <router-link
      :to="{name: $routeNames.login}"
      class="flex px-[15px] lg:px-0 py-3 max-w-[1024px] mx-auto"
    >
      <Logo />
    </router-link>
  </div>
</template>
