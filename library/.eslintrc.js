module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    it: true,
    assert: true,
    contract: true,
    after: true,
    before: true,
    beforeAll: true,
    web3: true,
    describe: true,
    artifacts: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-console": 0
  },
  "extends": ["plugin:prettier/recommended"]
};
