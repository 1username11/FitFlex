<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col items-center mx-auto p-6">
      <el-card class="max-w-[450px] p-1.5 rounded-lg">
        <p class="text-center text-lg font-bold mb-5">
          Update Password
        </p>

        <el-form
          ref="updatePasswordRef"
          :rules="forgetPasswordRules"
          :model="updatePasswordModel"
          @submit.prevent="submit"
        >
          <el-form-item prop="passwod" class="h-11">
            <el-input
              v-model="updatePasswordModel.newPassword"
              class="h-11"
              placeholder="Email"
            />
          </el-form-item>

          <el-form-item prop="email" class="h-11">
            <el-input
              v-model="updatePasswordModel.confirmPassword"
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
const updatePasswordRef = ref()
const updatePasswordModel = reactive({
  newPassword: '',
  confirmPassword: ''
})

const confirmPasswordValidator = (_, value: string, callback) => {
  if (value !== updatePasswordModel.newPassword) {
    callback(new Error('Password does not match'))
  } else {
    callback()
  }
}

const forgetPasswordRules = reactive({
  newPassword: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: confirmPasswordValidator, trigger: 'blur' },
    { required: true, message: 'Please enter your password', trigger: 'blur ' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})

const isFormValid = computed(() => {
  return updatePasswordRef.value?.validate()
})

function submit () {
  updatePasswordRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      console.log('form is valid')
      try {
        await authService.updatePassword(updatePasswordModel.newPassword)
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
