export const useProfileStore = defineStore('profileStore', () => {
  const profile = ref<IProfileResponse>()
  async function getProfile(id) {
    profile.value = await profileService.getProfile(id)
  }

  async function updateProfile(id, updates) {
    profile.value = await profileService.updateProfile(id, updates)
  }

  function getCurrentPosition() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    })
  }

  return {
    getProfile,
    updateProfile,
    getCurrentPosition,
    profile
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
