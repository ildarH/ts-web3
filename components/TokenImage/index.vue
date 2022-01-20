<template>
  <div class="token">
    <div
      v-if="tokenAddress"
      class="token__image"
    >
      <img
        :src="trustWalletLink"
        class="rounded-full w-10 h-10"
        :alt="tokenName"
        :width="size === 'small' ? 32 : 50"
        :height="size === 'small' ? 32 : 50"
        @error="handleError()"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Web3 from 'web3'

@Component
export default class TokenImage extends Vue {
 @Prop({ type: String, default: '' }) readonly tokenName!: string
 @Prop({ type: String, default: '' }) readonly tokenAddress!: string
 @Prop({ type: Boolean, default: true }) readonly empty!: boolean
 @Prop({ type: String, default: 'small' }) readonly size!: string

 baseLink = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains'
 link = ''
 isErrorExist = false

 get trustWalletLink (): string {
   const networkType = 'ethereum'
   const isValidAddress = Web3.utils.isAddress(this.tokenAddress)
   const convertedAddress = isValidAddress ? Web3.utils.toChecksumAddress(this.tokenAddress) : ''
   return this.isErrorExist
     ? require('@/assets/img/currency/empty-token.png')
     : `${this.baseLink}/${networkType}/assets/${convertedAddress}/logo.png`
 }

 handleError (): void {
   this.isErrorExist = true
 }
}
</script>

<style lang="scss" scoped>
.token {
  display: flex;
  align-items: center;
  &__image {
    overflow: hidden;
  }
}
.image {

  &_small {
    width: 30px;
    height: 30px;
    min-width: 30px;
  }
  &_large {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
  &_rounded {
    border-radius: 50%;
    background-clip: content-box;
    overflow: hidden;
    padding: 1px;
  }
}
.loading {
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon_block {
  font-size: 24px;
  &::before {
    color: red;
  }
}

</style>
