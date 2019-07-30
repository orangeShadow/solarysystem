module.exports = {
  env: {
    'browser': true,
  },
  extends: "airbnb-base",
  globals: {
    THREE: true,
    TWEEN: true,
    dat: true,
    window: true,
    document: true,
  },
  rules: {
    "global-require": ['off'],
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 9, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 9, multiline: true, consistent: true }
    }],
    'max-len': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
  }
};