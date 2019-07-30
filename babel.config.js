module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        browsers: [
          'IOS >= 11',
          'Safari >= 11',
          'Android >= 7',
        ],
      },
    }],
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],
};
