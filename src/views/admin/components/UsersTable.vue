<template>
  <div>
    <el-input v-model="search" placeholder="Type to search" />

    <el-table
      v-loading="loading"
      :data="filterTableData"
      style="height: auto"
    >
      <el-table-column
        fixed
        label="Avatar URL"
        prop="avatar_url"
        min-width="100"
        max-width="200"
      >
        <template #header>
          Avatar URL
        </template>

        <template #default="scope">
          <el-image :src="scope.row.avatar_url" />
        </template>
      </el-table-column>

      <el-table-column label="Username" prop="username" />
      <el-table-column label="Full Name" prop="full_name" />
      <el-table-column label="Role" prop="role" />
      <el-table-column label="Bio" prop="bio" />
      <el-table-column label="Is Banned" prop="is_banned" />
      <el-table-column label="Telegram" prop="telegram_link" />
      <el-table-column label="Email" prop="e_mail" />
      <el-table-column label="Other contacts" prop="other_contact_info" />
      <el-table-column label="Addition Info" prop="additionalInfo" />

      <el-table-column fixed="right" min-wight="200">
        <template #default="scope">
          <div class="flex flex-col space-y-3">
            <el-button
              :size="$elComponentSize.small"
              @click="handleBan(scope.row)"
            >
              Ban
            </el-button>

            <div class="button-wrapper">
              <el-button
                :size="$elComponentSize.small"
                :type="$elComponentType.primary" class="ml-0"
                @click="handleAdmin(scope.row)"
              >
                Make admin
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
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
.button-wrapper{
  .el-button--small{
    width: 100%;
  }
}
</style>
