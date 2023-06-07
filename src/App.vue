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
</script>
