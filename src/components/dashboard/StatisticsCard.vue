<template>
	<v-card hover>
		<v-toolbar dark color="secondary" dense>
			<v-toolbar-title class="headline font-weight-light">Statistics</v-toolbar-title>
		</v-toolbar>

		<v-list dense>
			<template v-for="(value, key) in stats">
				<v-list-tile :key="key">
					<v-list-tile-content>
						<v-list-tile-title>{{ value.name }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action-text>{{ value.value }}</v-list-tile-action-text>
				</v-list-tile>
			</template>
		</v-list>
	</v-card>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState('actuator', ['metrics']),

      stats: function () {
        if (!this.metrics) {
          return [];
        }

        let metricKeys = [
          'process.uptime',
          'http.server.requests',
          'jvm.memory.used',
          'jvm.memory.max',
          'tomcat.sessions.active.current',
          'tomcat.sessions.rejected',
          'jvm.threads.live'
        ];

        let stats = [];
        let availableMetrics = this.metrics.availableMetrics.names
        .filter((name) => metricKeys.includes(name))
        .sort((n1, n2) => {
          n1 = n1.toLowerCase();
          n2 = n2.toLowerCase();

          if (n1 < n2) {
            return -1;
          }
          if (n1 > n2) {
            return 1;
          }

          return 0;
        });

        for (let metricKey of availableMetrics) {
          let metric = null;

          let metricMeasurements = this.metrics.measurements[metricKey].measurements;
          if (metricKey === metricKeys[0]) {
            metric = this.extractServerUptime(metricMeasurements);
          } else if (metricKey === metricKeys[1]) {
            metric = this.extractServerRequests(metricMeasurements);
          } else if (metricKey === metricKeys[2]) {
            metric = this.extractJVMUsedMemory(metricMeasurements);
          } else if (metricKey === metricKeys[3]) {
            metric = this.extractJVMMemoryMax(metricMeasurements);
          } else if (metricKey === metricKeys[4]) {
            metric = this.extractActiveSessions(metricMeasurements);
          } else if (metricKey === metricKeys[5]) {
            metric = this.extractRejectedSessions(metricMeasurements);
          } else if (metricKey === metricKeys[6]) {
            metric = this.extractJVMThreadCount(metricMeasurements);
          }

          if (!metric) {
            continue;
          }

          metric.key = metricKey;
          stats.push(metric);
        }

        return stats;
      }
    },
    methods: {
      extractServerUptime(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        metricValue = metricValue.shift().value;

        let days = Math.floor(metricValue / 86400);
        metricValue %= 86400;

        let hours = Math.floor(metricValue / 3600).toString().padStart(2, '0');
        metricValue %= 3600;

        let minutes = Math.floor(metricValue / 60).toString().padStart(2, '0');
        metricValue %= 60;

        let seconds = Math.floor(metricValue).toString().padStart(2, '0');
        return {
          name: 'Server Uptime',
          value: `${days}d ${hours}:${minutes}:${seconds}`
        };
      },
      extractServerRequests(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'COUNT');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'Total HTTP Requests',
          value: metric.value
        };
      },
      extractJVMUsedMemory(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'JVM Used Memory',
          value: this.formatBytes(metric.value)
        };
      },
      extractJVMMemoryMax(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'JVM Max Memory',
          value: this.formatBytes(metric.value)
        };
      },
      extractActiveSessions(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'Active Sessions',
          value: metric.value
        };
      },
      extractRejectedSessions(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'Rejected Sessions',
          value: metric.value
        };
      },
      extractJVMThreadCount(metricMeasurements) {
        let metricValue = metricMeasurements.filter(m => m.statistic === 'VALUE');
        if (!metricValue.length) {
          return null;
        }

        let metric = metricValue.shift();
        return {
          name: 'JVM Thread Count',
          value: metric.value
        };
      },
      formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) {
          return '0 Bytes';
        }

        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + sizes[i];
      }
    }
  }
</script>