<template>
  <div v-if="currentPage == 'account'">
    <svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" tint="black" type="profile-large" style="margin-right: 8px;"><g fill="black" fill-rule="evenodd" stroke="black" stroke-width="1.5"><path d="M15 16.75c2.234 0 4.26.888 5.746 2.33a8.227 8.227 0 012.444 4.916h0l-16.405.242a8.224 8.224 0 012.381-5.072A8.224 8.224 0 0115 16.75z" /><circle cx="15" cy="10" r="4" /></g></svg>
  </div>

  <div v-else-if="currentPage =='profile'">
    <svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" tint="#1D83EA" type="profile-large" style="margin-right: 8px;" light="#1D83EA" dark="#1D83EA"><g fill="none" fill-rule="evenodd" stroke="#1D83EA" stroke-width="1.5"><path d="M15 16.75c2.234 0 4.26.888 5.746 2.33a8.227 8.227 0 012.444 4.916h0l-16.405.242a8.224 8.224 0 012.381-5.072A8.224 8.224 0 0115 16.75z" /><circle cx="15" cy="10" r="4" /></g></svg>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  currentPage: 'profile' | 'account'
}>()
</script>
