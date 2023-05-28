<template>
  <div
    class="flex items-center border border-gray-200 rounded-lg h-10
       bg-white cursor-pointer px-2.5 py-1.5 space-x-5 hover:bg-gray-100 active:shadow-inner"
    @click="signUpWithGoogle"
  >
    <GoogleIcon />

    <p class="w-full h-full text-center">
      {{ router.currentRoute.value.path === '/auth/login' ? 'Login' : 'Sign up' }} with Google
    </p>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
async function signUpWithGoogle () {
  try {
    await authService.signInWithOAuth()
  } catch (error) {
    console.log(error)
  }
}
</script>
