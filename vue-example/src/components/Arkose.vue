<template>
  <div v-if="mode === 'inline'" :id="selector"></div>
</template>

<script>
export default {
  name: 'Arkose',
  props: {
    publicKey: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: ''
    },
    selector: {
      type: String,
      default: null
    },
    nonce: {
      type: String,
      default: ''
    },
  },
  methods: {
    // Append the JS tag to the Document Body.
    loadScript(publicKey, nonce) {
      const scriptId = 'arkose-script';
      const currentScript = document.getElementById(scriptId);
      if (currentScript) {
        currentScript.remove();
      }
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`;
      script.setAttribute('data-callback', 'setupEnforcement');
      script.async = true;
      script.defer = true;
      if (nonce) {
        script.setAttribute('data-nonce', nonce);
      }
      document.body.appendChild(script);
      return script;
    },
    setupEnforcement(myEnforcement) {
      window.myEnforcement = myEnforcement;
      window.myEnforcement.setConfig({
        selector: this.selector && `#${this.selector}`,
        mode: this.mode,
        onReady: () => {
          this.$emit('onReady');
        },
        onShown: () => {
          this.$emit('onShown');
        },
        onShow: () => {
          this.$emit('onShow');
        },
        onSuppress: () => {
          this.$emit('onSuppress');
        },
        onCompleted: (response) => {
          this.$emit('onCompleted', response.token);
        },
        onReset: () => {
          this.$emit('onReset');
        },
        onHide: () => {
          this.$emit('onHide');
        },
        onError: (response) => {
          this.$emit('onError', response);
        },
        onFailed: (response) => {
          this.$emit('onFailed', response);
        },
      });
    },
  },
  mounted() {
    const scriptElement = this.loadScript(this.publicKey, this.nonce);
    // This will inject required html and css after the Arkose script is properly loaded
    scriptElement.onload = () => {
      console.log('Arkose API Script loaded');
      window.setupEnforcement = this.setupEnforcement.bind(this);
    };
    // If there is an error loading the Arkose script this callback will be called
    scriptElement.onerror = () => {
      console.log('Could not load the Arkose API Script!');
    };
  },
  destroyed() {
    if (window.myEnforcement) {
      window.myEnforcement = undefined;
      delete window.myEnforcement;
    }
    if (window.setupEnforcement) {
      delete window.setupEnforcement;
    }
  },
};
</script>
