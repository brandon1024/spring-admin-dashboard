/**
 * Vuex module for user and authentication details.
 * */

export default {
  namespaced: true,

  state: {
    userDetails: null,
    authToken: null
  },
  getters: {
    getUserDetails(state) {
      return state.userDetails;
    },
    getAuthToken(state) {
      return state.authToken;
    }
  },
  actions: {},
  mutations: {
    setUserDetails(state, details) {
      state.userDetails = details;
    },
    setAuthToken(state, token) {
      state.authToken = token;
    }
  }
};