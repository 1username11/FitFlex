<template>
  <div
    v-loading="loading"
    class="h-fit flex flex-col border border-gray-300 rounded-lg bg-white p-10 form-wrapper mx-auto"
    :class="isLargeScreen ? 'w-fit' : 'w-full'"
  >
    <el-form
      ref="profileRef"
      :label-position="labelPositon"
      :class="isLargeScreen ? '' : 'w-full'"
      :rules="profileRules"
      :model="profileModel"
      @submit.prevent="submit"
    >
      <el-form-item prop="avatar_url">
        <div class="avatar-wrapper" @click="openFileInput">
          <el-image
            class="w-[150px] h-[150px] rounded-full overflow-hidden"
            :src="profileModel.avatar_url" fit="cover"
          >
            <template #error>
              <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
            </template>
          </el-image>

          <button class="text-sm text-[#1d83ea] mt-4">Change Picture</button>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            accept=".jpg, .jpeg, .png"
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

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)
const { getCurrentPosition, getProfile } = profileStore

const generalStore = useGeneralStore()
const { userId } = storeToRefs(generalStore)

const loading = ref(false)
const fileInput = ref<HTMLInputElement>()
const profileRef = ref()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const labelPositon = computed(() => {
  return isLargeScreen.value ? 'left' : 'top'
})

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
    { required: true, message: 'Please your telegram link', trigger: 'blur' },
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
  ]
})

const profileModel = ref(Object.assign({}, profile.value?.data))
const deletedFileName = profileModel.value.avatar_url?.split('/')[8].split('?')[0]

const openFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  try {
    loading.value = true
    const { error: deleteError } = await supabase
      .storage
      .from('avatars')
      .remove([`storage/v1/object/public/avatars/${deletedFileName}`])
    if (deleteError) throw deleteError

    const files = (event.target as HTMLInputElement).files
    if (!files.length) {
      throw new Error('You must select an image to upload.')
    }

    const file = files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `profile_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)

    const { data, error: signedUrlError } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl(fileName, 365 * 24 * 3600)

    if (uploadError) throw uploadError
    if (!signedUrlError) {
      profileModel.value.avatar_url = data?.signedUrl
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
    loading.value = false
  }
}

async function updateHandler () {
  loading.value = true
  try {
    const { error } = await profileService.updateProfile(userId.value, profileModel.value)
    if (error) throw Error(error.message)

    ElNotification({
      title: 'Success',
      message: 'Profile updated successfully',
      type: 'success'
    })
    await getProfile(userId.value)
    profileModel.value = Object.assign({}, profile.value?.data)
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function submit () {
  profileRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      await updateHandler()
    } else {
      ElNotification({
        title: 'Error',
        message: 'Please fill in all fields',
        type: 'error'
      })
    }
  })
}

watch(() => profileModel.value.is_public, async (value) => {
  if (value) {
    const { coords } = await getCurrentPosition()
    profileModel.value.lat = coords.latitude
    profileModel.value.lng = coords.longitude
  }
})

onBeforeRouteLeave(async (to, from, next) => {
  const isModified = JSON.stringify(profileModel.value) !== JSON.stringify(profile.value?.data)
  if (isModified) {
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
      .catch((action: string) => {
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

window.addEventListener('beforeunload', (e) => {
  const isModified = JSON.stringify(profileModel.value) !== JSON.stringify(profile.value?.data)
  if (isModified) {
    e.preventDefault()
    e.returnValue = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', () => '')
})

onMounted(() => {
  console.log('profileModel', profileModel.value)
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
  align-items: center;
  display: flex;

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
</style>
