<template>
  <div v-loading="uploading" class="flex flex-col justify-center items-center bg-white max-w-[550px] p-5 rounded-lg">
    <p class="text-lg font-bold mb-4 w-full">Create Exercise</p>
    <div class="cursor-pointer" @click="openFileInput">
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
        ref="fileInput"
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
      <p class="flex items-center">
        Exercise type
      </p>

      <el-select-v2 v-model="type" :options="exerciseTypes" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Equipment
      </p>

      <el-select-v2 v-model="equipment" :options="equipments" class="ml-2" />
    </div>

    <div class="flex justify-between w-full py-4 border-b border-b-gray-300">
      <p class="flex items-center">
        Primary Muscle Group
      </p>

      <el-select-v2 v-model="primary" :options="muscleGroups" class="ml-2" />
    </div>

    <div class="flex justify-end items-end w-full">
      <el-button type="primary" class="mt-28 w-[200px]" @click="createHandler(exersiceForm)">
        Create Exercise
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import { ElNotification } from 'element-plus'

const emit = defineEmits(['closePopup'])

const exercisesStore = useExercisesStore()
const { insertExercise } = exercisesStore
const {
  hashedMuscleGroups,
  hashedExerciseTypes,
  hashedEquipment
} = storeToRefs(exercisesStore)

const title = ref('')
const type = ref('')
const equipment = ref('')
const primary = ref('')
const fileInput = ref()
const files = ref<File[]>()
const uploading = ref(false)
const fileURL = ref('')

const openFileInput = () => {
  fileInput.value.click()
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
    console.log(fileExt)

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
      const fileName = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('thumbnails').upload(fileName, file)

      const { data, error } = await supabase
        .storage
        .from('thumbnails')
        .createSignedUrl(fileName, 365 * 24 * 3600, {
          transform: {
            width: 50,
            height: 50
          }
        })
      if (!error) fileURL.value = data?.signedUrl as string

      if (uploadError) throw uploadError
    } else {
      const fileName = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('exercises').upload(fileName, file)

      const { data, error } = await supabase
        .storage
        .from('exercises')
        .createSignedUrl(fileName, 365 * 24 * 3600)
      if (!error) fileURL.value = data?.signedUrl as string

      if (uploadError) throw uploadError
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

console.log(hashedMuscleGroups.value, hashedExerciseTypes.value, hashedEquipment.value)

const exerciseTypes = ref(Object.entries(hashedExerciseTypes.value)
  .map(([key, value]) => ({ label: value, value: key })))
const equipments = ref(Object.entries(hashedEquipment.value)
  .map(([key, value]) => ({ label: value, value: key })))
const muscleGroups = ref(Object.entries(hashedMuscleGroups.value)
  .map(([key, value]) => ({ label: value, value: key })))

async function createHandler (form) {
  await insertExercise(form).then(() => {
    ElNotification({
      title: 'Success',
      message: 'Exercise created successfully',
      type: 'success'
    })
  }).catch((error) => {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  }).finally(() => {
    emit('closePopup')
  })
}

const exersiceForm = ref({
  title,
  equipment_category: equipment,
  muscle_group: primary,
  exercise_type: type,
  thumbnails_url: fileURL.value,
  exercise_media_url: fileURL.value
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
