import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import Web3 from '~/store/modules/web3'

Vue.use(Vuex)

const store = new Store({
  modules: {
    Web3
  }
})

export default store
