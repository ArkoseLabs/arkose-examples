<template>
  <div>
    <h2>Login</h2>
    <Arkose
      :public-key="publicKey"
      mode="lightbox"
      @completed="onCompleted"
      @error="onError"
      ref="arkoseRef"
    />
    <input type="text" id="email" name="email" placeholder="Email" />
    <input type="password" id="password" name="password" placeholder="Password" />
    <button @click="onSubmit">Submit</button>
    <nav>
      <router-link to="/forgot-password">Forgot Password</router-link>
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
const arkoseRef = ref(null);

const onCompleted = (token) => {
  arkoseToken.value = token;
  router.replace({ path: '/dashboard' });
};

const onError = (errorMessage) => {
  alert(errorMessage);
};

const onSubmit = () => {
  if (arkoseToken.value) return;
  arkoseRef.value?.run();
};
</script>
