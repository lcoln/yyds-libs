/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@yyds-lib/airui']);

const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   runtime: 'edge',
  //   serverComponents: true,
  //   asyncWebAssembly: true,
  // },
  // webpack: (
  //   config,
  // ) => {
  //   // Important: return the modified config
  //   // console.log(config)
  //   config.module.rules.push({
  //     test: /\.wasm$/,
  //     loaders: ['wasm-loader']
  //   })
  //   return config
  // }
}

module.exports = nextConfig
