let config = {
  presets: [],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        version: '7.13.7'
      }
    ]
  ]
}
if (process.env['BABEL_ENV'] === 'renderer') {
  config.presets.push(['@babel/preset-env', { modules: false }])
}
if (process.env['BABEL_ENV'] === 'main') {
  config.presets.push(['@babel/preset-env', { targets: { node: 12 } }])
}
module.exports = config
