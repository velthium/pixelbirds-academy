/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs-gw.stargaze-apis.com' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: '*.stargaze.zone' },
      { protocol: 'https', hostname: '*.cloudflare-ipfs.com' },
      { protocol: 'https', hostname: 'nftstorage.link' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
    ],
  },
};

export default nextConfig;
