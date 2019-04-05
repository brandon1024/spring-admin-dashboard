<template>
	<v-container grid-list-md text-xs-center justify-start fluid class="pa-4 ma-0">
		<div class="display-2 font-weight-thin text-sm-left">Dashboard</div>
		<v-layout row wrap>
			<v-flex d-flex>
				<health-card></health-card>
			</v-flex>
			<v-flex d-flex>
				<statistics-card></statistics-card>
			</v-flex>
			<v-flex d-flex>
				<process-summary-card></process-summary-card>
			</v-flex>
		</v-layout>
		<v-layout row wrap class="hidden-sm-and-down">
			<v-flex>
				<v-layout column wrap>
					<v-flex>
						<v-card dark color="secondary">
							<memory-usage-graph :chart-data="[]" :height="100"/>
						</v-card>
					</v-flex>
					<v-flex>
						<v-card dark color="secondary">
							<traffic-history-graph :chart-data="[]" :height="100"/>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  import HealthCard from '../components/dashboard/HealthCard.vue';
  import StatisticsCard from '../components/dashboard/StatisticsCard.vue';
  import ProcessSummaryCard from '../components/dashboard/ProcessSummaryCard.vue';
  import MemoryUsageGraph from '../components/dashboard/MemoryUsageGraph.vue';
  import TrafficHistoryGraph from '../components/dashboard/ServerTrafficHistoryGraph';

  export default {
    components: {
      HealthCard,
      StatisticsCard,
      ProcessSummaryCard,
      MemoryUsageGraph,
      TrafficHistoryGraph
    }
  }
</script>

<style scoped>

</style>