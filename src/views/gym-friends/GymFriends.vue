<template>
  <div class="w-full h-fit bg-white rounded-lg border border-gray-300 p-5">
    <div v-if="isProfileValidForGymFriends">
      <div>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-600">Welcome to GymFriends</h1>
          <el-select v-model="distance" class="m-2" placeholder="Select">
            <el-option
              v-for="distanceItem in distanceOptions"
              :key="distanceItem.value"
              :label="distanceItem.label"
              :value="distanceItem.value"
            />
          </el-select>
        </div>

        <div class="text-xl text-gray-500 mb-6">
          <p class="mt-4">
            Connect with like-minded sports enthusiasts and find your perfect workout buddy on our web service.
          </p>
          <p class="mt-4">
            Discover a community of friends who share your passion for fitness and enjoy engaging in various sports
          </p>
          <p class="mt-4">
            activities together.
          </p>
          <p class="mt-4">
            Join us today and embark on a journey to a healthier and more active lifestyle.
          </p>
        </div>
      </div>
      <div class="rounded-lg overflow-hidden border border-gray-300">
        <GoogleMap
          api-key="AIzaSyCbiNabGYz8by7q1cnbWStUL0QYLDZORtk"
          style="width: 100%; height: 500px" :center="center" :zoom="15"
        >
          <MarkerCluster>
            <Marker
              v-for="item in filteredAthlete"
              :key="item.id"
              :options="{ position: {
                lat: item.lat,
                lng: item.lng
              }}"
            >
              <InfoWindow>
                <el-card>
                  <div class="flex items-center space-x-5">
                    <div class="p-4 avatar-wrapper">
                      <el-image
                        class="w-[80px] h-[80px] rounded-full overflow-hidden"
                        :src="item.avatar_url"
                      >
                        <template #error>
                          <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
                        </template>
                      </el-image>
                    </div>
                    <div class="border-l border-l-100 pl-4">
                      <div>
                        <p class="text-xl font-semibold">{{ item.username }}</p>
                        <p class="text-lg font-medium text-gray-400">{{ item.additional_info }}</p>
                      </div>

                      <p class="text-lg font-semibold">Contacts</p>

                      <p
                        v-if="item.e_mail"
                        class="flex space-x-1 font-medium text-base cursor-pointer hover:underline mt-2"
                        @click="copyContact(item.e_mail)"
                      >
                        Email: {{ item.e_mail }}
                      </p>

                      <p
                        v-if="item.telegram_link"
                        class="flex space-x-1 font-medium text-base cursor-pointer hover:underline mt-2"
                        @click="openLink(item.telegram_link)"
                      >
                        Telegram: {{ item.telegram_link }}
                      </p>

                      <p
                        v-if="item.phone_number"
                        class="flex space-x-1 font-medium text-base cursor-pointer hover:underline mt-2"
                        @click="copyContact(item.phone_number)"
                      >
                        Phone: {{ item.phone_number }}
                      </p>

                      <p
                        v-if="item.other_contact_info"
                        class="flex space-x-1 font-medium text-base cursor-pointer hover:underline mt-2"
                        @click="copyContact(item.other_contact_info)"
                      >
                        Other contact information: {{ item.other_contact_info }}
                      </p>
                    </div>
                  </div>
                </el-card>
              </InfoWindow>
            </Marker>
          </MarkerCluster>
        </GoogleMap>
      </div>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold text-gray-600">Welcome to GymFriends</h1>

      <div class="text-xl text-gray-500 mb-6">
        <p class="mt-4">
          To use GymFriends, you need to make your profile public and specify your contacts,
        </p>
        <p class="mt-4">
          to do this, go to the profile settings by clicking on the upper right corner
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { GoogleMap, Marker, MarkerCluster, InfoWindow } from 'vue3-google-map'

const gymFriendsStore = useGymFriendsStore()
const { getPublicProfiles } = gymFriendsStore
const { profiles, distance } = storeToRefs(gymFriendsStore)

const { profile } = storeToRefs(useProfileStore())
const myLocation = ref({
  lat: profile.value?.data.lat,
  lng: profile.value?.data.lng
})
console.log(profile)

const isProfileValidForGymFriends = computed(() => {
  return profile.value?.data.is_public &&
  (profile.value.data.telegram_link || profile.value.data.phone_number ||
  profile.value.data.e_mail || profile.value.data.other_contact_info)
})

const distanceOptions = [
  {
    label: '1 km',
    value: 1
  },
  {
    label: '5 km',
    value: 5
  },
  {
    label: '10 km',
    value: 10
  },
  {
    label: '20 km',
    value: 20
  },
  {
    label: '50 km',
    value: 50
  },
  {
    label: '100 km',
    value: 100
  },
  {
    label: '200 km',
    value: 200
  },
  {
    label: 'All',
    value: 1000000
  }
]

function openLink (link: string) {
  window.open(link, '_blank')
}

function copyContact (contact: string) {
  navigator.clipboard.writeText(contact).then(() => {
    ElNotification({
      title: 'Copied',
      message: 'Contact copied to clipboard',
      type: 'success'
    })
  })
}

const center = ref({
  lat: 0,
  lng: 0
})
function calculateDistance (lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371

  const lat1Rad = degToRad(lat1)
  const lon1Rad = degToRad(lon1)
  const lat2Rad = degToRad(lat2)
  const lon2Rad = degToRad(lon2)

  const dLat = lat2Rad - lat1Rad
  const dLon = lon2Rad - lon1Rad

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c

  return distance
}

function degToRad (deg: number) {
  return deg * (Math.PI / 180)
}

const filteredAthlete = computed(() => {
  return profiles.value.filter((profile) => {
    const distanceBetween =
    calculateDistance(
      profile.lat as number,
      profile.lng as number,
      myLocation.value.lat as number,
      myLocation.value.lng as number)
    return distanceBetween <= distance.value
  })
})

onMounted(async () => {
  await getPublicProfiles()
  center.value = {
    lat: myLocation.value.lat || 0,
    lng: myLocation.value.lng || 0
  }
})

</script>

<style lang="scss">
.avatar-wrapper {
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}
</style>
