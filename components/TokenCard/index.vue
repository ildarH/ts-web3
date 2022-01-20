<template>
  <div class="tokenCard border border-blue-300 hover:border-blue-800 shadow rounded-md p-4 max-w-sm w-full mx-auto">
    <div class="tokenCard__header flex space-x-4">
      <token-image :token-address="address" :token-name="symbol" class="rounded-full bg-slate-300 h-10 w-10" />
      <div class="flex-1 space-y-6 py-1">
        <div class="rounded font-semibold">
          {{ symbol }}
        </div>
        <div class="space-y-0.5">
          <div class="grid grid-cols-3 gap-4">
            <div class="font-medium text-sm text-ellipsis">
              {{ balance.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TokenImage from '~/components/TokenImage/index.vue'
import { IBalance } from '~/@types/interfaces'
import { Web3Module } from '~/store/modules/web3'
import { TokensMap } from '~/utils/constants'

@Component({
  components: {
    TokenImage
  }
})
export default class TokenCard extends Vue {
  @Prop({ type: Object, default: () => {} }) readonly token!: IBalance

  get isMainnet (): boolean {
    return Web3Module.isMainnet
  }

  private address: string = this.isMainnet ? this.token.token.address : TokensMap[this.token.token.address]
  private symbol: string = this.token.token.symbol
  private balance: number = this.token.balance ? +parseFloat(this.token.balance).toFixed() : 0
}
</script>

<style scoped>

</style>
