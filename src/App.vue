<template>
  <v-app>
    <template v-if="authenticated">
      <AdminDashboard @authenticated="authenticate" @logout="logout"/>
    </template>
    <template v-else>
      <router-view @authenticated="authenticate"/>
    </template>
  </v-app>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  import AdminDashboard from './components/AdminDashboard.vue';

  export default {
    name: 'App',
    components: {
      AdminDashboard
    },
    data() {
      return {
        authenticated: false
      }
    },
    mounted() {
      if(localStorage.getItem('jwt')) {
        this.authenticated = true;

        this.setUserDetails(JSON.parse(localStorage.getItem('user')));
        this.setAuthToken(localStorage.getItem('jwt'));
      }

      if(!this.authenticated) {
        this.$router.replace({ name: 'Login' });
      }
    },
    methods: {
      ...mapGetters('auth', ['getUserDetails', 'getAuthToken']),
      ...mapMutations('auth', ['setUserDetails', 'setAuthToken']),

      authenticate(auth) {
        this.authenticated = true;

        localStorage.setItem('user', JSON.stringify(auth.user));
        localStorage.setItem('jwt', auth.token);

        this.setUserDetails(auth.user);
        this.setAuthToken(auth.token);
      },
      logout() {
        localStorage.clear();

        this.authenticated = false;
        this.setUserDetails(null);
        this.setAuthToken(null);

        this.$router.replace({ name: 'Login' });
      }
    }
  }
</script>
