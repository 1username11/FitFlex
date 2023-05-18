<template>
  <div
    class="flex items-center  border border-gray-400 rounded-lg h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
  >
    <GoogleIcon />

    <p class="w-full text-center">
      {{ router.currentRoute.value.path === '/auth/login' ? 'Login' : 'Sign up' }} with Google
    </p>
  </div>
  <div
    class="flex items-center border border-gray-400 rounded-lg h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
  >
    <AppleIcon />

    <p class="w-full text-center">
      {{ router.currentRoute.value.path === '/auth/login' ? 'Login' : 'Sign up' }} with Apple
    </p>
  </div>

  <div
    class="flex items-center border border-gray-400 rounded-lg h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
  >
    <FacebookIcon />

    <p class="w-full text-center">
      {{ router.currentRoute.value.path === '/auth/login' ? 'Login' : 'Sign up' }} with Facebook
    </p>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
</script>
