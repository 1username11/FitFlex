<template>
  <NavBar />
  <div class="flex flex-col items-center mx-auto px-3">
    <WorkoutLog
      v-for="workout in testData"
      :key="workout.id"
      :log="workout"
    />
  </div>
</template>

<script lang="ts" setup>
const testData: ILog[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      age: 25,
      avatar: 'avatar.jpg'
    },
    publishTime: new Date(),
    title: 'My Workout Log',
    description: 'This is my workout log for today',
    duration: '1 hour',
    reps: 10,
    workout: {
      id: '1',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          img: 'bench_press.jpg',
          sets: [
            {
              id: '1',
              reps: 10,
              description: 'Set 1',
              weight: 100
            },
            {
              id: '2',
              reps: 8,
              description: 'Set 2',
              weight: 120
            }
          ]
        },
        {
          id: '2',
          name: 'Squats',
          img: 'squats.jpg',
          sets: [
            {
              id: '1',
              reps: 12,
              description: 'Set 1',
              weight: 80
            },
            {
              id: '2',
              reps: 10,
              description: 'Set 2',
              weight: 100
            }
          ]
        }
      ]
    },
    likes: 5,
    comments: [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Jane Smith',
          age: 30,
          avatar: 'avatar.jpg'
        },
        content: 'Great workout!'
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'David Johnson',
          age: 28,
          avatar: 'avatar.jpg'
        },
        content: 'Keep up the good work!'
      }
    ]
  },
  {
    id: '2',
    user: {
      id: '1',
      name: 'John Doe',
      age: 25,
      avatar: 'avatar.jpg'
    },
    publishTime: new Date(),
    title: 'My Workout Log',
    description: 'This is my workout log for today',
    duration: '1 hour',
    reps: 10,
    workout: {
      id: '1',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          img: 'bench_press.jpg',
          sets: [
            {
              id: '1',
              reps: 10,
              description: 'Set 1',
              weight: 100
            },
            {
              id: '2',
              reps: 8,
              description: 'Set 2',
              weight: 120
            }
          ]
        },
        {
          id: '2',
          name: 'Squats',
          img: 'squats.jpg',
          sets: [
            {
              id: '1',
              reps: 12,
              description: 'Set 1',
              weight: 80
            },
            {
              id: '2',
              reps: 10,
              description: 'Set 2',
              weight: 100
            }
          ]
        }
      ]
    },
    likes: 5,
    comments: [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Jane Smith',
          age: 30,
          avatar: 'avatar.jpg'
        },
        content: 'Great workout!'
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'David Johnson',
          age: 28,
          avatar: 'avatar.jpg'
        },
        content: 'Keep up the good work!'
      }
    ]
  },
  {
    id: '3',
    user: {
      id: '1',
      name: 'John Doe',
      age: 25,
      avatar: 'avatar.jpg'
    },
    publishTime: new Date(),
    title: 'My Workout Log',
    description: 'This is my workout log for today',
    duration: '1 hour',
    reps: 10,
    workout: {
      id: '1',
      exercises: [
        {
          id: '1',
          name: 'Bench Press',
          img: 'bench_press.jpg',
          sets: [
            {
              id: '1',
              reps: 10,
              description: 'Set 1',
              weight: 100
            },
            {
              id: '2',
              reps: 8,
              description: 'Set 2',
              weight: 120
            }
          ]
        },
        {
          id: '2',
          name: 'Squats',
          img: 'squats.jpg',
          sets: [
            {
              id: '1',
              reps: 12,
              description: 'Set 1',
              weight: 80
            },
            {
              id: '2',
              reps: 10,
              description: 'Set 2',
              weight: 100
            }
          ]
        }
      ]
    },
    likes: 5,
    comments: [
      {
        id: '1',
        user: {
          id: '2',
          name: 'Jane Smith',
          age: 30,
          avatar: 'avatar.jpg'
        },
        content: 'Great workout!'
      },
      {
        id: '2',
        user: {
          id: '3',
          name: 'David Johnson',
          age: 28,
          avatar: 'avatar.jpg'
        },
        content: 'Keep up the good work!'
      }
    ]
  }
  // Додайте інші об'єкти ILog за необхідністю
]

</script>
