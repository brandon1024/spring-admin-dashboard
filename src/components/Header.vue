<template>
	<v-toolbar dark color="blue-grey darken-3" app flat clipped-left>
		<v-toolbar-side-icon :to="{ name: 'Home' }">
			<img src="../assets/spring.svg" id="spring-boot-logo" alt="Spring Boot Logo"/>
		</v-toolbar-side-icon>
		<v-toolbar-title class="font-weight-light">Spring Server Admin</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-tooltip bottom>
			<v-btn icon flat color="green" dark slot="activator" @click="$emit('refresh-dashboard')">
				<v-icon>refresh</v-icon>
			</v-btn>
			<span>Refresh Page</span>
		</v-tooltip>
		<v-tooltip bottom>
			<v-btn icon flat color="green" dark slot="activator">
				<v-icon>restore</v-icon>
			</v-btn>
			<span>Refresh Interval</span>
		</v-tooltip>

		<v-menu bottom origin="bottom right" transition="scale-transition">
			<template v-slot:activator="{ on }">
				<v-btn icon dark v-on="on">
					<v-icon>account_circle</v-icon>
				</v-btn>
			</template>
			<v-list>
				<v-list-tile>
					<v-list-tile-title>Configure Settings</v-list-tile-title>
				</v-list-tile>
			</v-list>
			<v-list>
				<v-list-tile @click="$emit('logout')">
					<v-list-tile-title>Logout</v-list-tile-title>
				</v-list-tile>
			</v-list>
		</v-menu>

	</v-toolbar>
</template>

<style scoped>
	img#spring-boot-logo {
		width: 100%;
	}
</style>