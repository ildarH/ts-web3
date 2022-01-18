<template>
  <main>
    <BaseHeader />
    <Warning v-if="!isDefaultChainId" />
    <Balance v-if="isConnected && isDefaultChainId" />
    <TokenSelect v-if="isConnected && isDefaultChainId" />
    <BaseForm v-if="isConnected && isDefaultChainId" />
    <Transactions v-if="isConnected && isDefaultChainId" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BaseHeader from '~/components/BaseHeader/index.vue'
import Warning from '~/components/Warning/index.vue'
import Balance from '~/components/Balance/index.vue'
import TokenSelect from '~/components/TokenSelect/index.vue'
import BaseForm from '~/components/BaseForm/index.vue'
import Transactions from '~/components/Transactions/index.vue'
import { Web3Module } from '~/store/modules/web3'

const { ethereum } : { ethereum: any} = window

@Component({
  components: {
    BaseHeader,
    Warning,
    Balance,
    TokenSelect,
    BaseForm,
    Transactions
  }
})
export default class Index extends Vue {
  get isConnected (): boolean {
    return Web3Module.isConnected
  }

  get isDefaultChainId (): boolean {
    return Web3Module.isDefaultChainId
  }

  created (): void {
    ethereum.removeListener('chainChanged', this.handleChainChanged)
    ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
    ethereum.removeListener('disconnect', this.handleDisconnected)
    ethereum.removeListener('connect', this.handleConnected)
    ethereum.on('chainChanged', this.handleChainChanged)
    ethereum.on('accountsChanged', this.handleAccountsChanged)
    ethereum.on('disconnect', this.handleDisconnected)
    ethereum.on('connect', this.handleConnected)
  }

  beforeDestroy (): void {
    ethereum.removeListener('chainChanged', this.handleChainChanged)
    ethereum.removeListener('accountsChanged', this.handleAccountsChanged)
    ethereum.removeListener('disconnect', this.handleDisconnected)
    ethereum.removeListener('connect', this.handleConnected)
  }

  handleChainChanged (): void {
    Web3Module.CheckChainId()
  }

  handleAccountsChanged (): void {
    Web3Module.ConnectWallet()
  }

  handleDisconnected (): void {
    Web3Module.DisconnectWallet()
  }

  handleConnected (): void {
    Web3Module.CheckChainId()
  }
}
</script>
<style lang="scss" scoped>
</style>
