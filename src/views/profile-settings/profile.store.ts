export const useProfileStore = defineStore('profileStore', () => {
  const profile = ref<IProfileResponse | null>(null)

  async function getProfile (id: string) {
    const res = await profileService.getProfile(id)
    profile.value = res as IProfileResponse
  }

  function getCurrentPosition () {
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
    getCurrentPosition,
    profile
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
