import Vue from 'vue';
import Vuex from 'vuex';

import ServerModule from './modules/server.js';
import ActuatorModule from './modules/actuator.js';
import AuthModule from './modules/auth.js';
import HistoricalMeasurements from './modules/historical-measurements.js'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    serverDetails: ServerModule,
    actuator: ActuatorModule,
    auth: AuthModule,
    history: HistoricalMeasurements
  }
});