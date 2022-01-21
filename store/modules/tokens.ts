import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import BigNumber from 'bignumber.js'
import { Mutations } from '~/@types/mutations'
import { IBalance, IERC20TokenBalance, IResponse, ITokensState, ITransactions } from '~/@types/interfaces'
import { store } from '~/store'
import { Web3Module } from '~/store/modules/web3'
import { requestTokenAllowance, requestTokenBalances, requestApprove, requestTransfer } from '~/utils/web3'

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
    this.tokens = payload
  }

  @Action
  public async TokensData (): Promise<void> {
    const userAddress = Web3Module.userAddress
    const networkName = (Web3Module.networkName).toString()
    const balancesRequest: IResponse = await requestTokenBalances(networkName, userAddress)
    if (balancesRequest.ok) {
      const { result } = balancesRequest
      // eslint-disable-next-line camelcase
      const tokensResult: IBalance[] = (result as IERC20TokenBalance[]).map(({ token_address, symbol, balance, decimals }) => {
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
      this.context.commit(Mutations.TOKENS_SET_TOKEN, tokensResult)
    }
  }

  @Action
  public async Allowance ({
    recipientAddress,
    tokenAddress
  }: {
    recipientAddress: string,
    tokenAddress: string
  }): Promise<string> {
    const userAddress = Web3Module.userAddress
    const storedTokens: IBalance[] = TokensModule.tokens || []
    const networkName = Web3Module.networkName.toString()
    const decimals = storedTokens.length > 0
      ? storedTokens.find(token => token.token.address === tokenAddress)?.token.decimals
      : ''
    if (!decimals) {
      return '0'
    }
    const requestAllowance: IResponse = await requestTokenAllowance(networkName, userAddress, recipientAddress, tokenAddress)
    if (requestAllowance.ok) {
      return new BigNumber(requestAllowance.result).shiftedBy(-decimals).toString()
    }
    return '0'
  }

  @Action
  public async Approve ({
    recipientAddress,
    tokenAddress,
    amount
  }: {
    recipientAddress: string,
    tokenAddress: string,
    amount: string
  }): Promise<string> {
    const storedTokens: IBalance[] = TokensModule.tokens || []
    const decimals = storedTokens.length > 0
      ? storedTokens.find(token => token.token.address === tokenAddress)?.token.decimals
      : ''
    if (!decimals) {
      return '0'
    }
    const approve: IResponse = await requestApprove(recipientAddress, tokenAddress, decimals, amount)
    console.log('approve: ', approve)
    const allowance = await this.context.dispatch('Allowance', { recipientAddress, tokenAddress })
    console.log('allowance: ', allowance)
    return allowance
  }

  @Action
  public async Transfer ({
    recipientAddress,
    amount,
    tokenAddress
  }: {
    recipientAddress: string,
    amount: string,
    tokenAddress: string,
  }): Promise<any> {
    const storedTokens: IBalance[] = TokensModule.tokens || []
    const decimals = storedTokens.length > 0
      ? storedTokens.find(token => token.token.address === tokenAddress)?.token.decimals
      : ''
    if (!decimals) {
      return '0'
    }
    const transfer: IResponse = await requestTransfer(recipientAddress, amount, decimals, tokenAddress)
    console.log('transfer: ', transfer)
  }
}

export const TokensModule = getModule(Tokens)
