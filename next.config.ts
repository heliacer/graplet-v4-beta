import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    useTypeScriptCli: false
  },
  images: {
    remotePatterns: [new URL('https://gravatar.com/avatar/*')]
  },
  reactCompiler: true,
  cacheComponents: true
}
export default nextConfig
