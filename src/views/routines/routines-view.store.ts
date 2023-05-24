export const useRoutinesStore = defineStore('routinesStore', () => {
  const sets = ref<ISet[]>([
    {
      id: '1',
      reps: 10,
      description: 'Set 1 description'
    },
    {
      id: '2',
      type: 'Type A',
      reps: 8,
      description: 'Set 2 description',
      weight: 50
    },
    {
      id: '3',
      reps: 12,
      description: 'Set 3 description',
      weight: 40
    }
  ])

  const exercises = ref<IExercise[]>([
    {
      id: '1',
      name: 'Exercise 1',
      img: 'exercise1.jpg',
      equipment: 'Other',
      sets: [sets.value[0], sets.value[1], sets.value[2]]
    },
    {
      id: '2',
      name: 'Exercise 2',
      restTime: '60 seconds',
      description: 'Exercise 2 description',
      primary: 'Primary muscle group',
      img: 'exercise2.jpg',
      sets: [sets.value[0], sets.value[1], sets.value[2]],
      equipment: 'Dumbbells'
    },
    {
      id: '3',
      name: 'Exercise 3',
      img: 'exercise3.jpg',
      equipment: 'Barbell',
      sets: [sets.value[0], sets.value[1], sets.value[2]]
    }
  ])

  const users = ref<IUser[]>([
    {
      id: '1',
      name: 'John',
      age: 25,
      avatar: 'john.jpg',
    },
    {
      id: '2',
      name: 'Emily',
      age: 30,
      avatar: 'emily.jpg',
    },
    {
      id: '3',
      name: 'Mike',
      age: 28,
      avatar: 'mike.jpg',
    }
  ])

  const routines = ref<IRoutine[]>([
    {
      id: '1',
      name: 'Routine 1',
      exercises: [exercises.value[0], exercises.value[1], exercises.value[2]],
      user: users.value[0]
    },
    {
      id: '2',
      name: 'Routine 2',
      exercises: [exercises.value[1], exercises.value[2], exercises.value[0]],
      user: users.value[1]
    },
    {
      id: '3',
      name: 'Routine 3',
      exercises: [exercises.value[2], exercises.value[0], exercises.value[1]],
      user: users.value[2]
    }
  ])

  const comments = ref<IComment[]>([
    {
      id: '1',
      user: users.value[0],
      content: 'Comment 1'
    },
    {
      id: '2',
      user: users.value[1],
      content: 'Comment 2'
    },
    {
      id: '3',
      user: users.value[2],
      content: 'Comment 3'
    }
  ])

  const logs = ref<ILog[]>([
    {
      id: '1',
      user: users.value[0],
      publishTime: new Date(),
      title: 'Log 1',
      description: 'Log 1 description',
      duration: '30 minutes',
      reps: 10,
      workout: routines.value[0],
      likes: 5,
      comments: [comments.value[0], comments.value[1]]
    },
    {
      id: '2',
      user: users.value[1],
      publishTime: new Date(),
      title: 'Log 2',
      description: 'Log 2 description',
      duration: '45 minutes',
      reps: 8,
      workout: routines.value[1],
      likes: 3,
      comments: [comments.value[1], comments.value[2]]
    },
    {
      id: '3',
      user: users.value[2],
      publishTime: new Date(),
      title: 'Log 3',
      description: 'Log 3 description',
      duration: '60 minutes',
      reps: 12,
      workout: routines.value[2],
      likes: 7,
      comments: [comments.value[0], comments.value[2]]
    }
  ])

  return {
    routines,
    exercises
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutinesStore, import.meta.hot))
}
