/**
 * Vuex module for server details.
 * */

export default {
  namespaced: true,

  state: {
    serverUrl: 'http://localhost:8080',
    isOnline: true
  },
  getters: {
    getServerUrl(state) {
      return state.serverUrl;
    },
    isServerOnline(state) {
      return state.isOnline;
    }
  },
  actions: {},
  mutations: {
    setServerUrl(state, url) {
      state.serverUrl = url;
    },
    setServerIsOnline(state, isOnline) {
      state.isOnline = isOnline;
    }
  }
};