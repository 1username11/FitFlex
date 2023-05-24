<template>
  <div class="flex flex-col">
    <div class="flex bg-white border border-gray-300 rounded-xl mb-4 p-5">
      <el-image
        :src="sampleUser.avatar"
        :alt="sampleUser.name"
        class="w-[100px] h-[100px] rounded-full mr-4"
      />
      <div>
        <p class="text-xl font-bold mb-2">{{ sampleUser.name }}</p>
        <div class="text-sm w-fit">
          <p class="flex text-gray-400">Workouts</p>
          <p class="flex justify-center">{{ testData.length }}</p>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <div>
        <p class="text-xl font-bold mb-4">Workouts</p>
        <div class="flex flex-col items-center mr-4">
          <WorkoutLog
            v-for="testDataItem in testData"
            :key="testDataItem.id"
            :log="testDataItem"
          />
        </div>
      </div>
      <div class="w-full">
        <p class="text-xl font-bold mb-4">Statistics</p>
        <div class="flex bg-white border border-gray-300 rounded-xl p-4">
          Statistics
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WorkoutLog from './components/WorkoutLog.vue'

const sampleSet: ISet = {
  id: 'set1',
  reps: 10,
  description: 'Sample set',
  weight: 50
}

const sampleExercise: IExercise = {
  id: 'exercise1',
  name: 'Sample Exercise',
  img: 'exercise.jpg',
  sets: [sampleSet]
}

const sampleUser: IUser = {
  id: 'user1',
  name: 'John Doe',
  age: 25,
  avatar: 'avatar.jpg'
}

const sampleWorkout: IRoutine = {
  id: 'workout1',
  exercises: [sampleExercise]
}

const sampleComment: IComment = {
  id: 'comment1',
  user: sampleUser,
  content: 'Great job!'
}

const testData: ILog[] = [{
  id: 'log1',
  user: sampleUser,
  publishTime: new Date(),
  title: 'Sample Log',
  description: 'This is a sample log',
  duration: '1 hour',
  reps: 10,
  workout: sampleWorkout,
  likes: 5,
  comments: [sampleComment]
}]

</script>
