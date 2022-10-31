<template>
  <div>
    <h2>Login</h2>
    <Arkose
      :publicKey="publicKey"
      mode="lightbox"
      @onCompleted="onCompleted($event)"
      @onError="onError($event)"
    />
    <input type="text" id="email" name="email" placeholder="Email" />
    <input type="text" id="password" name="password" placeholder="Password" />
    <input type="submit" @click="onSubmit()" value="Submit" />
    <nav>
      <router-link to="/forgot-password">Forgot Password</router-link>
    </nav>
  </div>
</template>

<script>
import router from '../router.js';
import Arkose from './Arkose.vue';

export default {
  name: 'Login',
  components: {
    Arkose,
  },
  data() {
    return {
      publicKey: process.env.VUE_APP_ARKOSE_PUBLIC_KEY,
      arkoseToken: null,
    };
  },
  methods: {
    onCompleted(token) {
      this.arkoseToken = token;
      router.replace({ path: '/dashboard' });
    },
    onError(errorMessage) {
      alert(errorMessage);
    },
    onSubmit() {
      if (!this.arkoseToken) {
        window.myEnforcement.run();
      }
    },
  },
};
</script>
