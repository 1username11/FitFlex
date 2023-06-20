<template>
  <div>
    <el-input v-model="search" placeholder="Type to search" />

    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <div class="flex flex-col-reverse lg:flex-row lg:justify-between p-3">
            <div class="flex space-x-4">
              <div class="hidden home-avatar-wrapper sm:flex items-center">
                <el-image
                  :src="props.row.avatar_url"
                  class="w-[100px] h-[100px] rounded-full overflow-hidden mr-4"
                >
                  <template #error>
                    <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
                  </template>
                </el-image>
              </div>

              <div>
                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Username:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.username }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Full Name:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.full_name }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Role:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.role }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Bio:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.bio || 'No Data' }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Is Banned:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.is_banned ? 'Banned' : 'Not yet' }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Telegram:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.telegram_link || 'No Data' }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Email:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.e_mail || 'No Data' }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Other Contact:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.other_contact_info || 'No Data' }}</p>
                </div>

                <div class="flex space-x-2">
                  <p class="font-semibold text-gray-600">Additional Info:</p>
                  <p class="underline font-medium text-gray-600">{{ props.row.additional_info || 'No Data' }}</p>
                </div>
              </div>
            </div>

            <div
              class="flex space-x-3 mb-3
             lg:space-x-0 lg:mb-0 lg:flex-col lg:justify-center lg:items-end lg:space-y-3"
            >
              <div class="button-wrapper">
                <el-button
                  :size="$elComponentSize.small"
                  @click="handleBan(props.row)"
                >
                  Ban
                </el-button>
              </div>

              <div class="button-wrapper">
                <el-button
                  :size="$elComponentSize.small"
                  :type="$elComponentType.primary" class="ml-0"
                  @click="handleAdmin(props.row)"
                >
                  Make admin
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" />
      <el-table-column label="Full Name" prop="full_name" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'

const search = ref('')
const requestedUsers = ref([] as IProfile[])
const loading = ref(false)

const filterTableData = computed(() => {
  return requestedUsers.value.filter(user => {
    const { id, username, full_name: fullName } = user

    if (id && id.toLowerCase().includes(search.value.toLowerCase())) {
      return true
    }

    if (username && username.toLowerCase().includes(search.value.toLowerCase())) {
      return true
    }

    if (fullName && fullName.toLowerCase().includes(search.value.toLowerCase())) {
      return true
    }

    return false
  })
})

const handleBan = async (row: IProfile) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_banned: !row.is_banned })
      .eq('id', row.id)

    if (error) throw error

    ElNotification({
      title: 'Success',
      message: row.is_banned ? `User ${row.id} is unbanned now` : `User ${row.id} is banned now`,
      type: 'success'
    })

    await fetchProfiles()
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  }
}
const handleAdmin = async (row: IProfile) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', row.id)

    if (error) throw error

    ElNotification({
      title: 'Success',
      message: row.role === 'admin' ? `User ${row.id} is not admin now` : `User ${row.id} is admin now`,
      type: 'success'
    })

    await fetchProfiles()
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  }
}

async function fetchProfiles () {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  requestedUsers.value = data as IProfile[]
}

onMounted(async () => {
  try {
    loading.value = true
    await fetchProfiles()
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss">
.button-wrapper .el-button--small{
  width: 120px !important;
}
.home-avatar-wrapper{
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}

</style>
