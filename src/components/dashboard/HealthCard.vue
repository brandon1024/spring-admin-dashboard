<template>
	<v-card hover>
		<v-toolbar dark color="secondary" dense>
			<v-toolbar-title class="headline font-weight-light">Server Health Summary</v-toolbar-title>
		</v-toolbar>

		<v-list dense>
			<v-list-tile>
				<v-list-tile-content>
					<v-list-tile-title>Status</v-list-tile-title>
				</v-list-tile-content>
				<v-list-tile-action-text
					v-bind:class="{ 'red--text': health.status !== 'UP', 'green--text': health.status === 'UP' }">
					{{ health.status }}
				</v-list-tile-action-text>
			</v-list-tile>

			<template v-for="(value, key) in health.details">
				<v-list-tile v-if="!value.details" :key="key">
					<v-list-tile-content>
						<v-list-tile-title>{{ value.name }}</v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action-text>{{ value.status }}</v-list-tile-action-text>
				</v-list-tile>

				<v-list-group no-action sub-group v-else :key="key" :value="true">
					<template v-slot:activator>
						<v-list-tile>
							<v-list-tile-content>
								<v-list-tile-title>{{ value.name }}</v-list-tile-title>
							</v-list-tile-content>
							<v-list-tile-action-text
								v-bind:class="{ 'red--text': value.status !== 'UP', 'green--text': value.status === 'UP' }">
								{{ value.status }}
							</v-list-tile-action-text>
						</v-list-tile>
					</template>

					<v-list-tile v-for="(detailsValue, detailsKey) in value.details" :key="detailsKey">
						<v-list-tile-content>
							<v-list-tile-title>{{ detailsKey }}</v-list-tile-title>
						</v-list-tile-content>
						<v-list-tile-action-text>{{ detailsValue }}</v-list-tile-action-text>
					</v-list-tile>
				</v-list-group>
			</template>
		</v-list>
	</v-card>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    methods: {
      formatBytes: (bytes, decimals = 2) => {
        if (bytes === 0) {
          return '0 Bytes';
        }

        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        return parseFloat((bytes / Math.pow(1024, i)).toFixed(dm)) + sizes[i];
      }
    },
    computed: {
      ...mapState('actuator', {
        healthDetails: state => state.health
      }),

      health: function () {
        let healthInfo = {
          status: 'UNKNOWN',
          details: {}
        };

        let health = this.healthDetails;
        if (!health) {
          return healthInfo;
        }

        healthInfo.status = health.status;
        if (!health.details) {
          return healthInfo;
        }

        Object.keys(health.details).forEach((key) => {
          if (key === 'db') {
            healthInfo.details[key] = {
              name: 'Database Health',
              ...health.details[key],
            };
          } else if (key === 'diskSpace') {
            const details = health.details[key].details;

            healthInfo.details[key] = {
              name: 'Disk Space',
              status: health.details[key].status,
              details: {
                free: this.formatBytes(details.free),
                total: this.formatBytes(details.total)
              }
            };
          } else {
            healthInfo.details[key] = {
              name: key,
              ...health.details[key]
            }
          }
        });

        return healthInfo;
      }
    }
  }
</script>