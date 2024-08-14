import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export const store = createStore({
  plugins: [
    createPersistedState({storage: window.sessionStorage})
  ],
  state () {
    return {
      user: {},
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setToken(state, payload) {
      state.token = payload
    },
  },
  actions: {
    async saveUserSessionInfo({ commit }, res) {
      commit('setToken', res.token)
      commit('setUser', res.user)
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.token != null
    },
    getUser(state) {
      return state.user
      // toRaw optional for logging
      // return toRaw(state.user)
    },
  }
})