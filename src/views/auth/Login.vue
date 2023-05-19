<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col my-auto mx-auto md:flex-1 max-w-[400px]">
      <p class="text-3xl font-bold text-center mb-12">Log In</p>

      <SocialAuth />

      <div>
        <span class="h-[0.5px] block bg-gray-300 mt-8" />

        <p class="-mt-[11px] px-4 text-center z-50 bg-gray-50 text-gray-300 text-sm w-fit mx-auto mb-8">
          Or with email
        </p>
      </div>

      <el-form
        ref="loginRef"
        :rules="loginRules"
        :model="loginModel"
        @submit.prevent="submit"
      >
        <el-form-item prop="email" class="h-11">
          <el-input
            v-model="loginModel.email"
            class="h-11"
            placeholder="Email"
          />
        </el-form-item>

        <el-form-item prop="password" class="h-11">
          <el-input
            v-model="loginModel.password"
            class="h-11"
            placeholder="Password"
            type="password"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            native-type="submit"
            class="h-12 w-full rounded-lg"
            :type="$elComponentType.primary"
            :disabled="!isFormValid"
          >
            Sign Up
          </el-button>
        </el-form-item>
      </el-form>

      <div class="flex flex-col justify-center items-center space-y-3">
        <router-link
          :to="{name: $routeNames.forgotPassword}"
          class="bg-gray-50 border-none underline text-primary hover:bg-gray-50"
        >
          Forgot password?
        </router-link>

        <div class="space-x-1">
          <span>
            New to FitFlex?
          </span>

          <router-link
            :to="{name: $routeNames.signUp}"
            class="bg-gray-50 border-none underline text-primary hover:bg-gray-50"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </div>

    <RunningMan />
  </div>

  <AuthFooter class="max-h-[40px]" />
</template>

<script lang="ts" setup>
const loginRef = ref()

const loginModel = ref({
  email: '',
  password: ''
})

const loginRules = ref({
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})

const isFormValid = computed(() => {
  return !loginRef.value?.validate()
})

function submit () {
  loginRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      console.log('form is valid')
    }
  })
}
</script>
