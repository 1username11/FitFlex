<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col items-center mx-auto p-6">
      <el-card class="max-w-[450px] p-1.5 rounded-lg">
        <p class="text-center text-lg font-bold mb-5">
          Password recovery
        </p>

        <p class="mb-7 font-medium">
          Enter your email and if an account exists we will send you an email with a link to recover your password.
        </p>

        <el-form
          ref="forgetPasswordRef"
          :rules="forgetPasswordRules"
          :model="forgetPasswordModel"
          @submit.prevent="submit"
        >
          <el-form-item prop="email" class="h-11">
            <el-input
              v-model="forgetPasswordModel.email"
              class="h-11"
              placeholder="Email"
            />
          </el-form-item>

          <el-form-item class="mb-0">
            <el-button
              native-type="submit"
              class="h-11 w-full"
              :type="$elComponentType.primary"
              :disabled="!isFormValid"
            >
              Send Password Recovery
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <router-link :to="{name: $routeNames.login}" class="underline text-primary max-w-fit mt-5">
        Back to Login
      </router-link>
    </div>

    <RunningMan />
  </div>

  <AuthFooter />
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'

const forgetPasswordRef = ref()
const forgetPasswordModel = reactive({
  email: ''
})

const forgetPasswordRules = reactive({
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ]
})

const isFormValid = computed(() => {
  return forgetPasswordRef.value?.validate()
})

function submit () {
  forgetPasswordRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      console.log('form is valid')
      try {
        await authService.resetPasswordForEmail(forgetPasswordModel.email).then(() => {
          ElNotification({
            message: 'Password recovery email sent',
            type: 'success'
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}
</script>

<style>
.el-card {
  background-color: #fff;
  box-shadow: none !important;
}
</style>
