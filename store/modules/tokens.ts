import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import BigNumber from 'bignumber.js'
import { Mutations } from '~/@types/mutations'
import { IBalance, IERC20TokenBalance, IResponse, IToken, ITokensState, ITransactions } from '~/@types/interfaces'
import { store } from '~/store'
import { Web3Module } from '~/store/modules/web3'
import { requestTokenBalances } from '~/utils/web3'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'tokens',
  store
})
class Tokens extends VuexModule implements ITokensState {
  public tokens: IBalance[] = []
  public transaction: ITransactions[] = []

  @Mutation
  public [Mutations.TOKENS_SET_TOKEN] (payload: IBalance[]): void {
    // this.tokens = [...this.tokens].map((token: IBalance) => token.token.address !== payload.token.address ? token : payload)
    this.tokens = [...payload]
  }

  @Action
  public async GetTokenData (): Promise<void> {
    const userAddress = Web3Module.userAddress
    const networkName = Web3Module.networkName.toString()
    const balancesRequest: IResponse = await requestTokenBalances(networkName, userAddress)
    console.log('balancesRequest: ', balancesRequest)
    if (balancesRequest.ok) {
      const { result } = balancesRequest
      // eslint-disable-next-line camelcase
      const tokens: IBalance[] = (result as IERC20TokenBalance[]).map(({ token_address, symbol, balance, decimals }) => {
        return {
          token: {
            // eslint-disable-next-line camelcase
            address: token_address,
            symbol,
            decimals
          },
          balance: new BigNumber(balance).shiftedBy(-decimals).toString()
        }
      })
      console.log('balances: ', tokens)
      this.context.commit(Mutations.TOKENS_SET_TOKEN, tokens)
    }
  }
}

export const TokensModule = getModule(Tokens)
