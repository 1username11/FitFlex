<template>
  <div class="bg-gray-50">
    <ElConfigProvider
      :locale="{
        name: locale,
        el: messages[locale]?.el as TranslatePair
      }"
    >
      <router-view />
    </ElConfigProvider>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatePair } from 'element-plus/lib/locale'

const { messages, locale } = useI18n()
</script>
