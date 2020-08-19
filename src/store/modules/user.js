const state = {
  ishideSidebar: false,
  chooseVip: null
}

const mutations = {
  SET_ISHIDESIDEBAR: (state, ishideSidebar) => {
    state.ishideSidebar = ishideSidebar
  },
  SET_CHOOSEVIP: (state, chooseVip) => {
    state.chooseVip = chooseVip
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
