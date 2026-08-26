import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    useTypeScriptCli: false
  },
  reactCompiler: true,
  cacheComponents: true
}
export default nextConfig
