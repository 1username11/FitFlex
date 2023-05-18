<template>
  <div ref="exampleElementRef">
    <div>
      <label>Compute Example</label>
      <Compute
        #default="{ lastLevel }"
        :lastLevel="computeExample.firstLevel.secondLevel.thirdLevel"
      >
        <p>{{ lastLevel }}</p>
        <p>{{ lastLevel }} with additional string</p>
      </Compute>
    </div>

    <hr class="my-4">

    <div>
      <label>Translation example</label>
      <p>{{ t('exampleView.exampleViewKey') }}</p>

      <ElSelect ref="elementSelectRef" v-model="locale">
        <!--todo: create your own locales config, for example with full label, icon, etc...-->
        <el-option
          v-for="lang in availableLocales"
          :key="lang"
          :label="lang"
          :value="lang"
        />
      </ElSelect>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElSelect } from 'element-plus'

const { availableLocales, locale, t } = useI18n()

const exampleElementRef = ref()
const elementSelectRef = ref<InstanceType<typeof ElSelect>>()

const computeExample = {
  firstLevel: {
    secondLevel: {
      thirdLevel: 'I\'m the last level'
    }
  }
}
</script>
