<template>
  <div v-loading="loading" class="flex flex-col justify-center items-center bg-white max-w-[550px] p-5 rounded-lg">
    <p class="text-lg font-bold mb-4 w-full">{{ props.exerciseId ? 'Update Exercise': 'Create Exercise' }}</p>

    <div class="cursor-pointer" @click="fileInputRef.click()">
      <el-image
        :src="fileURL"
        class="flex items-center justify-center w-[80px] h-[80px]
        rounded-full overflow-hidden border border-gray-400 mb-5"
      >
        <template #error>
          <el-icon>
            <IconCreateExercisePlaceHolder />
          </el-icon>
        </template>
      </el-image>

      <button class="text-[#1D83EA] mb-5">
        Add Image
      </button>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        accept=".jpg, .jpeg, .png, .gif, .mp4"
        @change="handleFileUpload"
      >
    </div>

    <div class="border-b border-b-gray-300 py-6 w-full element-input-wrapper">
      <el-input
        v-model="title"
        class="text-xl text-gray-400"
        placeholder="Exercise Name"
      />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">Exercise type</p>

      <el-select-v2 v-model="type" :options="exerciseTypes" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Equipment
      </p>

      <el-select-v2 v-model="equipment" :options="equipments" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">Primary Muscle Group</p>

      <el-select-v2 v-model="primary" :options="muscleGroups" class="ml-2" />
    </div>

    <div class="flex justify-end items-end w-full">
      <el-button type="primary" class="mt-28 w-[200px]" @click="upsertHandler">
        {{ props.exerciseId ? 'Update Exercise' : 'Create Exercise' }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close'])
const props = defineProps<{
  exerciseId?: IExercise['id']
}>()

const exercisesStore = useExercisesStore()
const { hashedMuscleGroups, hashedExerciseTypes, hashedEquipment } = storeToRefs(exercisesStore)

const generalStore = useGeneralStore()
const { userId } = storeToRefs(generalStore)

const title = ref('')
const type = ref('')
const equipment = ref('')
const primary = ref('')
const fileInputRef = ref()
const files = ref<FileList | null>()
const loading = ref(false)
const fileURL = ref('')
const exerciseMediaURL = ref('')
const userRole = ref('')

const exerciseStore = useExercisesStore()
const { getExercises, getMuscleGroups, getExerciseTypes, getEquipment } = exerciseStore

function handleErrors (err: unknown) {
  if (err instanceof Error) {
    throw Error(err.message)
  } else {
    console.log('Unexpected error', err)
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

async function getResizedImageForThumbnails (fileName: string) {
  try {
    const { data, error } = await exercisesService.getResizedImageForThumbnails(fileName)
    if (!error) fileURL.value = data?.signedUrl as string
  } catch (err) {
    handleErrors(err)
  }
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

console.log(hashedMuscleGroups.value, hashedExerciseTypes.value, hashedEquipment.value)
const router = useRouter()

const exerciseTypes = ref(Object.entries(hashedExerciseTypes.value)
  .map(([key, value]) => ({ label: value, value: key })))
const equipments = ref(Object.entries(hashedEquipment.value)
  .map(([key, value]) => ({ label: value, value: key })))
const muscleGroups = ref(Object.entries(hashedMuscleGroups.value)
  .map(([key, value]) => ({ label: value, value: key })))

async function upsertHandler () {
  const exercise = {
    title: title.value,
    equipment_category: equipment.value,
    muscle_group: primary.value,
    exercise_type: type.value,
    thumbnails_url: fileURL.value,
    exercise_media_url: exerciseMediaURL.value || fileURL.value,
    user_id: userId.value,
    is_public: router.currentRoute.value.fullPath === '/admin-panel'
  }
  try {
    if (props.exerciseId) {
      const { error } = await exercisesService.updateExercise(props.exerciseId, exercise)
      if (!error) {
        ElNotification({ title: 'Success', type: 'success' })
      } else {
        throw new Error(error.message)
      }
    } else {
      const { error } = await exercisesService.insertExercise(exercise)
      if (!error) {
        ElNotification({ title: 'Success', type: 'success' })
      } else {
        throw new Error(error.message)
      }
    }
    loading.value = true
    Promise.allSettled([
      getMuscleGroups(),
      getExerciseTypes(),
      getEquipment()
    ]).then(() => {
      getExercises()
    }).catch((e) => {
      console.log(e)
    }).finally(() => {
      loading.value = false
    })
  } catch (e: any) {
    ElNotification({ title: 'Error', message: e.message, type: 'error' })
  } finally {
    emit('close')
  }
}
onMounted(() => {
  userRole.value = localStorage.getItem('role') as string
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
