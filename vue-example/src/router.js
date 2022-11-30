import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import('./components/Login.vue');
const ForgotPassword = () => import('./components/ForgotPassword.vue');
const Dashboard = () => import('./components/Dashboard.vue');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ],
  mode: 'history'
});
