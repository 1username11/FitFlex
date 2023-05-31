export const useProfileStore = defineStore('profileStore', () => {
  const profile = ref<any>()
  const currentUserId = ref<any>()
  async function getProfile(id) {
    profile.value = await profileService.getProfile(id)
  }
  async function getCurrentUser() {
    currentUserId.value = (await profileService.getCurrentUser()).data.user?.id
  }

  async function updateProfile(id, updates) {
    profile.value = await profileService.updateProfile(id, updates)
  }

  return {
    getProfile,
    getCurrentUser,
    updateProfile,
    profile,
    currentUserId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
