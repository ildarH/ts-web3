<template>
  <main>
    <BaseHeader />
    <Warning v-if="!isDefaultChainId" />
    <Balance
      v-if="isConnected && isDefaultChainId"
      :token="selectedCard"
    />
    <TokenSelect
      v-if="isConnected && isDefaultChainId"
      :is-tokens-loading="isTokensLoading"
      @onSelect="selectCard"
    />
    <BaseForm
      v-if="isConnected && isDefaultChainId"
      :token-address="tokenAddress"
    />
    <Transactions v-if="isConnected && isDefaultChainId" />
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import BaseHeader from '~/components/BaseHeader/index.vue'
import Warning from '~/components/Warning/index.vue'
import Balance from '~/components/Balance/index.vue'
import TokenSelect from '~/components/TokenSelect/index.vue'
import BaseForm from '~/components/BaseForm/index.vue'
import Transactions from '~/components/Transactions/index.vue'
import { Web3Module } from '~/store/modules/web3'
import { TokensModule } from '~/store/modules/tokens'
import { IBalance } from '~/@types/interfaces'

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
  isTokensLoading = false
  selectedCard: IBalance | null = null
  tokenAddress: string | null = null

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

  selectCard (index: any): void {
    this.selectedCard = TokensModule.tokens[index]
    this.tokenAddress = TokensModule.tokens[index].token.address
  }

  @Watch('isConnected')
  async connectionChanged (newVal: boolean): Promise<void> {
    if (newVal && this.isDefaultChainId) {
      this.isTokensLoading = true
      await TokensModule.TokensData()
      this.isTokensLoading = false
    }
  }

  @Watch('isDefaultChainId')
  async chainChanged (newVal: boolean): Promise<void> {
    if (newVal && this.isConnected) {
      this.isTokensLoading = true
      await TokensModule.TokensData()
      this.isTokensLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
