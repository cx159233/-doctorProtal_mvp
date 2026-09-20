const system = {
  state: {
    init: false, // 初始化
    citys: [] // 城市
  },
  mutations: {
    SET_INIT: (state, init) => {
      state.init = init
    }
  },
  actions: {
    // 获取全局公用接口
    GetGlobal({ commit }) {
      return new Promise((resolve, reject) => {
        Promise.all([])
          .then(res => {
            commit('SET_INIT', true)
            resolve(res)
          }).catch(e => {
            reject(e)
          })
      })
    },
    // 将系统重置
    ResetSystem( { commit }, init) {
      commit('SET_INIT', init)
    } 
  }
}

export default system