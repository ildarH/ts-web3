<template>
  <div class="warning-wrapper my-8">
    <div class="container">
      <div
        class="warning flex w-full h-28 bg-red-100 rounded-xl px-8 justify-between items-center"
      >
        <div class="text-red-500 font-semibold warning__title">
          <span class="flex flex-nowrap">
            <img class="mr-1" :src="GetImgUrl(`icon_warning_${theme}.svg`)" alt="Warning"> {{ $t('warning.title') }}
          </span>
        </div>
        <div class="warning__button">
          <button class="border-2 font-semibold border-red-500 hover:border-red-800 rounded-xl p-2 button" @click="switchNetwork" :disabled="!isConnected && !isDefaultChainId">
            {{ $t('warning.button') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetImgUrl from '~/plugins/main'
import { AppModule } from '~/store/modules/app'
import { Web3Module } from '~/store/modules/web3'

@Component({
  mixins: [GetImgUrl]
})
export default class Warning extends Vue {
  getUrl (img: string): string {
    const name = typeof img !== 'undefined' ? img : 'light'
    return require(`~/assets/img/${name}`)
  }

  get theme (): string {
    return AppModule.theme
  }

  get isConnected (): boolean {
    return Web3Module.isConnected
  }

  get isDefaultChainId (): boolean {
    return Web3Module.isDefaultChainId
  }

  private async switchNetwork (): Promise<void> {
    try {
      await Web3Module.SwitchNetwork()
    } catch (err) {
      console.log('Switch error: ', err)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  @include container;
}
</style>
