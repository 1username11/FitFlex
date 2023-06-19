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
          or with email
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
            :disabled="!(signUpModel.email.length || signUpModel.password.length || signUpModel.confirmPassword.length)"
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
import SocialAuth from './components/SocialAuth.vue'
import { routeNames } from '@/router/route-names'

const router = useRouter()
const signUpRef = ref()
const signUpModel = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const confirmPasswordValidator = (_: any, value: string, callback: any) => {
  if (value !== signUpModel.password) {
    callback(new Error('Password does not match'))
  } else {
    callback()
  }
}

const signUpRules = reactive({
  email: [useRequiredRule(), useEmailRule()],
  password: [useRequiredRule(), useMinLenRule(6)],

  confirmPassword: [useRequiredRule(),
    { validator: confirmPasswordValidator, trigger: 'blur' }
  ]
})

const baseProfile = {
  username: 'new username',
  full_name: 'full name',
  avatar_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?2015032720354'
}

function submit () {
  signUpRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      try {
        const { email, password } = signUpModel
        const { data: signUpData, error } = await authService.signUp({
          email,
          password
        })
        if (error) throw error
        console.log(signUpData)

        const { error: createBaseProfileError } =
        await profileService.updateProfile(signUpData.user?.id as string, baseProfile)
        if (createBaseProfileError) throw createBaseProfileError
        ElNotification({
          title: 'Success',
          message: 'Check your email to verify your account',
          type: 'success'
        })
        router.push({ name: routeNames.login })
      } catch (error: any) {
        ElNotification({
          title: 'Error',
          message: error.message,
          type: 'error'
        })
      }
    } else {
      ElNotification({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error'
      })
    }
  })
}
</script>
