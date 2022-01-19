import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Mutations } from '~/@types/mutations'
import { IBalance, IResponse, IToken, ITokensState, ITransactions } from '~/@types/interfaces'
import { store } from '~/store'

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
  public [Mutations.TOKENS_SET_TOKEN] (payload: IBalance): void {
    this.tokens = [...this.tokens].map((token: IBalance) => token.token.address !== payload.token.address ? token : payload)
  }

  @Action
  public async GetTokenData (): Promise<void> {}
}

export const TokensModule = getModule(Tokens)
