import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Codex内ブラウザーから127.0.0.1で確認する際も、HMRとクライアント操作を許可する。
  allowedDevOrigins: ['127.0.0.1'],
  // 静的サイトとして書き出す（要件定義書 10.1）
  output: 'export',
  trailingSlash: true,
  images: {
    // 静的書き出しでは Next.js の画像最適化サーバーが使えない
    unoptimized: true,
  },
};

export default nextConfig;
