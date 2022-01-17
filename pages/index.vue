<template>
  <main>
    <BaseHeader />
    <Warning v-if="!isDefaultChainId" />
    <Balance />
    <BaseForm />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseHeader from '~/components/BaseHeader/index.vue'
import Warning from '~/components/Warning/index.vue'
import Balance from '~/components/Balance/index.vue'
import BaseForm from '~/components/BaseForm/index.vue'
import { Web3Module } from '~/store/modules/web3'

@Component({
  components: {
    BaseHeader,
    Warning,
    Balance,
    BaseForm
  }
})
export default class Index extends Vue {
  get isDefaultChainId (): boolean {
    return Web3Module.isDefaultChainId
  }
}
</script>
<style lang="scss" scoped>
</style>
