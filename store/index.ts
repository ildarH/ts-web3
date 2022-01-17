import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { IRootState } from '~/@types/interfaces'

Vue.use(Vuex)

export const store = new Store<IRootState>({})
