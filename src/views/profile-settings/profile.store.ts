export const useProfileStore = defineStore('profileStore', () => {
  const profile = ref<IProfileResponse>()
  async function getProfile(id) {
    profile.value = await profileService.getProfile(id)
  }

  async function updateProfile(id, updates) {
    profile.value = await profileService.updateProfile(id, updates)
  }

  return {
    getProfile,
    updateProfile,
    profile
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
