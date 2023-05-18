<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col justify-between my-auto mx-auto md:flex-1 max-w-[400px]">
      <p class="text-3xl font-bold text-center mb-4">Sign Up</p>

      <p class="text-center mb-12">Create your Hevy account.</p>

      <SocialAuth />

      <div>
        <span class="h-[0.5px] block bg-gray-300 mt-8" />

        <p class="-mt-[11px] px-4 text-center z-50 bg-gray-50 text-gray-300 text-sm w-fit mx-auto mb-8">
          Or with email
        </p>
      </div>

      <el-form>
        <el-form-item>
          <el-input v-model="email" class="h-10 rounded-lg" placeholder="Email" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="password" class="h-10 rounded-lg" placeholder="Password" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="confirmPassword" class="h-10 rounded-lg" placeholder="Confirm Password" />
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

    <RunningMan />
  </div>

  <AuthFooter />
</template>

<script lang="ts" setup>
import SocialAuth from './components/SocialAuth.vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>
