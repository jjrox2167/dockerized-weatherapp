import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'node .next/standalone/server.js',
};

module.exports = nextConfig;
