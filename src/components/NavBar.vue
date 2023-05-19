<template>
  <div>
    <Logo />
    <div>
      <RouterLink :to="{name: $routeNames.feed}">
        <div />

        <span>Feed</span>
      </RouterLink>
      <RouterLink :to="{name: $routeNames.routines}" >

        <div />

        <span>Routines</span>
      </RouterLink>
      <RouterLink :to="{name: $routeNames.exercises}" >
        <div />

        <span>Exercises</span>
      </RouterLink>
      <RouterLink :to="{name: $routeNames.profile}" >
        <div />

        <span>Profile</span>
      </RouterLink>
    </div>
    <div>
      <el-image/>
    </div>
  </div>
</template>
