<template>
  <div class="header-wrapper">
    <div class="container">
      <header class="header">
        <div class="header__logo">
          <img width="46" height="46" :src="getUrl(`logo_${theme}.svg`)" alt="logo" class="h-10">
        </div>
        <div class="header__menu">
          <select class="h-10 border border-slate-300 p-2 mx-2 rounded-xl selector" @change="onChange($event)">
            <option value="eng">
              {{ $t('header.languageSelector.eng') }}
            </option>
            <option value="ru">
              {{ $t('header.languageSelector.ru') }}
            </option>
          </select>
          <button class="h-10 border border-slate-300 rounded-xl p-2 mx-2 switcher">
            <div v-if="theme === 'light'" class="moon">
              <img :src="getUrl(`icon_${theme}_mode.svg`)" alt="switch theme">
            </div>
          </button>
          <button
            :class="isConnected ? 'disabled' : ''"
            class="h-10 border border-slate-300 px-5 mx-2 rounded-xl font-semibold connect"
            @click="connect"
          >
            <div v-if="isConnecting" class="loading">
              <img src="~/assets/img/icon_loading.svg" width="25" height="25" alt="Loading...">
              <span>Loading...</span>
            </div>
            <div v-else-if="isConnected">
              {{ GetShortString(userAddress) }}
            </div>
            <div v-else>
              {{ $t('header.connectWallet') }}
            </div>
          </button>
        </div>
      </header>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '~/store/modules/app'
import { Web3Module } from '~/store/modules/web3'
import GetShortString from '~/plugins/main'

@Component({
  mixins: [GetShortString]
})
export default class BaseHeader extends Vue {
  languageSelected = 'eng'
  isConnecting = false
  getUrl (img: string): string {
    const name = typeof img !== 'undefined' ? img : 'light'
    return require(`~/assets/img/${name}`)
  }

  onChange (e: Event): void {
    this.languageSelected = (e.target as HTMLSelectElement).value
  }

  get theme (): string {
    return AppModule.theme
  }

  get userAddress (): string {
    return Web3Module.userAddress
  }

  get isConnected (): boolean {
    return Web3Module.isConnected
  }

  private async connect (): Promise<void> {
    this.isConnecting = true
    try {
      await Web3Module.ConnectWallet()
    } catch (err) {
      console.log('connect error', err)
    }
    this.isConnecting = false
  }
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    border-bottom: 1px solid #E3E3E3;
  }
  .container {
    @include container;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding-top: 16px;
    padding-bottom: 16px;
    &__menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .selector {
    background-color: $button-background-light !important;
  }
  .switcher {
    background-color: $button-background-light !important;
  }
  .connect {
    background: #15DCE4 linear-gradient(253.94deg, #09F2C3 8%, #15DCE4 70%);
    transition: background-color 1000ms linear;
    width: 175px;
    &:hover {
      background: #15DCE4 100px;
    }
  }
  .connect.disabled {
    background: none;
    border: 1px solid #15DCE4;
    pointer-events: none;
  }
  .loading {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

</style>
