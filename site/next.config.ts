import path from 'node:path';
import type { NextConfig } from 'next';

/** Static export: the site is plain HTML/CSS/JS in out/, deployable anywhere (Vercel, Netlify, Cloudflare Pages, S3). */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // site/ is its own project inside the app repo; build from here, not the repo root.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
