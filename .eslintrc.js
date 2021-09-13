module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    // '@nuxtjs',
    // 'plugin:prettier/recommended',
    // 'plugin:nuxt/recommended',
    'standard',
    'plugin:vue/essential',
    '@vue/standard'
  ],
  plugins: [
    //'@vue'
  ],
  // add your custom rules here
  rules: {
    semi: [1, 'always'],
    'space-before-function-paren': ['error', 'never'],
    quotes: 'off',
    'comma-dangle': 'off',
    allowAsStatement: 0
  }
};
