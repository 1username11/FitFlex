export const useGymFriendsStore = defineStore('gymFriendsStore', () => {
  const profiles = ref<IProfile[]>([])
  const distance = ref(1000000)

  async function getPublicProfiles() {
    const { data, error } = await profileService.getPublicProfiles()
    if (error) {
      throw new Error(error.message)
    }
    profiles.value = data.filter((profile) => profile.id !== localStorage.getItem('userId')) as IProfile[]
  }

  return {
    getPublicProfiles,
    profiles,
    distance
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGymFriendsStore, import.meta.hot))
}
