import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import premission from './modules/permission'
import system from './modules/system'
import user from './modules/user'
import getters from './getters'
import createPersistedState  from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()], // store持久存储
  modules: {
    app,
    premission,
    system,
    user
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})