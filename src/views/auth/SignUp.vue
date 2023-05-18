<template>
  <AuthHeader />
  <div class="flex justify-between mx-auto space-x-20 h-full">
    <div class="flex flex-col justify-center my-auto mx-auto flex-1 h-full">
      <p class="text-3xl font-bold text-center mb-4">Sign Up</p>
      <p class="text-center mb-12">Create your Hevy account.</p>
      <div
        class="flex items-center  border border-gray-400 rounded-md h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
      >
        <GoogleIcon />

        <p class="w-full text-center">Sign up with Google</p>
      </div>
      <div
        class="flex items-center border border-gray-400 rounded-md h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
      >
        <AppleIcon />

        <p class="w-full text-center">Sign up with Apple</p>
      </div>

      <div
        class="flex items-center border border-gray-400 rounded-md h-10
       bg-white cursor-pointer px-2.5 mb-4 space-x-5 hover:bg-gray-100 active:shadow-inner"
      >
        <FacebookIcon />

        <p class="w-full text-center">Sign up with Facebook</p>
      </div>

      <div>
        <span class="h-[0.5px] block bg-gray-300 mt-8" />
        <p class="-mt-[11px] px-4 text-center z-50 bg-gray-50 text-gray-300 text-sm w-fit mx-auto mb-8">
          Or with email
        </p>
      </div>
      <el-form>
        <el-form-item>
          <el-input v-model="email" class="h-10" placeholder="Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" class="h-10" placeholder="Password" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="confirmPassword" class="h-10" placeholder="Confirm Password" />
        </el-form-item>
        <el-form-item>
          <el-button class="h-10 w-full" :type="$elComponentType.primary">Sign Up</el-button>
        </el-form-item>
      </el-form>
      <div class="flex justify-center items-center space-x-1">
        <span class="text-sm">Already have an account?</span>
        <button class="bg-gray-50 border-none underline text-sm text-primary hover:bg-gray-50">Login</button>
      </div>
    </div>
    <div class="flex justify-center bg-gray-200 p-10 h-full w-[50%]">
      <RunningMan />
    </div>
  </div>
  <AuthFooter />
</template>

<script lang="ts" setup>
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>
