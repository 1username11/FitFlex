<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ props.serial }}
    </div>

    <template v-for="(value, key) in setsColumns" :key="key">
      <div v-if="value" class="input-wrapper">
        <p>{{ props.set[key] }}</p>
      </div>
    </template>

    <button
      class="w-[30px] h-[30px] bg-white border border-gray-200 rounded-md flex justify-center items-center
      hover:bg-[#8CB6E5]"
      :class="{'bg-[#1D83EA]': setDone}"
      :disabled="setDone || !props.isWorokoutStarted"
      @click="done()"
    />
  </div>
</template>

<script lang="ts" setup>
const { setsColumnsConditions } = useHelpers()

const props = defineProps<{
  set: ISetRoutine
  serial: number
  isWorokoutStarted: boolean
  exerciseType: string
}>()
const setsColumns = setsColumnsConditions(props.exerciseType)

const emits = defineEmits(['deleteSet', 'setComplete', 'setUpdate'])
const setDone = ref<boolean>(false)

function done () {
  setDone.value = true
  emits('setComplete', props.set)
  console.log(props.set)
}
</script>

<style lang="scss">
.input-wrapper {
  .el-input {
    .el-input__wrapper {
      box-shadow: none;
      background-color: transparent;
    }
    .el-input__inner {
      text-align: center;
      height: fit-content;
    }
  }
}
</style>
