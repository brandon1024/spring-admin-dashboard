<template>
	<v-navigation-drawer value="true" app clipped>
		<v-list>
			<v-list-tile :to="{ name: 'Dashboard' }">
				<v-list-tile-title>Dashboard</v-list-tile-title>
				<v-list-tile-action>
					<v-icon>view_compact</v-icon>
				</v-list-tile-action>
			</v-list-tile>

			<v-list-group no-action sub-group value="true">
				<template v-slot:activator>
					<v-list-tile>
						<v-list-tile-title>Admin</v-list-tile-title>
					</v-list-tile>
				</template>

				<v-list-tile v-for="(admin, i) in admins" :key="i" :to="{ name: admin.view }">
					<v-list-tile-title v-text="admin.name"></v-list-tile-title>
					<v-list-tile-action>
						<v-icon v-text="admin.icon"></v-icon>
					</v-list-tile-action>
				</v-list-tile>
			</v-list-group>

			<v-list-group no-action sub-group value="true">
				<template v-slot:activator>
					<v-list-tile>
						<v-list-tile-title>Actions</v-list-tile-title>
					</v-list-tile>
				</template>
				<v-list-tile v-for="(crud, i) in cruds" :key="i" @click="showShutdownConfirmationDialog">
					<v-list-tile-title v-text="crud[0]"></v-list-tile-title>
					<v-list-tile-action>
						<v-icon v-text="crud[1]"></v-icon>
					</v-list-tile-action>
				</v-list-tile>
			</v-list-group>
		</v-list>

		<info-dialog v-bind:dialog-data="dialogData" @shutdown-confirm="shutdown" @shutdown-cancel="dialogData.show = false"/>
	</v-navigation-drawer>
</template>

<script>
  import InfoDialog from './InfoDialog.vue';

  export default {
    components: {
      InfoDialog
    },
    data: () => ({
      admins: [
        {name: 'Request Logs', icon: 'http', view: 'Request Logs'},
        {name: 'Server Logs', icon: 'vertical_split', view: 'Logs'},
        {name: 'Server Environment', icon: 'dns', view: 'Server Environment'},
        {name: 'Metrics', icon: 'sort', view: 'Metrics'},
        {name: 'Settings', icon: 'tune', view: 'Settings'}
      ],
      cruds: [
        ['Stop Server', 'power_settings_new']
      ],
      dialogData: {
        error: false,
        show: false,
        title: null,
        description: null,
        buttons: []
      }
    }),
    methods: {
      showShutdownConfirmationDialog() {
        this.dialogData = {
          error: false,
          show: true,
          title: 'Shutdown Confirmation',
          description: 'Are you sure you want to shutdown the server?',
          buttons: [{
            text: 'Confirm',
            id: 'shutdown-confirm'
          }, {
            text: 'Cancel',
            id: 'shutdown-cancel'
          }]
        }
      },
      shutdown() {
        this.dialogData = {
          error: false,
          show: false,
          title: null,
          description: null,
          buttons: []
        };

        this.$emit('stop-server');
      }
    }
  }
</script>

<style scoped>

</style>