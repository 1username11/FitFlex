<template>
  <AuthHeader />

  <div class="flex justify-between h-screen">
    <div class="flex flex-col items-center mx-auto p-6">
      <el-card class="max-w-[450px] p-3 rounded-lg">
        <p class="text-center text-xl font-semibold mb-7">
          Password recovery
        </p>

        <p class="text-lg mb-7">
          Enter your email and if an account exists we will send you an email with a link to recover your password.
        </p>

        <el-form>
          <el-form-item>
            <el-input v-model="email" class="h-10 rounded-lg" placeholder="Email" />
          </el-form-item>

          <el-form-item>
            <el-button class="h-10 w-full rounded-lg" :type="$elComponentType.primary">
              Send Password Recovery
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <button class="underline text-primary max-w-fit mt-5">
        Back to Login
      </button>
    </div>

    <RunningMan />
  </div>

  <AuthFooter />
</template>

<script lang="ts" setup>
const email = ref('')
</script>
