import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Trace from './views/RequestLogs.vue';
import Logging from './views/Logging.vue';
import Environment from './views/Environment.vue';
import Settings from './views/Settings.vue';
import Metrics from './views/Metrics.vue';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },{
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },{
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('jwt')) {
        next('/dashboard');
      } else {
        next();
      }
    }
  },{
    path: '/httptrace',
    name: 'Request Logs',
    component: Trace
  },{
    path: '/logs',
    name: 'Logs',
    component: Logging
  },{
    path: '/environment',
    name: 'Server Environment',
    component: Environment
  },{
    path: '/metrics',
    name: 'Metrics',
    component: Metrics
  },{
    path: '/settings',
    name: 'Settings',
    component: Settings
  }]
});

export default router;