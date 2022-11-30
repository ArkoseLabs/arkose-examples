module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {
    semi: ['error', 'always']
  }
};
