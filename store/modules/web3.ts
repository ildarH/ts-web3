import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { MutationTypes } from '~/@types/mutation-types'
import { IResponse, IWeb3State } from '~/@types/interfaces'
import { store } from '~/store'
import { initWallet, requestSwitchNetwork } from '~/utils/web3'

const IS_MAINNET: boolean = !!(process.env.IS_MAINNET)
const DEFAULT_CHAIN_ID: number = IS_MAINNET ? +(process.env.DEFAULT_CHAIN_ID_MAINNET || 0) : +(process.env.DEFAULT_CHAIN_ID_TESTNET || 0)

@Module({
  dynamic: true,
  namespaced: true,
  name: 'web3',
  store
})
class Web3 extends VuexModule implements IWeb3State {
  public userAddress: string = ''
  public isConnected: boolean = false
  public chainId: number = 0
  public isDefaultChainId = false

  @Mutation
  public [MutationTypes.WEB3_SET_IS_CONNECTED] (isConnected: boolean): void {
    this.isConnected = isConnected
  }

  @Mutation
  public [MutationTypes.WEB3_SET_USER_ADDRESS] (userAddress: string): void {
    this.userAddress = userAddress
  }

  @Mutation
  public [MutationTypes.WEB3_SET_CHAIN_ID] (chainId: number): void {
    this.chainId = chainId
  }

  @Mutation
  public [MutationTypes.WEB3_SET_IS_DEFAULT_CHAIN_ID] (isDefaultChainId: boolean): void {
    this.isDefaultChainId = isDefaultChainId
  }

  @Action
  public async ConnectWallet (): Promise<void> {
    const connectRequest: IResponse = await initWallet()
    if (connectRequest.ok) {
      this.context.commit(MutationTypes.WEB3_SET_USER_ADDRESS, connectRequest.result.userAddress)
      this.context.commit(MutationTypes.WEB3_SET_CHAIN_ID, connectRequest.result.chainId)
      this.context.commit(MutationTypes.WEB3_SET_IS_CONNECTED, true)
      this.context.commit(MutationTypes.WEB3_SET_IS_DEFAULT_CHAIN_ID, (connectRequest.result.chainId === DEFAULT_CHAIN_ID))
    } else {
      this.context.commit(MutationTypes.WEB3_SET_USER_ADDRESS, '')
      this.context.commit(MutationTypes.WEB3_SET_CHAIN_ID, 0)
      this.context.commit(MutationTypes.WEB3_SET_IS_CONNECTED, false)
      this.context.commit(MutationTypes.WEB3_SET_IS_DEFAULT_CHAIN_ID, false)
    }
  }

  @Action
  public checkChainId (): void {
    this.context.commit(MutationTypes.WEB3_SET_IS_DEFAULT_CHAIN_ID, (this.chainId === DEFAULT_CHAIN_ID))
  }

  @Action
  public DisconnectWallet (): void {
    this.context.commit(MutationTypes.WEB3_SET_USER_ADDRESS, '')
    this.context.commit(MutationTypes.WEB3_SET_CHAIN_ID, 0)
    this.context.commit(MutationTypes.WEB3_SET_IS_CONNECTED, false)
  }

  @Action
  public async SwitchNetwork (): Promise<void> {
    const defaultChainId: number = +(process.env.DEFAULT_CHAIN_ID || 4)
    const requestSwitch: IResponse = await requestSwitchNetwork(defaultChainId)
    if (requestSwitch.ok) {
      this.context.commit(MutationTypes.WEB3_SET_CHAIN_ID, defaultChainId)
    } else {
      this.DisconnectWallet()
    }
  }
}

export const Web3Module = getModule(Web3)
