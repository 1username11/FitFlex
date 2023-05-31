<template>
  <div
    class="flex flex-col items-center py-6 px-2.5
  bg-white border-t border-t-gray-200 border-r border-r-gray-200
  border-b border-b-gray-200 rounded-r-lg w-full h-screen"
  >
    <div @click="openFileInput">
      <el-image class="w-[100px] h-[100px] rounded-full overflow-hidden" :src="profileModel.avatar_url">
        <template #error>
          <div class="image-slot">
            <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
          </div>
        </template>
      </el-image>
      <button class="text-sm text-[#1d83ea] mt-4">Change Picture</button>
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        accept=".jpg, .jpeg, .png, .gif, .mp4"
        @change="handleFileUpload"
      >
    </div>
    
    <div class="flex py-4 border-b border-b-gray-200 w-full gap-8">
      <div class="w-12">
        <p class="flex items-center font-light">Username:</p>
      </div>

      <div class="customization-input">
        <el-input v-model="profileModel.username" label="Username" />
      </div>
    </div>
    <div class="flex py-4 border-b border-b-gray-200 w-full gap-8">
      <div class="w-12">
        <p class="flex items-center w-[100px] font-light">Full Name:</p>
      </div>

      <div class="customization-input">
        <el-input v-model="profileModel.full_name" label="Name" />
      </div>
    </div>
    <div class="flex py-4 border-b border-b-gray-200 w-full gap-8">
      <div class="w-12">
        <p class="flex items-cente  font-light">Bio:</p>
      </div>

      <div class="customization-input">
        <el-input v-model="profileModel.bio" label="Bio" />
      </div>
    </div>
    <el-button
      type="primary"
      class="px-8 lg:w-[300px] lg:px-0 mt-4"
      :disabled="!profileModel"
      @click="updateHandler"
    >
      Save
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'

const profileStore = useProfileStore()
const { profile, currentUserId } = storeToRefs(profileStore)
const { getProfile, getCurrentUser, updateProfile } = profileStore

const fileURL = ref()
const files = ref<File[]>()
const uploading = ref<boolean>(false)
const fileInput = ref()

const profileModel = ref({
  avatar_url: '',
  username: '',
  full_name: '',
  bio: ''
})

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  files.value = event.target.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)

    const { data, error } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl(fileName, 365 * 24 * 3600)

    if (!error) fileURL.value = data?.signedUrl as string
    if (uploadError) throw uploadError
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  } finally {
    uploading.value = false
  }
}
async function updateHandler () {
  uploading.value = true
  await updateProfile(currentUserId.value, profileModel.value).catch((e) => {
    ElNotification({
      title: 'Error',
      message: e.message || 'Something went wrong',
      type: 'error'
    })
  }).finally(() => {
    uploading.value = false
  })
}

onBeforeMount(async () => {
  await getCurrentUser()
  await getProfile(currentUserId.value)
  profileModel.value.avatar_url = profile.value.data.avatar_url
  profileModel.value.username = profile.value.data.username
  profileModel.value.full_name = profile.value.data.full_name
  profileModel.value.bio = profile.value.data.bio
})
</script>

<style lang="scss">
.customization-input {
  width: 100%;
  .el-input__wrapper {
    box-shadow: none !important;
  }
}
</style>
