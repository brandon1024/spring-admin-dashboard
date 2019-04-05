<template>
	<v-footer class="pa-3" dark app>
		<v-layout row align-center>
			<v-flex grow>
				<v-tooltip top v-for="(item, index) of details" :key="index">
					<v-btn dark slot="activator">
						<v-icon :color="item.err ? 'red' : 'green'" class="pr-1">{{ item.icon }}</v-icon>
						<span
							class="font-weight-light caption font-weight-light caption text-none hidden-sm-and-down">{{ item.value }}</span>
					</v-btn>
					<span class="hidden-sm-and-down">{{ item.label }}</span>
					<span class="hidden-md-and-up">{{ item.value }}</span>
				</v-tooltip>
			</v-flex>

			<v-spacer></v-spacer>

			<v-flex text-xs-right>
				<v-progress-linear
					v-bind:indeterminate="transferStatus"
					color="secondary"
					height="2"
					class="hidden-sm-and-down">
				</v-progress-linear>
				<v-progress-circular
					v-bind:indeterminate="transferStatus"
					color="secondary"
					height="2"
					class="hidden-md-and-up">
				</v-progress-circular>
			</v-flex>
		</v-layout>
	</v-footer>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'StatusBar',
    props: {
      transferStatus: Boolean
    },
    computed: {
      ...mapState('auth', ['userDetails']),
      ...mapState('serverDetails', ['serverUrl', 'isOnline']),

      details: function () {
        return [{
          value: this.isOnline ? 'ONLINE' : 'OFFLINE',
          icon: 'compare_arrows',
          label: 'Server Status',
          err: !this.isOnline
        }, {
          value: this.serverUrl,
          icon: 'dns',
          label: 'Server IP Address',
          err: false
        }, {
          value: this.userDetails.username,
          icon: 'person',
          label: 'Current User',
          err: false
        }];
      }
    }
  }
</script>

<style scoped>

</style>