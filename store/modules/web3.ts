import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Mutations } from '~/@types/mutations'
import { IResponse, IWeb3State } from '~/@types/interfaces'
import { store } from '~/store'
import { initWallet, requestCheckChainId, requestSwitchNetwork } from '~/utils/web3'
import { NetworkName } from '~/utils/constants'

const IS_MAINNET: boolean = !!(process.env.IS_MAINNET)
const DEFAULT_CHAIN_ID: number = IS_MAINNET ? +(process.env.DEFAULT_CHAIN_ID_MAINNET || 0) : +(process.env.DEFAULT_CHAIN_ID_TESTNET || 0)

@Module({
  dynamic: true,
  namespaced: true,
  name: 'web3',
  store
})
class Web3 extends VuexModule implements IWeb3State {
  public isMainnet: boolean = false
  public userAddress: string = ''
  public isConnected: boolean = false
  public chainId: number = 0
  public isDefaultChainId = false
  public networkName: NetworkName | string = ''

  @Mutation
  public [Mutations.WEB3_SET_IS_CONNECTED] (isConnected: boolean): void {
    this.isConnected = isConnected
  }

  @Mutation
  public [Mutations.WEB3_SET_USER_ADDRESS] (userAddress: string): void {
    this.userAddress = userAddress
  }

  @Mutation
  public [Mutations.WEB3_SET_CHAIN_ID] (chainId: number): void {
    this.chainId = chainId
  }

  @Mutation
  public [Mutations.WEB3_SET_IS_DEFAULT_CHAIN_ID] (isDefaultChainId: boolean): void {
    this.isDefaultChainId = isDefaultChainId
  }

  @Mutation
  public [Mutations.WEB3_SET_NETWORK_NAME] (chainId: number): void {
    this.networkName = NetworkName[chainId] || 'none'
  }

  @Mutation
  public [Mutations.WEB3_SET_IS_MAINNET] (isMainnet: boolean): void {
    this.isMainnet = isMainnet
  }

  @Action
  public async ConnectWallet (): Promise<void> {
    const connectRequest: IResponse = await initWallet()
    if (connectRequest.ok) {
      this.context.commit(Mutations.WEB3_SET_USER_ADDRESS, connectRequest.result.userAddress)
      this.context.commit(Mutations.WEB3_SET_CHAIN_ID, connectRequest.result.chainId)
      this.context.commit(Mutations.WEB3_SET_IS_CONNECTED, true)
      this.context.commit(Mutations.WEB3_SET_IS_DEFAULT_CHAIN_ID, (connectRequest.result.chainId === DEFAULT_CHAIN_ID))
      this.context.commit(Mutations.WEB3_SET_NETWORK_NAME, connectRequest.result.chainId)
      this.context.commit(Mutations.WEB3_SET_IS_MAINNET, IS_MAINNET)
    } else {
      await this.context.dispatch('DisconnectWallet')
    }
  }

  @Action
  public async CheckChainId (): Promise<void> {
    const isDefaultChainId = await requestCheckChainId()
    this.context.commit(Mutations.WEB3_SET_IS_DEFAULT_CHAIN_ID, (isDefaultChainId.ok))
  }

  @Action
  public DisconnectWallet (): void {
    this.context.commit(Mutations.WEB3_SET_USER_ADDRESS, '')
    this.context.commit(Mutations.WEB3_SET_CHAIN_ID, 0)
    this.context.commit(Mutations.WEB3_SET_IS_CONNECTED, false)
    this.context.commit(Mutations.WEB3_SET_IS_DEFAULT_CHAIN_ID, false)
    this.context.commit(Mutations.WEB3_SET_NETWORK_NAME, '')
    this.context.commit(Mutations.WEB3_SET_IS_MAINNET, false)
  }

  @Action
  public async SwitchNetwork (): Promise<void> {
    const defaultChainId: number = +(process.env.DEFAULT_CHAIN_ID || 4)
    console.log('requestSwitch defaultChainId: ', defaultChainId)
    const requestSwitch: IResponse = await requestSwitchNetwork(defaultChainId)
    if (requestSwitch.ok) {
      console.log('requestSwitch.ok')
      await this.context.dispatch('ConnectWallet')
    } else {
      this.DisconnectWallet()
    }
  }
}

export const Web3Module = getModule(Web3)
