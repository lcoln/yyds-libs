/** @type {import('next').NextConfig} */
const UnoCSS = require("@unocss/webpack").default;
const presetAttributify = require("@unocss/preset-attributify").default;

const nextConfig = {
  // reactStrictMode: true,
  webpack: (
    config,
  ) => {
    config.plugins.push(UnoCSS({ presets: [presetAttributify()] }));
    return config
  },
  images: {
    domains: ['cdn.discordapp.com'],
  },
}

module.exports = nextConfig
