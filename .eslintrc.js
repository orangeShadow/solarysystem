module.exports = {
    env: {
        'browser': true,
    },
    extends: "airbnb-base",
    globals: {
        THREE: true,
        dat: true,
        window: true,
        document: true,
    },
    rules: {
        'max-len': 'off',
        'no-underscore-dangle': 'off',
        'class-methods-use-this': 'off',
        'no-shadow': 'off',
        'no-console': 'off',
    }
};