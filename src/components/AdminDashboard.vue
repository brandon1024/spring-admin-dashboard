<template>
	<v-content>
		<Header @logout="$emit('logout')" @refresh-dashboard="refresh"/>
		<navigation-drawer @stop-server="stopServer"/>
		<router-view @authenticated="$emit('authenticate')"/>
		<status-bar v-bind:transferStatus="transferStatus"/>

		<info-dialog v-bind:dialog-data="dialogData" @logout="$emit('logout')" @continue-offline="dialogData.show = false"/>
		<v-snackbar v-model="notificationData.show" right top :timeout="3000"
					:color="notificationData.error ? 'red' : ''">
			{{ notificationData.description }}
			<v-btn :color="notificationData.error ? 'white' : 'green'" @click="notificationData.show = false">Dismiss
			</v-btn>
		</v-snackbar>
	</v-content>
</template>

<script>
  import {mapMutations, mapGetters} from 'vuex';

  import Header from './Header.vue';
  import NavigationDrawer from './NavigationDrawer.vue';
  import StatusBar from './StatusBar.vue';
  import InfoDialog from './InfoDialog.vue';

  const ACTUATOR_ENDPOINTS = {
    health: '/actuator/health',
    metrics: '/actuator/metrics',
    env: '/actuator/env',
    httpTrace: '/actuator/httptrace',
    shutdown: '/actuator/shutdown',
    info: '/actuator/info',
    mappings: '/actuator/mappings'
  };

  export default {
    components: {
      Header,
      NavigationDrawer,
      StatusBar,
      InfoDialog
    },
    data() {
      return {
        transferStatus: false,
		transferStatusTimeoutHandle: null,
        dialogData: {
          error: false,
          show: false,
          title: null,
          description: null,
          buttons: []
        },
        notificationData: {
          error: false,
          show: false,
          description: null
        },
        initialized: false
      }
    },
    mounted() {
      if (!this.initialized) {
        this.initialized = true;
        this.refresh();
      }
    },
    methods: {
      ...mapGetters('serverDetails', [
        'getServerUrl',
        'isServerOnline'
      ]),
      ...mapGetters('auth', [
        'getAuthToken'
      ]),

      ...mapMutations('serverDetails', [
        'setServerIsOnline'
      ]),
      ...mapMutations('actuator', [
        'setHealthActuator',
        'setMetricsActuator',
        'setEnvActuator',
        'setHttpTraceActuator',
        'setInfoActuator',
        'setMappingsActuator',
        'setServerDetails'
      ]),

      refresh() {
        const serverUrl = this.getServerUrl();
        const token = this.getAuthToken();

        const http = this.axios.create({
          baseURL: serverUrl,
          headers: {
            Authorization: `Bearer ${token}`
          },
          onDownloadProgress: () => {
            if(this.transferStatusTimeoutHandle) {
              clearTimeout(this.transferStatusTimeoutHandle);
            }

            this.transferStatus = true;
            this.transferStatusTimeoutHandle = setTimeout(function() {
              this.transferStatus = false;
			}.bind(this), 1000);
          }
        });

        /* Callback for fetching all actuator data */
        let fetchActuatorData = (http) => {
          this.fetchMetrics(http);

          http.get(ACTUATOR_ENDPOINTS.health).then((response) => {
            this.setHealthActuator(response.data);
          }).catch(() => {
            this.setHealthActuator(null);
          });

          http.get(ACTUATOR_ENDPOINTS.env).then((response) => {
            this.setEnvActuator(response.data);
          }).catch(() => {
            this.setEnvActuator(null);
          });

          http.get(ACTUATOR_ENDPOINTS.httpTrace).then((response) => {
            this.setHttpTraceActuator(response.data);
          }).catch(() => {
            this.setHttpTraceActuator(null);
          });

          http.get(ACTUATOR_ENDPOINTS.info).then((response) => {
            this.setInfoActuator(response.data);
          }).catch(() => {
            this.setInfoActuator(null);
          });

          http.get(ACTUATOR_ENDPOINTS.mappings).then((response) => {
            this.setMappingsActuator(response.data);
          }).catch(() => {
            this.setMappingsActuator(null);
          });
        };

        /* Make initial request to verify that server is reachable */
        http.get('/').then(() => {
          this.setServerIsOnline(true);

          fetchActuatorData(http);
        })
        .catch((error) => {
          this.setServerIsOnline(false);

          this.setHealthActuator(null);
          this.setMetricsActuator(null);
          this.setEnvActuator(null);
          this.setHttpTraceActuator(null);
          this.setInfoActuator(null);
          this.setMappingsActuator(null);

          if (error.response && error.response.status === 401) {
            this.$emit('logout');
          }
        });
      },
      fetchMetrics(http) {
        http.get(ACTUATOR_ENDPOINTS.metrics).then((response) => {
          let availableMetrics = response.data;
          let metrics = {availableMetrics: availableMetrics, measurements: {}};

          /* Request details for all available metrics */
          let promise = Promise.resolve(metrics);
          for (let name of availableMetrics.names) {
            promise = promise.then((metrics) => {
              return http.get(`${ACTUATOR_ENDPOINTS.metrics}/${name}`).then((response) => {
                metrics.measurements[name] = response.data;
                return Promise.resolve(metrics);
              });
            });
          }

          return promise;
        }).then((metrics) => {
          this.setMetricsActuator(metrics);
        }).catch(() => {
          this.setMetricsActuator(null);
        });
      },
      stopServer() {
        const serverUrl = this.getServerUrl();
        const token = this.getAuthToken();

        const http = this.axios.create({
          baseURL: serverUrl,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        http.post(ACTUATOR_ENDPOINTS.shutdown).then(() => {
          this.dialogData = {
            error: false,
            show: true,
            title: 'Server Shutdown Successful',
            description: 'Server shutdown successful. Logout?',
            buttons: [{
              text: 'Continue Offline',
              id: 'continue-offline'
            }, {
              text: 'Logout',
              id: 'logout'
            }]
          };

          this.setServerIsOnline(false);
        }).catch(() => {
          this.notificationData = {
            error: true,
            show: true,
            description: 'Server shutdown unsuccessful.'
          };
        });
      }
    }
  }
</script>
