import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import login from './module/login'
import L4 from './module/L4'
import L7 from './module/L7'
import common from './module/common'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    login, L4, L7, common
  },
  // plugins: [createPersistedState()]
})
