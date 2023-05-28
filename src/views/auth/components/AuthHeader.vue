<template>
  <div class="w-full border-b border-gray-300 bg-white auth-header">
    <router-link
      :to="{name: $routeNames.login}"
      class="flex justify-start px-[15px] md:justify-start lg:px-0 py-3 max-w-[1024px] mx-auto"
    >
      <Logo />
    </router-link>
  </div>
</template>

<style lang="scss">
.auth-header{
  .router-link-active.router-link-exact-active {
  border-bottom: 2px solid white !important;
  color: black !important;
}
}
</style>
