<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col justify-between my-auto mx-auto md:flex-1 max-w-[400px]">
      <p class="text-3xl font-bold text-center mb-4">Sign Up</p>

      <p class="text-center mb-12">Create your FitFlex account.</p>

      <SocialAuth />

      <div>
        <span class="h-[0.5px] block bg-gray-300 mt-8" />

        <p class="-mt-[11px] px-4 text-center z-50 bg-gray-50 text-gray-300 text-sm w-fit mx-auto mb-8">
          Or with email
        </p>
      </div>

      <el-form
        ref="signUpRef"
        :rules="signUpRules"
        :model="signUpModel"
        @submit.prevent="submit"
      >
        <el-form-item prop="email" class="h-11">
          <el-input
            v-model="signUpModel.email"
            placeholder="Email"
            class="h-11"
          />
        </el-form-item>

        <el-form-item prop="password" class="h-11">
          <el-input
            v-model="signUpModel.password"
            class="h-11"
            placeholder="Password"
            type="password"
          />
        </el-form-item>

        <el-form-item prop="confirmPassword" class="h-11">
          <el-input
            v-model="signUpModel.confirmPassword"
            class="h-11"
            placeholder="Confirm Password"
            type="password"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            native-type="submit"
            class="h-12 w-full"
            :type="$elComponentType.primary"
            :disabled="isFormValid"
          >
            Sign Up
          </el-button>
        </el-form-item>
      </el-form>

      <div class="flex justify-center items-center space-x-1">
        <span>Already have an account?</span>

        <router-link
          :to="{name: $routeNames.login}"
          class="bg-gray-50 border-none underline text-primary hover:bg-gray-50"
        >
          Login
        </router-link>
      </div>
    </div>

    <RunningMan />
  </div>

  <AuthFooter />
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import SocialAuth from './components/SocialAuth.vue'

const signUpRef = ref()
const signUpModel = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const confirmPasswordValidator = (_, value: string, callback) => {
  if (value !== signUpModel.password) {
    callback(new Error('Password does not match'))
  } else {
    callback()
  }
}

const signUpRules = ref({
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please input confirm password', trigger: 'blur' },
    { validator: confirmPasswordValidator, trigger: 'blur' }
  ]
})

const isFormValid = computed(() => {
  return !signUpRef.value?.validate()
})

function submit () {
  signUpRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      console.log('form is valid')
      try {
        const { email, password } = signUpModel
        await authService.signUp({
          email,
          password
        })
        ElNotification({
          title: 'Confirmation Email Sent',
          message: 'Check your email to verify your account',
          type: 'info',
          duration: 8000
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}
</script>
