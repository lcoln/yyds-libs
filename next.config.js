/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@yyds-lib/airui']);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
}

module.exports = nextConfig
