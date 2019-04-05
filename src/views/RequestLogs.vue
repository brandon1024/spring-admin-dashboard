<template>
	<v-container grid-list-md text-xs-center justify-start fluid class="pa-4 ma-0">
		<div class="display-2 font-weight-thin text-sm-left">Request Logs</div>
		<v-layout row>
			<v-flex d-flex>
				<v-data-table :headers="headers" :items="logs" item-key="id" class="elevation-1" expand>

					<!-- Request Log Lines -->
					<template v-slot:items="props">
						<tr @click="props.expanded = !props.expanded">
							<td class="text-xs-left">{{ props.item.timestamp }}</td>
							<td class="text-xs-center">
								<v-chip label outline disabled :color="props.item.request.color">
									{{ props.item.request.method }}
								</v-chip>
							</td>
							<td class="text-xs-left">{{ props.item.request.uri }}</td>
							<td class="text-xs-left">{{ props.item.request.remoteAddress }}</td>
							<td class="text-xs-center">
								<v-chip label outline disabled :color="props.item.response.color">
									{{ props.item.response.status }}
								</v-chip>
							</td>
						</tr>
					</template>

					<!-- Individual Request Log Details -->
					<template v-slot:expand="props">
						<v-card hover>
							<v-list dense>
								<v-list-group no-action sub-group>
									<template v-slot:activator>
										<v-list-tile>
											<v-list-tile-content>
												<v-list-tile-title>Request Headers</v-list-tile-title>
											</v-list-tile-content>
										</v-list-tile>
									</template>

									<v-list-tile v-for="(headerValue, headerKey) of props.item.request.headers" :key="headerKey">
										<v-list-tile-content>
											<v-list-tile-title>{{ headerKey }}</v-list-tile-title>
										</v-list-tile-content>
										<v-list-tile-action-text>{{ headerValue }}</v-list-tile-action-text>
									</v-list-tile>
								</v-list-group>

								<v-list-group no-action sub-group>
									<template v-slot:activator>
										<v-list-tile>
											<v-list-tile-content>
												<v-list-tile-title>Response Headers</v-list-tile-title>
											</v-list-tile-content>
										</v-list-tile>
									</template>

									<v-list-tile v-for="(headerValue, headerKey) of props.item.response.headers" :key="headerKey">
										<v-list-tile-content>
											<v-list-tile-title>{{ headerKey }}</v-list-tile-title>
										</v-list-tile-content>
										<v-list-tile-action-text>{{ headerValue }}</v-list-tile-action-text>
									</v-list-tile>
								</v-list-group>
							</v-list>
						</v-card>
					</template>
					<v-alert v-slot:no-results :value="true" color="error" icon="warning">
						Your search found no results.
					</v-alert>
				</v-data-table>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    props: {
      actuator: Object
    },
    data() {
      return {
        headers: [{
          text: 'Timestamp',
          align: 'left',
          sortable: false,
          value: 'timestamp'
        }, {
          text: 'Request Method',
          align: 'center',
          sortable: false,
          value: 'method'
        }, {
          text: 'URI',
          align: 'left',
          sortable: false,
          value: 'uri'
        }, {
          text: 'Remote Address',
          align: 'left',
          sortable: false,
          value: 'remoteAddress'
        }, {
          text: 'Response Status',
          align: 'center',
          sortable: false,
          value: 'responseStatus'
        }],
        filterActuatorRequests: false
      }
    },
    computed: {
      ...mapState('actuator', ['httpTrace']),

      logs: function () {
        if (this.httpTrace) {
          return this.httpTrace.traces.map((log, index) => {
            return {
              id: index,
              timestamp: new Date(log.timestamp * 1000).toISOString(),
              request: {
                method: log.request.method,
                color: this.methodToColor(log.request.method),
                uri: log.request.uri,
                remoteAddress: log.request.remoteAddress,
                headers: log.request.headers
              },
              response: {
                status: log.response.status,
                color: this.statusCodeToColor(log.response.status),
                headers: log.response.headers
              }
            }
          });
        }

        return [];
      }
    },
    methods: {
      statusCodeToColor(status) {
        if (status < 200) {
          return 'blue';
        }

        if (status < 300) {
          return 'green';
        }

        if (status < 400) {
          return 'teal';
        }

        if (status < 500) {
          return 'amber';
        }

        return 'red';
      },
      methodToColor(method) {
        switch (method.toUpperCase()) {
          case 'GET':
            return 'green';
          case 'HEAD':
            return 'orange';
          case 'POST':
            return 'blue-grey';
          case 'PUT':
            return 'amber';
          case 'PATCH':
            return 'light-blue';
          case 'DELETE':
            return 'red';
          case 'TRACE':
            return 'teal';
          case 'OPTIONS':
            return 'blue';
          case 'CONNECT':
          default:
            return 'indigo';
        }
      }
    }
  }
</script>