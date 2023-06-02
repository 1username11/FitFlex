<template>
  <ElConfigProvider
    :locale="{
      name: locale,
      el: messages[locale]?.el as TranslatePair
    }"
  >
    <router-view />
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import type { TranslatePair } from 'element-plus/lib/locale'
import { supabase } from './supabase'
import { routeNames } from './router/route-names';

const { messages, locale } = useI18n()

const router = useRouter()
onMounted(() => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      console.log('SIGNED_IN')
      router.push({ name: routeNames.home })
    } else if (event === 'SIGNED_OUT') {
      console.log('SIGNED_OUT')
      router.push({ name: routeNames.login })
    }
  })
})
</script>
