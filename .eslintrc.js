module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jasmine: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: "module"
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "prettier/prettier": 0,
    'no-console': 'off',
    "no-unused-vars": "off"
  }
}
