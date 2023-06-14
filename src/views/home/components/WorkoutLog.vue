<template>
  <div class="flex flex-col p-4 w-full bg-white rounded-xl border border-gray-300 mb-4">
    <div>
      <div class="flex mb-4">
        <el-image :src="user.avatar_url" class="w-12 h-12 rounded-full overflow-hidden mr-4">
          <template #error>
            <div class="image-slot">
              <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
            </div>
          </template>
        </el-image>

        <div>
          <p>{{ user.username }}</p>

          <p class="text-gray-400 text-sm">{{ parsedFeed.created_at }}</p>
        </div>
      </div>
      <!-- <div class="text-xl font-bold mb-4">{{ feed.title }}</div> -->

      <div class="text-gray-400 mb-4">{{ parsedFeed.description }}</div>

      <div
        class="flex space-x-8"
        :class="feed.media_url ? 'border-b border-gray-300 mb-4': ''"
      >
        <div>
          <p class="text-sm text-gray-400 mb-1">Duration</p>

          <p>
            {{ parsedFeed.duration }}
          </p>
        </div>

        <div>
          <p class="text-sm text-gray-400 mb-1">Reps</p>

          <p>
            {{ getTotalReps(parsedFeed) }}
          </p>
        </div>
      </div>
      <div class="rounded-lg overflow-hidden">
        <el-image :src="feed.media_url">
          <template #error>
            <div class="none" />
          </template>
        </el-image>
      </div>
    </div>

    <span class="w-full h-[1px] bg-gray-300 my-4" />

    <div>
      <div class="text-gray-400 mb-4">
        Workout
      </div>

      <div>
        <div
          v-for="(exercise) in showMore ? parsedFeed.json_data: parsedFeed.json_data.slice(0, 3) "
          :key="exercise.id"
          class="flex mb-4"
        >
          <div class="flex w-full">
            <div v-if="!showMore" class="flex space-x-1 items-center">
              <el-image class="w-12 h-12 mr-4 rounded-full overflow-hidden" :src="exercise.thumbnails_url">
                <template #error>
                  <ImagePlaseholder />
                </template>
              </el-image>

              <div class="text-lg font-semibold">{{ exercise.sets.length }} sets</div>

              <div class="text-lg font-semibold">
                {{ `${exercise.title } (${hashedEquipment[exercise.equipment_category]})` }}
              </div>
            </div>
            <div
              v-else-if="showMore"
              class="flex flex-col w-full"
            >
              <div>
                <div class="flex items-center mb-4">
                  <el-image class="w-12 h-12 mr-4 rounded-full overflow-hidden" :src="exercise.thumbnails_url">
                    <template #error>
                      <ImagePlaseholder />
                    </template>
                  </el-image>
                  <p class="text-lg font-semibold">
                    {{ `${exercise.title } (${hashedEquipment[exercise.equipment_category]})` }}
                  </p>
                </div>

                <div class="flex space-x-10 mb-2 p-2">
                  <p class="text-lg font-semibold text-gray-400">Sets</p>

                  <p
                    v-if="['weight reps', 'weight distance']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold text-gray-400"
                  >
                    Weight & Reps
                  </p>
                  <p
                    v-else-if="['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold text-gray-400"
                  >
                    Reps
                  </p>

                  <p
                    v-else-if="['duration', 'distance duration']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold text-gray-400"
                  >
                    Duration
                  </p>
                </div>
              </div>
              <div
                v-for="(set, idx) in exercise.sets"
                :key="set.id"
                class="mb-2 w-full items-center p-2"
                :class="idx % 2 === 1 ? 'bg-gray-100' : ''"
              >
                <div
                  class="flex space-x-12 w-full"
                >
                  <p
                    class="flex justify-center bg-white rounded-md items-center
                     border border-gray-200 w-[30px] h-[30px] text-lg font-semibold p-4"
                  >
                    {{ idx + 1 }}
                  </p>
                  <p
                    v-if="['weight reps', 'weight distance']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold w-full"
                  >
                    {{ `${set.weight} x ${set.reps}` }}
                  </p>
                  <p
                    v-else-if="['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold w-full"
                  >
                    {{ `${set.reps}` }}
                  </p>

                  <p
                    v-else-if="['duration', 'distance duration']
                      .includes(exercise.exercise_type)"
                    class="text-lg font-semibold w-full"
                  >
                    {{ `${set.duration}` }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          v-if="parsedFeed.json_data.length > 3 && !showMore"
          class="text-gray-400"
          @click="showMore=!showMore"
        >
          See more exercise
        </button>

        <button
          v-if="showMore"
          class="text-gray-400"
          @click="showMore=!showMore"
        >
          See less exercise
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  feed: IFeedJson
  user: IUser
  hashedEquipment: TIndexedObject<string>
  hashedExerciseTypes: TIndexedObject<string>
}>()

const showMore = ref(false)

const parsedFeed = ref({
  ...props.feed,
  json_data: JSON.parse(props.feed.json_data)
} as IFeed)
console.log('parsedFeed', parsedFeed.value)

// function getFormattedDate (date: Date) {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

//   const day = date.getDate()
//   const monthIndex = date.getMonth()
//   const year = date.getFullYear()
//   const hours = String(date.getHours()).padStart(2, '0')
//   const minutes = String(date.getMinutes()).padStart(2, '0')

//   const formattedDate = `${day} ${months[monthIndex]} ${year}, ${hours}:${minutes}`

//   return formattedDate
// }

function getTotalReps (data: IFeed) {
  let totalReps = 0

  data.json_data.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.reps !== null) {
        totalReps += set.reps
      }
    })
  })

  return totalReps
}
</script>
