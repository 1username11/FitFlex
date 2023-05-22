export const useRoutinesStore = defineStore('routinesStore', () => {
  const feedList = ref([
    {
      id: 'log1',
      user: {
        id: 'user1',
        name: 'John',
        age: 25,
        avatar: 'avatar1.jpg'
      },
      publishTime: new Date(),
      title: 'My First Workout',
      description: 'Completed my first workout today. Feeling great!',
      duration: '1 hour',
      reps: 10,
      workout: {
        id: 'workout1',
        name: 'Full Body Workout',
        exercises: [
          {
            id: 'exercise1',
            name: 'Push-ups',
            img: 'pushups.jpg',
            sets: [
              {
                id: 'set1',
                reps: 10,
                description: 'Standard push-ups',
                weight: 0
              },
              {
                id: 'set2',
                reps: 8,
                description: 'Diamond push-ups',
                weight: 0
              }
            ]
          },
          {
            id: 'exercise2',
            name: 'Squats',
            img: 'squats.jpg',
            sets: [
              {
                id: 'set3',
                reps: 12,
                description: 'Bodyweight squats',
                weight: 0
              }
            ]
          }
        ],
        user: {
          id: 'user1',
          name: 'John',
          age: 25,
          avatar: 'avatar1.jpg'
        }
      },
      likes: 5,
      comments: [
        {
          id: 'comment1',
          user: {
            id: 'user2',
            name: 'Alice',
            age: 30,
            avatar: 'avatar2.jpg'
          },
          content: 'Great job, John! Keep it up!'
        },
        {
          id: 'comment2',
          user: {
            id: 'user3',
            name: 'Bob',
            age: 28,
            avatar: 'avatar3.jpg'
          },
          content: 'Impressive progress!'
        }
      ]
    },
    {
      id: 'log2',
      user: {
        id: 'user1',
        name: 'John',
        age: 25,
        avatar: 'avatar1.jpg'
      },
      publishTime: new Date(),
      title: 'My First Workout',
      description: 'Completed my first workout today. Feeling great!',
      duration: '1 hour',
      reps: 10,
      workout: {
        id: 'workout1',
        name: 'Full Body Workout',
        exercises: [
          {
            id: 'exercise1',
            name: 'Push-ups',
            img: 'pushups.jpg',
            sets: [
              {
                id: 'set1',
                reps: 10,
                description: 'Standard push-ups',
                weight: 0
              },
              {
                id: 'set2',
                reps: 8,
                description: 'Diamond push-ups',
                weight: 0
              }
            ]
          },
          {
            id: 'exercise2',
            name: 'Squats',
            img: 'squats.jpg',
            sets: [
              {
                id: 'set3',
                reps: 12,
                description: 'Bodyweight squats',
                weight: 0
              }
            ]
          }
        ],
        user: {
          id: 'user1',
          name: 'John',
          age: 25,
          avatar: 'avatar1.jpg'
        }
      },
      likes: 5,
      comments: [
        {
          id: 'comment1',
          user: {
            id: 'user2',
            name: 'Alice',
            age: 30,
            avatar: 'avatar2.jpg'
          },
          content: 'Great job, John! Keep it up!'
        },
        {
          id: 'comment2',
          user: {
            id: 'user3',
            name: 'Bob',
            age: 28,
            avatar: 'avatar3.jpg'
          },
          content: 'Impressive progress!'
        }
      ]
    }
  ])
  const sets: ISet[] = [
    {
      id: 'set1',
      reps: 10,
      description: 'Standard set',
      weight: 50
    },
    {
      id: 'set2',
      reps: 8,
      description: 'Heavy set',
      weight: 80
    },
    {
      id: 'set3',
      reps: 12,
      description: 'Light set'
    }
  ]

  const exercises = ref< IExercise[]  >([
    {
      id: 'exercise1',
      name: 'Bench Press',
      img: 'bench_press.jpg',
      sets: [sets[0], sets[1]]
    },
    {
      id: 'exercise2',
      name: 'Squats',
      img: 'squats.jpg',
      sets: [sets[2]]
    }
  ])

  const user: IUser = {
    id: 'user1',
    name: 'John',
    age: 25,
    avatar: 'avatar1.jpg'
  }

  const workouts = ref<IWorkout[]>([{
    id: 'workout1',
    name: 'Chest and Legs Workout',
    exercises,
    user
  }])

  return {
    workouts,
    exercises
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutinesStore, import.meta.hot))
}
