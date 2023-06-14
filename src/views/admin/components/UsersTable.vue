<template>
  <el-input v-model="search" placeholder="Type to search" />

  <el-table :data="filterTableData" style="width: 100%" height="fit">
    <el-table-column label="Avatar URL" prop="avatar_url" wigth="200">
      <template #default="scope">
        <el-image :src="scope.row.avatar_url" />
      </template>
    </el-table-column>
    <el-table-column label="Id" prop="id" />
    <el-table-column label="Username" prop="username" wigth="200" />
    <el-table-column label="Full Name" prop="full_name" wigth="200" />
    <el-table-column label="Role" prop="role" wigth="200" />
    <el-table-column label="Bio" prop="bio" wigth="200" />
    <el-table-column label="Is Banned" prop="is_banned" wigth="200" />
    <el-table-column fixed="right" wight="300">
      <template #default="scope">
        <div class="flex flex-col space-y-3">
          <el-button :size="$elComponentSize.small" @click="handleBan(scope.row)">
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
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import { computed, ref } from 'vue'

const search = ref('')
const requestedUsers = ref([] as IProfile[])

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

const handleBan = async (row) => {
  console.log('row', row)

  const { data, error } = await supabase.from('profiles').update({ is_banned: !row.is_banned }).eq('id', row.id)
  console.log('data', data)
  console.log('error', error)
}
const handleAdmin = async (row) => {
  const { data, error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', row.id)
  console.log('data', data)
  console.log('error', error)
}

onMounted(async () => {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  requestedUsers.value = data as IProfile[]
  console.log('requestedUsers', requestedUsers.value)
})
</script>

<style lang="scss">
.button-wrapper{
  .el-button--small{
    width: 100%;
  }
}
</style>
