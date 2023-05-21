<template>
  <div class="lg:flex gap-5">
    <div>
      <p class="mb-5 text-xl font-bold">My Routines</p>
      <button class="bg-white border border-gray-300 pr-4 py-1 rounded-lg w-[180px] mb-5">
        <NewRoutineIcon />
        New Routine
      </button>
    </div>
    <div class="bg-white rounded-lg p-5 border border-gray-300 w-full">
      <p class="text-gray-400">
        My Routines {{ sampleWorkouts.length > 1 ? `(${sampleWorkouts.length})` : '' }}
      </p>
      <draggable v-model="sampleWorkouts" :animation="300" item-key="id" class="cursor-move">
        <template #item="{ element: workout }">
          <RoutinesItem :workout="workout" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'

const sampleSet1: ISet = {
  id: 'set1',
  reps: 10,
  description: 'Set 1',
  weight: 50
}

const sampleSet2: ISet = {
  id: 'set2',
  reps: 8,
  description: 'Set 2',
  weight: 60
}

const sampleSet3: ISet = {
  id: 'set3',
  reps: 12,
  description: 'Set 3',
  weight: 40
}

const sampleExercise1: IExercise = {
  id: 'exercise1',
  name: 'Exercise 1',
  img: 'exercise1.jpg',
  sets: [sampleSet1, sampleSet2]
}

const sampleExercise2: IExercise = {
  id: 'exercise2',
  name: 'Exercise 2',
  img: 'exercise2.jpg',
  sets: [sampleSet1, sampleSet2, sampleSet3]
}

const sampleUser: IUser = {
  id: 'user1',
  name: 'John Doe',
  age: 25,
  avatar: 'avatar.jpg'
}

const sampleWorkouts: Ref<IWorkout[]> = ref([{
  id: 'workout1',
  name: 'Sample Workout1',
  exercises: [sampleExercise1, sampleExercise2],
  user: sampleUser
},
{
  id: 'workout2',
  name: 'Sample Workout2',
  exercises: [sampleExercise1, sampleExercise2],
  user: sampleUser
},
{
  id: 'workout3',
  name: 'Sample Workout3',
  exercises: [sampleExercise1, sampleExercise2],
  user: sampleUser
},
{
  id: 'workout4',
  name: 'Sample Workout4',
  exercises: [sampleExercise1, sampleExercise2],
  user: sampleUser
}
])
</script>
