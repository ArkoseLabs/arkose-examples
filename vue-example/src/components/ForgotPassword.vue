<template>
  <div>
    <h2>Forgot Password</h2>
    <Arkose
      :public-key="publicKey"
      selector="#arkose-ec"
      mode="inline"
      @completed="onCompleted"
      @error="onError"
    />
    <input type="text" id="email" name="email" placeholder="Email" />
    <button @click="onSubmit" :disabled="!arkoseToken">Reset</button>
    <nav>
      <router-link to="/">Login</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Arkose from './Arkose.vue';

const router = useRouter();
const publicKey = import.meta.env.VITE_ARKOSE_PUBLIC_KEY;
const arkoseToken = ref(null);

const onCompleted = (token) => {
  arkoseToken.value = token;
};

const onError = (errorMessage) => {
  alert(errorMessage);
};

const onSubmit = () => {
  if (!arkoseToken.value) return;
  router.replace({ path: '/' });
};
</script>
