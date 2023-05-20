<template>
  <div class="bg-gray-50 max-h-max min-h-full">
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
