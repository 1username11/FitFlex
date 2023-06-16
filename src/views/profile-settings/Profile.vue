<template>
  <div
    v-loading="uploading"
    class="w-fit h-fit flex flex-col border border-gray-300 rounded-lg bg-white p-10 form-wrapper mx-auto"
  >
    <el-form
      ref="profileRef"
      label-position="right"
      :rules="profileRules"
      :model="profileModel"
      @submit.prevent="submit"
    >
      <el-form-item prop="avatar_url">
        <div class="avatar-wrapper" @click="openFileInput">
          <el-image class="w-[150px] h-[150px] rounded-full overflow-hidden" :src="profileModel.avatar_url" fit="cover">
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
      </el-form-item>
      <el-form-item prop="username" label="Username">
        <el-input v-model="profileModel.username" label="Username" />
      </el-form-item>
      <el-form-item prop="full_name" label="Full name">
        <el-input v-model="profileModel.full_name" label="Full name" />
      </el-form-item>
      <el-form-item prop="bio" label="Bio">
        <el-input v-model="profileModel.bio" label="Bio" />
      </el-form-item>
      <el-form-item prop="phone_number" label="Phone number">
        <el-input v-model="profileModel.phone_number" label="Phone number" />
      </el-form-item>
      <el-form-item prop="telegram_link" label="Telegram link">
        <el-input v-model="profileModel.telegram_link" label="Telegram link" />
      </el-form-item>
      <el-form-item prop="e_mail" label="E-mail">
        <el-input v-model="profileModel.e_mail" label="E-mail" />
      </el-form-item>
      <el-form-item prop="other_contact_info" label="Other contact information">
        <el-input v-model="profileModel.other_contact_info" label="Other contact information" />
      </el-form-item>
      <el-form-item prop="additional_info" label="Additional information">
        <el-input v-model="profileModel.additional_info" label="Additional information" />
      </el-form-item>
      <el-form-item prop="additional_info" label="Additional information">
        <el-input v-model="profileModel.additional_info" label="Additional information" />
      </el-form-item>
      <el-form-item prop="body_weight" label="Bodyweight">
        <el-input v-model="profileModel.body_weight" label="Bodyweight" />
      </el-form-item>
      <el-form-item prop="is_public" class="switcher" label="Is public">
        <el-switch v-model="profileModel.is_public" active-color="#1d83ea" inactive-color="#c0ccda" />
      </el-form-item>
      <el-form-item class="form-button-wrapper">
        <el-button native-type="submit" :type="$elComponentType.primary">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import { ElNotification } from 'element-plus'

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { getProfile, updateProfile, getCurrentPosition } = profileStore

const generalStore = useGeneralStore()
const { userId } = storeToRefs(generalStore)

const fileURL = ref<string>()
const files = ref<File[]>()
const uploading = ref<boolean>(false)
const fileInput = ref<HTMLInputElement>()
const isPublic = ref<boolean>(false)
const profileRef = ref()
const isModified = ref(false)

const profileRules = reactive({
  avatar_url: [{ required: true, message: 'Please select an image', trigger: 'blur' }],
  username: [
    { required: true, message: 'Please enter a username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Username must be between 3 and 20 characters', trigger: 'blur' }
  ],
  full_name: [
    { required: true, message: 'Please enter your full name', trigger: 'blur' },
    { min: 3, max: 50, message: 'Full name must be between 3 and 50 characters', trigger: 'blur' }
  ],
  bio: [
    { max: 100, message: 'Bio cannot exceed 100 characters', trigger: 'blur' }
  ],
  phone_number: [
    { pattern: /^\d{10}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  telegram_link: [
    { pattern: /^(https?:\/\/)?(www\.)?t.me\/[a-zA-Z0-9_]{5,32}\/?$/, message: 'Please enter a valid Telegram link', trigger: 'blur' }
  ],
  e_mail: [
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  other_contact_info: [
    { max: 100, message: 'Other contact information cannot exceed 100 characters', trigger: 'blur' }
  ],
  body_weight: [
    { pattern: /^\d{2,3}$/, message: 'Please enter a valid bodyweight', trigger: 'blur' }
  ],
  additional_info: [
    { max: 100, message: 'Additional information cannot exceed 100 characters', trigger: 'blur' }
  ],
  is_public: [{ required: true, message: 'Please specify if the profile is public', trigger: 'blur' }]
})

const profileModel = reactive({
  avatar_url: '',
  username: '',
  full_name: '',
  bio: '',
  lat: undefined as number | undefined,
  lng: undefined as number | undefined,
  phone_number: '',
  telegram_link: '',
  e_mail: '',
  other_contact_info: '',
  additional_info: '',
  body_weight: undefined as number | undefined,
  is_public: isPublic.value
})

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  files.value = target.files
  try {
    uploading.value = true
    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)

    const { data, error: signedUrlError } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl(fileName, 365 * 24 * 3600)

    if (uploadError) throw uploadError
    if (!signedUrlError) {
      fileURL.value = data?.signedUrl as string
      profileModel.avatar_url = fileURL.value
    } else {
      throw signedUrlError
    }
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
  await updateProfile(userId.value, profileModel).catch((e) => {
    ElNotification({
      title: 'Error',
      message: e.message || 'Something went wrong',
      type: 'error'
    })
  }).then(() => {
    ElNotification({
      title: 'Success',
      message: 'Profile updated successfully',
      type: 'success'
    })
  }).finally(() => {
    uploading.value = false
  })
}

function submit () {
  profileRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      updateHandler()
    } else {
      ElNotification({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error'
      })
    }
  })
  isModified.value = false
}

setTimeout(() => {
  watch(profileModel, () => {
    isModified.value = true
    console.log('isModified', isModified.value)
  }, { deep: true })
}, 1000)

onMounted(async () => {
  await getProfile(userId.value)
  profileModel.avatar_url = profile.value?.data.avatar_url as string
  profileModel.username = profile.value?.data.username as string
  profileModel.full_name = profile.value?.data.full_name as string
  profileModel.bio = profile.value?.data.bio as string
  profileModel.lat = profile.value?.data.lat as number | undefined
  profileModel.lng = profile.value?.data.lng as number | undefined
  profileModel.phone_number = profile.value?.data.phone_number as string
  profileModel.telegram_link = profile.value?.data.telegram_link as string
  profileModel.e_mail = profile.value?.data.e_mail as string
  profileModel.other_contact_info = profile.value?.data.other_contact_info as string
  profileModel.additional_info = profile.value?.data.additional_info as string
  profileModel.body_weight = profile.value?.data.body_weight as number
  isPublic.value = profile.value?.data.is_public as boolean
  isModified.value = false
})

watch(isPublic, async (value) => {
  profileModel.is_public = value
  if (value) {
    const { coords } = await getCurrentPosition()
    profileModel.lat = coords.latitude
    profileModel.lng = coords.longitude
  } else {
    profileModel.lat = undefined
    profileModel.lng = undefined
  }
})

onBeforeRouteLeave(async (to, from, next) => {
  if (isModified.value) {
    await ElMessageBox.confirm(
      'You have unsaved changes, save and proceed?',
      'Confirm',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Discard Changes'
      }
    )
      .then(() => {
        submit()
        next()
      })
      .catch((action) => {
        ElMessage({
          type: 'info',
          message:
          action === 'cancel'
            ? 'Changes discarded. Proceeding to a new route.'
            : 'Stay in the current route'
        })
        action === 'cancel' ? next() : next(false)
      })
  } else {
    next()
  }
})
</script>

<style lang="scss">
.customization-input {
  width: 100%;
  .el-input__wrapper {
    box-shadow: none !important;
  }
}

.form-wrapper {
  .el-form-item__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .el-image {
    :first-child {
      width: 100%;
      height: 100%;
    }
  }
}

.switcher {
  .el-form-item__content {
    align-items: start !important;
  }
}

.form-button-wrapper{
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .el-button {
    width: 30%;
  }
}
.form-wrapper{
  align-items: center;

}
</style>
