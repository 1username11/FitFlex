<template>
  <div class="flex">
    <div class="flex flex-col items-center mx-auto px-3 mr-2">
      <WorkoutLog
        v-for="testDataItem in testData"
        :key="testDataItem.id"
        :log="testDataItem"
      />
    </div>
    <div>
      Statistics
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

const sampleWorkout: IWorkout = {
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
