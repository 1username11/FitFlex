<template>
  <div class="lg:flex lg:flex-row-reverse lg:justify-between gap-4">
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
      <div class="flex space-x-3">
        <el-image class="w-10 h-10 rounded-full overflow-hidden" :src="avatar">
          <template #error>
            <ImagePlaseholder />
          </template>
        </el-image>
        <div>
          <p>Created by {{ username }}</p>
          <p class="text-gray-400">{{ date }}</p>
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
          accept=".jpg, .jpeg, .png, .gif, .mp4"
          @change="handleFileUpload"
        >
      </div>
      <div class="mb-6 flex space-x-10">
        <div>
          <p class="text-gray-400">Duration</p>
          <p>{{ props.duration }}</p>
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
const currentRouteParam = router.currentRoute.value.params.id
const fileInputRef = ref()
const loading = ref(false)
const currentUser = ref()
const avatar = ref()
const username = ref()
const description = ref('')
const fileURL = ref('')
const exerciseMediaURL = ref('')
const files = ref<FileList | null>()
const date = ref(getCurrentDate())

const numberOfSets = computed(() => {
  let totalSets = 0

  for (const exercise of props.completedWorkout) {
    totalSets += exercise.sets.length
  }

  return totalSets
})

const generalStore = useGeneralStore()
const { generateGUID } = generalStore

const finishWorkoutModel = computed(() => {
  return {
    feed_id: generateGUID(),
    user_id: currentUser.value?.id,
    routine_id: currentRouteParam,
    description: description.value,
    media_url: exerciseMediaURL.value,
    created_at: date.value,
    duration: props.duration
  }
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

function getVideoCover (file: File, fileName: string, seekTo = 0.5) {
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video')
    videoPlayer.setAttribute('src', URL.createObjectURL(file))
    videoPlayer.load()
    videoPlayer.addEventListener('error', (ex) => {
      reject(new Error(ex?.message))
    })
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject(new Error('video is too short.'))
        return
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => { videoPlayer.currentTime = seekTo }, 200)
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement('canvas')
        canvas.width = videoPlayer.videoWidth
        canvas.height = videoPlayer.videoHeight
        // draw the video frame to canvas
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)
        // return the canvas image as a blob
        ctx?.canvas.toBlob((blob) => {
          const file = new File([blob as Blob], `${fileName}.jpeg`, { type: 'image/jpeg' })
          resolve(file)
        })
      })
    })
  })
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
    let cover: File | null = null

    if (fileExt === 'mp4') {
      cover = await getVideoCover(file, fileName) as File
    }
    await Promise.all([
      exercisesService.uploadExercisesMedia(`${fileName}.${fileExt}`, file, 'exercises'),
      exercisesService.uploadExercisesMedia(`${fileName}.jpeg`, cover || file, 'thumbnails')
    ])
    console.log(cover)
  } catch (err) {
    handleErrors(err)
  }
  await getResizedImageForThumbnails(`${fileName}.jpeg`)
  const { data } = await exercisesService.getExerciseMedia(`${fileName}.${fileExt}`)
  exerciseMediaURL.value = data?.signedUrl as string
  console.log(exerciseMediaURL.value)
}

async function handleFileUpload (event: Event) {
  files.value = (event.target as HTMLInputElement).files
  try {
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
      console.log(e)
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
    currentUser.value = (await supabase.auth.getUser()).data.user
    avatar.value = currentUser.value.user_metadata.avatar_url
    username.value = currentUser.value.user_metadata.full_name
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }

  console.log('completedWorkout: ', props.completedWorkout)
})

watch(finishWorkoutModel, () => {
  console.log(finishWorkoutModel.value)
})
</script>

<style lang="scss">
.element-input-wrapper{
  .el-input__wrapper {
    box-shadow: none !important;
    padding: 1px 0px 1px 0px !important;
  }
}
</style>
