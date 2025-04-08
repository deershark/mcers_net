import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@': [path.resolve(__dirname, 'src')]
      }
    }
  }
};

export default nextConfig;
