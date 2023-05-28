<template>
  <div class="h-7 flex space-x-4 items-center">
    <svg
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      fill="#000000"
      height="25px"
      width="25px"
      version="1.1"
      viewBox="0 0 23.758 23.758"
      xml:space="preserve"
    >
      <path
        d="M4.523,23.758V0h14.712v4.021H9.319v5.625h9.916v4.016H9.319v10.096H4.523z"
      />

    </svg>

    <p
      class="text-2xl font-bold tracking-widest lg:block"
      :class="{'hidden': isNameHidden}"
    >
      FitFlex
    </p>
  </div>
</template>

<script lang="ts" setup>
import { router } from '@/router'
import { routeNames } from '@/router/route-names'

const isNameHidden = computed(() => {
  return !(router.currentRoute.value.name === routeNames.login || router.currentRoute.value.name === routeNames.signUp)
})
</script>
