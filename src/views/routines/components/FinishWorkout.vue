<template>
  <div class="lg:flex lg:flex-row-reverse lg:justify-between gap-4 pb-4">
    <div class="flex flex-row space-x-3 mb-3 lg:flex lg:flex-col lg:justify-start lg:space-y-3 lg:space-x-0">
      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer hover:bg-[#056DD7]"
        @click="saveWorkout"
      >
        Save Workout
      </button>

      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer
      border border-red-300 hover:bg-red-100 text-red-500"
        @click="confirmDiscard"
      >
        Discard
      </button>
    </div>

    <div v-loading="loading" class="bg-white p-4 border border-gray-300 rounded-lg grow">
      <div class="flex space-x-3 avatar-wrapper">
        <el-image class="w-10 h-10 rounded-full overflow-hidden" :src="avatar">
          <template #error>
            <ImagePlaseholder />
          </template>
        </el-image>
        <div>
          <p>Created by {{ username }}</p>
          <p class="text-gray-400">{{ getCurrentDate() }}</p>
        </div>
      </div>
      <div class="border-b border-b-gray-300 py-6 w-full element-input-wrapper mb-4">
        <el-input
          v-model="description"
          class="text-xl text-gray-400"
          placeholder="How did your workout go? Leave a comment..."
        />
      </div>

      <div class="cursor-pointer flex space-x-4 justify-center mb-6 mt-8" @click="fileInputRef.click()">
        <el-image
          :src="fileURL"
          class="flex items-center justify-center
    overflow-hidden"
        >
          <template #error>
            <div class="flex space-x-4">
              <el-icon class="w-[100px] h-[100px] border border-gray-400 rounded-full">
                <IconCreateExercisePlaceHolder />
              </el-icon>
              <button class="text-[#1D83EA]">
                Add Image
              </button>
            </div>
          </template>
        </el-image>

        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          accept=".jpg, .jpeg, .png"
          @change="handleFileUpload"
        >
      </div>
      <div class="mb-6 flex space-x-10">
        <div>
          <p class="text-gray-400">Duration</p>
          <p>{{ formatTime(duration) }}</p>
        </div>
        <div>
          <p class="text-gray-400">Sets</p>
          <p>{{ numberOfSets }}</p>
        </div>
      </div>

      <div>
        <Exercise
          v-for="(exerciseItem, idx) in completedWorkout"
          :key="exerciseItem.id"
          :exercise="exerciseItem"
          :class="{ 'border-t border-gray-300': idx !== 0 }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'

const props = defineProps<{
  completedWorkout: any
  duration: any
}>()

const router = useRouter()
const fileInputRef = ref()
const loading = ref(false)
const avatar = ref()
const username = ref()
const description = ref('')
const fileURL = ref('')
const exerciseMediaURL = ref('')
const files = ref<FileList | null>()
const date = ref(Date.now())

function formatTime (timestamp: number) {
  const hours = Math.floor(timestamp / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((timestamp % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timestamp % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const numberOfSets = computed(() => {
  let totalSets = 0

  for (const exercise of props.completedWorkout) {
    totalSets += exercise.sets.length
  }

  return totalSets
})

const { generateGUID } = useHelpers()
const { profile } = storeToRefs(useProfileStore())

const finishWorkoutModel = computed(() => {
  return {
    feed_id: generateGUID(),
    user_id: profile.value?.data.id,
    description: description.value,
    media_url: exerciseMediaURL.value,
    created_at: date.value as number,
    duration: props.duration,
    json_data: JSON.stringify(props.completedWorkout)
  } as IFeedResponse
})

function getCurrentDate () {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const currentDate = new Date()
  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = months[currentDate.getMonth()]
  const year = String(currentDate.getFullYear()).slice(-2)
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')

  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

async function getResizedImageForThumbnails (fileName: string) {
  try {
    const { data, error } = await exercisesService.getResizedImageForThumbnails(fileName)
    if (!error) fileURL.value = data?.signedUrl as string
  } catch (err) {
    handleErrors(err)
  }
}

function handleErrors (err: unknown) {
  if (err instanceof Error) {
    throw Error(err.message)
  } else {
    console.log('Unexpected error', err)
  }
}

async function uploadExerciseMedia (file: File) {
  const fileExt = file.name.split('.').pop() as string
  const fileName = `exercise-media-${Date.now()}`
  try {
    await Promise.all([
      exercisesService.uploadExercisesMedia(`${fileName}.${fileExt}`, file, 'exercises'),
      exercisesService.uploadExercisesMedia(`${fileName}.jpeg`, file, 'thumbnails')
    ])
  } catch (err) {
    handleErrors(err)
  }
  await getResizedImageForThumbnails(`${fileName}.jpeg`)
  const { data } = await exercisesService.getExerciseMedia(`${fileName}.${fileExt}`)
  exerciseMediaURL.value = data?.signedUrl as string
}

async function handleFileUpload (event: Event) {
  try {
    // if (finishWorkoutModel.value.media_url) {
    //   const deletedFileName = finishWorkoutModel.value.media_url?.split('/')[8].split('?')[0]
    //   console.log(deletedFileName)
    //   const { error: deleteError } = await supabase.storage.from('exercises').remove([deletedFileName])
    //   if (deleteError) throw deleteError
    // }

    files.value = (event.target as HTMLInputElement).files
    loading.value = true
    if (!files.value || !files.value.length) return

    await uploadExerciseMedia(files.value[0])
  } catch (error: any) {
    ElNotification({ title: 'Error', message: error.message, type: 'error' })
  } finally {
    loading.value = false
  }
}

const confirmDiscard = () => {
  ElMessageBox.confirm(
    'Are you sure you want to discard this workout?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    router.push({ name: 'routines' })
  })
    .catch((e: any) => {
      ElNotification({ title: 'Error', message: e.message, type: 'error' })
    })
}

const saveWorkout = async () => {
  try {
    loading.value = true
    const { error } = await routinesService.saveWorkout(finishWorkoutModel.value)
    if (error) throw new Error(error.message)
    ElNotification({ title: 'Success', message: 'Workout saved successfully', type: 'success' })
    router.push({ name: 'routines' })
  } catch (error: any) {
    ElNotification({ title: 'Error', message: error.message, type: 'error' })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    avatar.value = profile.value?.data.avatar_url
    username.value = profile.value?.data.username
  } catch (error: any) {
    ElNotification({ title: 'Error', message: error.message, type: 'error' })
  } finally {
    loading.value = false
  }
})

</script>

<style lang="scss">
.element-input-wrapper{
  .el-input__wrapper {
    box-shadow: none !important;
    padding: 1px 0px 1px 0px !important;
  }
}

.avatar-wrapper{
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}
</style>
