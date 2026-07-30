<template>
  <div
    v-if="mode === 'inline' && selector"
    :id="selector.replace(/^#/, '')"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  publicKey: { type: String, required: true },
  mode: { type: String, default: '' },
  selector: { type: String, default: null },
  nonce: { type: String, default: '' },
});

const emit = defineEmits([
  'ready', 'shown', 'show', 'suppress', 'completed',
  'reset', 'hide', 'error', 'failed',
]);

let enforcement = null;
const scriptId = `arkose-script-${props.publicKey}`;

const run = () => enforcement?.run();

defineExpose({ run });

const setupEnforcement = (myEnforcement) => {
  enforcement = myEnforcement;
  enforcement.setConfig({
    selector: props.selector,
    mode: props.mode,
    onReady: () => emit('ready'),
    onShown: () => emit('shown'),
    onShow: () => emit('show'),
    onSuppress: () => emit('suppress'),
    onCompleted: (response) => emit('completed', response.token),
    onReset: () => emit('reset'),
    onHide: () => emit('hide'),
    onError: (response) => emit('error', response?.error?.error),
    onFailed: (response) => emit('failed', response),
  });
};

onMounted(() => {
  window.setupEnforcement = setupEnforcement;

  if (document.getElementById(scriptId)) {
    return;
  }

  const script = document.createElement('script');
  script.id = scriptId;
  script.src = `https://client-api.arkoselabs.com/v2/${props.publicKey}/api.js`;
  script.setAttribute('data-callback', 'setupEnforcement');
  script.async = false;
  script.onerror = () => emit('error', 'Script load failed');
  if (props.nonce) {
    script.setAttribute('data-nonce', props.nonce);
  }
  document.body.appendChild(script);
});

onBeforeUnmount(() => {
  if (window.setupEnforcement === setupEnforcement) {
    delete window.setupEnforcement;
  }
  const el = document.getElementById(scriptId);
  if (el) el.remove();
});
</script>
