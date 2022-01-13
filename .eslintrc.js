module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    '@typescript-eslint/explicit-function-return-type': ['error'],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }]
  }
}
