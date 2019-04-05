<template>
	<v-card v-if="process.length" hover>
		<v-toolbar dark color="secondary" dense>
			<v-toolbar-title class="headline font-weight-light">Server Process Summary</v-toolbar-title>
		</v-toolbar>

		<v-list dense>
			<v-list-group no-action v-for="(value, index) of process" :key="index">
				<template v-slot:activator>
					<v-list-tile>
						<v-list-tile-content>
							<v-list-tile-title>{{ value.name }}</v-list-tile-title>
							<v-list-tile-sub-title v-if="value.description" class="overflow-hidden">{{ value.description }}</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</template>

				<v-list-tile v-for="(measurement, mIndex) of value.measurements" :key="mIndex">
					<v-list-tile-content>
						<v-list-tile-title>{{ measurement.statistic }}</v-list-tile-title>
					</v-list-tile-content>

					<v-list-tile-action-text>{{ measurement.value }}</v-list-tile-action-text>
				</v-list-tile>
			</v-list-group>
		</v-list>
	</v-card>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState('actuator', ['metrics']),

      process: function () {
        if(!this.metrics) {
          return [];
		}

        let availableProcessMetrics = this.metrics.availableMetrics.names.filter((name) => /^process\..*/.test(name));
        let processMetrics = [];

        for (let metricKey of availableProcessMetrics) {
          processMetrics.push(this.metrics.measurements[metricKey]);
        }

        return processMetrics;
      }
    }
  }
</script>