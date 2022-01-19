import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { Mutations } from '~/@types/mutations'
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
  public [Mutations.MAIN_SET_THEME] (theme: string): void {
    this.theme = theme
  }

  @Action
  public ApplyDarkTheme (): void {
    this.context.commit(Mutations.MAIN_SET_THEME, 'dark')
  }

  @Action
  public ApplyLightTheme (): void {
    this.context.commit(Mutations.MAIN_SET_THEME, 'light')
  }
}

export const AppModule = getModule(App)
