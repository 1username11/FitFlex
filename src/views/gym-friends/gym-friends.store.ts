export const useGymFriendsStore = defineStore('gymFriendsStore', () => {
  const profiles = ref<IProfile[]>([])
  const myLocation = ref()
  const distance = ref<number>( 1000000)

  async function getPublicProfiles() {
    const { data, error } = await profileService.getPublicProfiles()
    if (error) {
      throw new Error(error.message)
    }
    myLocation.value = data.find((profile) => profile.id === localStorage.getItem('userId'))
    profiles.value = data.filter((profile) => profile.id !== localStorage.getItem('userId'))
  }

  return {
    getPublicProfiles,
    profiles,
    myLocation,
    distance
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGymFriendsStore, import.meta.hot))
}
