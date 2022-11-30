<template>
  <div>
    <h2>Forgot Password</h2>
    <Arkose
      :public-key="publicKey"
      mode="inline"
      selector="#arkose-ec"
      @onCompleted="onCompleted($event)"
      @onError="onError($event)"
    />
    <input
      type="text"
      id="email"
      name="email"
      placeholder="Email"
    >
    <input
      type="submit"
      @click="onSubmit()"
      value="Submit"
      :disabled="!arkoseToken"
    >
    <nav>
      <router-link to="/">
        Login
      </router-link>
    </nav>
  </div>
</template>

<script>
import router from '../router.js';
import Arkose from './Arkose.vue';

export default {
  name: 'ForgotPassword',
  components: {
    Arkose
  },
  data () {
    return {
      publicKey: process.env.VUE_APP_ARKOSE_PUBLIC_KEY,
      arkoseToken: null
    };
  },
  methods: {
    onCompleted (token) {
      this.arkoseToken = token;
    },
    onError (errorMessage) {
      alert(errorMessage);
    },
    onSubmit () {
      if (!this.arkoseToken) return;
      router.replace({ path: '/' });
    }
  }
};
</script>
