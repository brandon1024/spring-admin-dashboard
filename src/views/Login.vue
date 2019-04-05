<template>
	<v-content>
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card class="elevation-12">
						<v-toolbar dark color="blue-grey darken-3">
							<v-toolbar-side-icon>
								<img src="../assets/spring.svg" id="spring-boot-logo" alt="Spring Boot Logo"/>
							</v-toolbar-side-icon>
							<v-toolbar-title class="font-weight-light">Spring Admin Login</v-toolbar-title>
						</v-toolbar>
						<v-alert type="error" v-model="error" transition="scale-transition">
							Login failed.
						</v-alert>
						<v-card-text>
							<v-form @submit="handleSubmit">
								<v-text-field prepend-icon="person" name="username" label="Username" type="text" v-model="username"></v-text-field>
								<v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
								<v-btn color="primary" type="submit" v-on:click="handleSubmit">Login</v-btn>
							</v-form>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'Login',
    data() {
      return {
        username: "",
        password: "",
        error: false
      }
    },
    methods: {
      ...mapGetters('serverDetails', ['getServerUrl']),

      handleSubmit(e) {
        e.preventDefault();

        const serverUrl = this.getServerUrl();

        this.axios.post(serverUrl + '/auth/signin', {
          username: this.username,
          password: this.password
        }).then(response => {
          if (response.data.token) {
            this.$emit('authenticated', response.data);
            this.$router.push(this.$route.params.nextUrl || 'dashboard')
          } else {
            this.error = true;
          }
        }).catch(() => {
          this.error = true;
        });
      }
    }
  }
</script>

<style scoped>
	img#spring-boot-logo {
		width: 100%;
	}
</style>