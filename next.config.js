/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@linteng/airui']);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
}

module.exports = withTM(nextConfig)
