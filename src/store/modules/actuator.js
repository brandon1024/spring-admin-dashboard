/**
 * Vuex module for actuator data.
 * */

export default {
  namespaced: true,

  state: {
    health: null,
    metrics: null,
    httpTrace: null,
    env: null,
    info: null,
    mappings: null
  },
  getters: {
    getHealthActuator(state) {
      return state.health;
    },
    getMetricsActuator(state) {
      return state.metrics;
    },
    getHttpTraceActuator(state) {
      return state.httpTrace;
    },
    getEnvActuator(state) {
      return state.env;
    },
    getInfoActuator(state) {
      return state.info;
    },
    getMappingsActuator(state) {
      return state.mappings;
    }
  },
  actions: {},
  mutations: {
    setHealthActuator(state, health) {
      state.health = health;
    },
    setMetricsActuator(state, metrics) {
      state.metrics = metrics;
    },
    setHttpTraceActuator(state, httpTrace) {
      state.httpTrace = httpTrace;
    },
    setEnvActuator(state, env) {
      state.env = env;
    },
    setInfoActuator(state, info) {
      state.info = info;
    },
    setMappingsActuator(state, mappings) {
      state.mappings = mappings;
    }
  }
};