import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { MutationTypes } from '~/@types/mutation-types'
import { ActionTypes } from '~/@types/action-types'
import { IAppState } from '~/@types/interfaces'
import { store } from '@/store'

@Module({
  dynamic: true,
  namespaced: true,
  name: 'app',
  store
})
class App extends VuexModule implements IAppState {
  public theme: string = 'light'

  get getTheme (): string {
    return this.theme
  }

  @Mutation
  public [MutationTypes.MAIN_SET_THEME] (theme: string): void {
    this.theme = theme
  }

  @Action
  public [ActionTypes.MAIN_APPLY_DARK_THEME] (): void {
    this.context.commit(MutationTypes.MAIN_SET_THEME, 'dark')
  }

  @Action
  public [ActionTypes.MAIN_APPLY_LIGHT_THEME] (): void {
    this.context.commit(MutationTypes.MAIN_SET_THEME, 'light')
  }
}

export const AppModule = getModule(App)
