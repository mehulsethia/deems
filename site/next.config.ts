import type { NextConfig } from 'next';

/** Static export: the site is plain HTML/CSS/JS in out/, deployable anywhere (Vercel, Netlify, Cloudflare Pages, S3). */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
