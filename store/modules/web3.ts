import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { MutationTypes } from '~/@types/mutation-types'
import { ActionTypes } from '~/@types/action-types'

@Module({ namespaced: true, name: 'web3' })
class Web3 extends VuexModule {
  public userAddress: string = ''
  private isConnected: boolean = false

  @Mutation
  public [MutationTypes.WEB3_SET_IS_CONNECTED] (isConnected: boolean): void {
    this.isConnected = isConnected
  }

  @Mutation
  public [MutationTypes.WEB3_SET_USER_ADDRESS] (userAddress: string): void {
    this.userAddress = userAddress
  }

  @Action
  public [ActionTypes.WEB3_CONNECT_WALLET] (): void {
    this.context.commit(MutationTypes.WEB3_SET_IS_CONNECTED, true)
  }

  @Action
  public [ActionTypes.WEB3_DISCONNECT_WALLET] (): void {
    this.context.commit(MutationTypes.WEB3_SET_IS_CONNECTED, false)
  }
}

export default Web3
