<template>
      <div class="flex items-center font-normal text-lg">
      <IconTimer />

      <p class="text-[#1d83ea] ml-1 mr-2">Rest timer</p>

      <p>{{ isLastSetDone ? 'Exercise Done': formattedRestTime }}</p>
    </div>
</template>