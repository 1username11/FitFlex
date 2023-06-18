export function useHelpers () {
  function generateGUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  function setsColumnsConditions (exerciseType: string) {
    return {
      kg: ['weight reps', 'weight distance', 'weighted bodyweight'].includes(exerciseType),
      reps: ['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only'].includes(exerciseType),
      duration: ['duration', 'distance duration'].includes(exerciseType)
    }
  }

  return {
    generateGUID,
    setsColumnsConditions
  }
}
